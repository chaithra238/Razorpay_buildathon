from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Payment, RecoveryCase, AuditEvent
from .serializers import (
	PaymentSerializer,
	AuditEventSerializer,
)
from .services.recovery_engine import (
	analyze_payment,
	validate_recovery_action,
)


@api_view(["GET"])
def payment_list(request):

	payments = Payment.objects.all()

	serializer = PaymentSerializer(
		payments,
		many=True
	)

	return Response(serializer.data)


@api_view(["POST"])
def analyze_recovery(request):

	payment_id = request.data.get("paymentId")

	if not payment_id:

		return Response(
			{
				"error": "paymentId is required."
			},
			status=status.HTTP_400_BAD_REQUEST,
		)

	try:

		payment = Payment.objects.get(id=payment_id)

	except Payment.DoesNotExist:

		return Response(
			{"error": "Payment not found."},
			status=status.HTTP_404_NOT_FOUND,
		)

	decision = analyze_payment(payment)

	policy_result = validate_recovery_action(payment, decision)

	recovery_case, created = RecoveryCase.objects.update_or_create(

		payment=payment,

		defaults={

			"diagnosis": decision["diagnosis"],

			"recommended_action":
				decision["recommendedAction"],

			"confidence":
				decision.get("confidence", ""),

			"policy_allowed":
				policy_result.get("allowed", False),

			"policy_reason":
				policy_result.get("reason", ""),

			"requires_human_approval":
				policy_result.get("requiresHumanApproval", False),

		}

	)

	if policy_result.get("requiresHumanApproval"):

		recovery_case.recovery_status = "human_review"

	else:

		recovery_case.recovery_status = "waiting"

	recovery_case.save()

	AuditEvent.objects.create(

		payment=payment,

		event="Recovery analysis completed",

		description=(
			f"Diagnosis: {decision['diagnosis']}. "
			f"Recommended action: {decision['recommendedAction']}."
		),

		event_type="ai",

	)

	AuditEvent.objects.create(

		payment=payment,

		event="Policy validation completed",

		description=policy_result.get("reason", ""),

		event_type="policy",

	)

	return Response({
		"paymentId": payment.id,
		"payment": PaymentSerializer(payment).data,
		"decision": decision,
		"policy": policy_result,
	})


@api_view(["POST"])
def execute_recovery(request):

	payment_id = request.data.get("paymentId")

	try:

		payment = Payment.objects.get(id=payment_id)

	except Payment.DoesNotExist:
		return Response({"error": "Payment not found"}, status=404)

	try:

		recovery_case = RecoveryCase.objects.get(payment=payment)

	except RecoveryCase.DoesNotExist:
		return Response(
			{"error": "Recovery analysis must be completed first"},
			status=400,
		)

	if not recovery_case.policy_allowed:
		recovery_case.recovery_status = "human_review"
		recovery_case.save()

		AuditEvent.objects.create(
			payment=payment,
			event="Recovery requires human review",
			description="The recovery action was blocked by policy.",
			event_type="review",
		)

		return Response({
			"success": False,
			"message": "Recovery requires human approval.",
		})

	payment.status = "recovered"
	payment.save()

	recovery_case.recovery_status = "recovered"
	recovery_case.recovered_amount = payment.amount
	recovery_case.save()

	AuditEvent.objects.create(
		payment=payment,
		event="Payment successfully recovered",
		description=f"₹{payment.amount} was successfully recovered.",
		event_type="success",
	)

	return Response({
		"success": True,
		"message": "Payment successfully recovered.",
	})



@api_view(["GET"])
def audit_event_list(request):

	audit_events = AuditEvent.objects.all().order_by(
		"-timestamp"
	)

	serializer = AuditEventSerializer(
		audit_events,
		many=True
	)

	return Response(serializer.data)



@api_view(["GET"])
def dashboard_stats(request):
	total_payments = Payment.objects.count()

	at_risk_payments = Payment.objects.filter(
		status="at_risk"
	).count()

	recovered_payments = Payment.objects.filter(
		status="recovered"
	).count()

	payments_analyzed = RecoveryCase.objects.count()

	recovery_attempts = RecoveryCase.objects.filter(
		recovery_status__in=[
			"in_progress",
			"recovered",
		]
	).count()

	successful_recoveries = RecoveryCase.objects.filter(
		recovery_status="recovered"
	).count()

	human_review_cases = RecoveryCase.objects.filter(
		recovery_status="human_review"
	).count()

	recovered_cases = RecoveryCase.objects.filter(
		recovery_status="recovered"
	)

	total_recovered_amount = sum(
		case.recovered_amount
		for case in recovered_cases
	)

	recovery_rate = 0

	if recovery_attempts > 0:

		recovery_rate = round(
			(
				successful_recoveries
				/ recovery_attempts
			) * 100,
			2
		)

	return Response({

		"totalPayments": total_payments,

		"atRiskPayments": at_risk_payments,

		"recoveredPayments": recovered_payments,

		"paymentsAnalyzed": payments_analyzed,

		"recoveryAttempts": recovery_attempts,

		"successfulRecoveries": successful_recoveries,

		"humanReviewCases": human_review_cases,

		"totalRecoveredAmount": float(
			total_recovered_amount
		),

		"recoveryRate": recovery_rate,

	})

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
from .services.execution_engine import execute_recovery


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
def execute_recovery_action(request):

	payment_id = request.data.get("paymentId")

	if not payment_id:

		return Response(
			{"error": "paymentId is required."},
			status=status.HTTP_400_BAD_REQUEST,
		)


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

	try:

		payment = Payment.objects.get(id=payment_id)

	except Payment.DoesNotExist:

		return Response({"error": "Payment not found."}, status=status.HTTP_404_NOT_FOUND)

	try:

		recovery_case = RecoveryCase.objects.get(payment=payment)

	except RecoveryCase.DoesNotExist:

		return Response(
			{"error": "Recovery analysis must be completed before execution."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	result = execute_recovery(payment, recovery_case)

	# Update recovery status
	recovery_case.recovery_status = result["status"]
	recovery_case.recovered_amount = result["recoveredAmount"]
	recovery_case.save()

	# If recovery succeeded, update payment status
	if result["success"]:
		payment.status = "recovered"
		payment.save()

	# Create execution audit event
	AuditEvent.objects.create(
		payment=payment,
		event="Recovery Action Executed",
		description=(f"Recovery action initiated: {recovery_case.recommended_action}"),
		event_type="action",
	)

	# If recovery succeeded, create success audit event
	if result["success"]:
		AuditEvent.objects.create(
			payment=payment,
			event="Payment Recovered",
			description=(f"₹{payment.amount} was successfully recovered."),
			event_type="success",
		)

	# If human approval is required
	elif result["status"] == "human_review":
		AuditEvent.objects.create(
			payment=payment,
			event="Human Approval Requested",
			description=(
				"Automatic recovery action was blocked " "and requires human approval."
			),
			event_type="review",
		)

	return Response(
		{
			"paymentId": payment.id,
			"success": result["success"],
			"message": result["message"],
			"recoveredAmount": result["recoveredAmount"],
			"recoveryStatus": recovery_case.recovery_status,
		}
	)

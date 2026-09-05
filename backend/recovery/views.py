from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .models import Payment, RecoveryCase, AuditEvent, Merchant
from ai_engine.risk_engine import calculate_risk
from ai_engine.recovery_decision import get_recovery_decision
from ai_engine.policy_engine import validate_recovery_policy
from .serializers import (
	PaymentSerializer,
	AuditEventSerializer,
)
from .services.recovery_engine import (
	analyze_payment as recovery_analyze_payment,
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

	decision = recovery_analyze_payment(payment)

	policy_result = validate_recovery_action(payment, decision)

	recovery_case, created = RecoveryCase.objects.update_or_create(

		payment=payment,

		defaults={

			"diagnosis": decision["diagnosis"],

			"recommended_action":
				decision["recommended_action"],

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
				f"Recommended action: {decision['recommended_action']}."
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
		"decision": {
			"diagnosis": decision["diagnosis"],
			"recommendedAction": decision["recommended_action"],
			"confidence": decision["confidence"],
			"requiresHumanApproval": decision["requires_human_approval"],
		},
		"policy": policy_result,
	})


@api_view(["POST"])
def execute_recovery_legacy(request):

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



@api_view(["POST"])
def execute_recovery(request, payment_id=None):
	"""Initiate recovery for an analyzed payment."""
	# The request-body fallback keeps the original endpoint usable as well.
	payment_id = payment_id or request.data.get("paymentId")

	try:
		payment = Payment.objects.get(id=payment_id)
		recovery_case = RecoveryCase.objects.get(payment=payment)
	except Payment.DoesNotExist:
		return Response(
			{"error": "Payment not found"},
			status=status.HTTP_404_NOT_FOUND,
		)
	except RecoveryCase.DoesNotExist:
		return Response(
			{"error": "Payment must be analyzed before recovery."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	if recovery_case.requires_human_approval:
		recovery_case.recovery_status = "human_review"
		recovery_case.save()

		AuditEvent.objects.create(
			payment=payment,
			event="Recovery requires human approval",
			description=(
				"AI recommended: " + recovery_case.recommended_action
			),
			event_type="review",
		)

		return Response({
			"message": "Recovery action requires human approval.",
			"recovery_status": "human_review",
		})

	recovery_case.recovery_status = "in_progress"
	recovery_case.save()

	AuditEvent.objects.create(
		payment=payment,
		event="Recovery action initiated",
		description=(
			"Executing: " + recovery_case.recommended_action
		),
		event_type="action",
	)

	return Response({
		"message": "Recovery action initiated successfully.",
		"recommended_action": recovery_case.recommended_action,
		"recovery_status": "in_progress",
	})


@api_view(["POST"])
def complete_recovery(request, payment_id):
	"""Mark an in-progress recovery as recovered and record its outcome."""
	try:
		payment = Payment.objects.get(id=payment_id)
		recovery_case = RecoveryCase.objects.get(payment=payment)
	except Payment.DoesNotExist:
		return Response(
			{"error": "Payment not found"},
			status=status.HTTP_404_NOT_FOUND,
		)
	except RecoveryCase.DoesNotExist:
		return Response(
			{"error": "Recovery case not found"},
			status=status.HTTP_404_NOT_FOUND,
		)

	if recovery_case.recovery_status != "in_progress":
		return Response(
			{"error": "Recovery must be in progress before completion."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	recovery_case.recovery_status = "recovered"
	recovery_case.recovered_amount = payment.amount
	recovery_case.save()

	payment.status = "recovered"
	payment.save()

	AuditEvent.objects.create(
		payment=payment,
		event="Payment recovered successfully",
		description=(
			f"Recovered ₹{payment.amount} using "
			f"{recovery_case.recommended_action}"
		),
		event_type="success",
	)

	return Response({
		"message": "Payment recovered successfully.",
		"payment_id": payment.id,
		"recovered_amount": payment.amount,
		"payment_status": payment.status,
		"recovery_status": recovery_case.recovery_status,
	})


@api_view(["GET"])
def get_recovery_case(request, payment_id):
	"""Return the saved recovery analysis and current recovery outcome."""
	try:
		payment = Payment.objects.get(id=payment_id)
		recovery_case = RecoveryCase.objects.get(payment=payment)
	except Payment.DoesNotExist:
		return Response(
			{"error": "Payment not found"},
			status=status.HTTP_404_NOT_FOUND,
		)
	except RecoveryCase.DoesNotExist:
		return Response(
			{"error": "No recovery analysis found for this payment."},
			status=status.HTTP_404_NOT_FOUND,
		)

	return Response({
		"payment_id": payment.id,
		"customer": payment.customer,
		"risk_score": recovery_case.risk_score,
		"risk_level": payment.risk_level,
		"diagnosis": recovery_case.diagnosis,
		"recommended_action": recovery_case.recommended_action,
		"confidence": recovery_case.confidence,
		"policy_allowed": recovery_case.policy_allowed,
		"policy_reason": recovery_case.policy_reason,
		"requires_human_approval": recovery_case.requires_human_approval,
		"recovery_status": recovery_case.recovery_status,
		"recovered_amount": recovery_case.recovered_amount,
	})


@api_view(["POST"])
def approve_recovery(request, payment_id):
	"""Record merchant approval for a recovery case requiring review."""
	try:
		payment = Payment.objects.get(id=payment_id)
		recovery_case = RecoveryCase.objects.get(payment=payment)
	except Payment.DoesNotExist:
		return Response(
			{"error": "Payment not found"},
			status=status.HTTP_404_NOT_FOUND,
		)
	except RecoveryCase.DoesNotExist:
		return Response(
			{"error": "Recovery case not found"},
			status=status.HTTP_404_NOT_FOUND,
		)

	if not recovery_case.requires_human_approval:
		return Response(
			{"error": "This recovery case does not require human approval."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	recovery_case.recovery_status = "in_progress"
	recovery_case.save()

	AuditEvent.objects.create(
		payment=payment,
		event="Recovery approved by merchant",
		description=(
			"Merchant approved AI recommendation: "
			+ recovery_case.recommended_action
		),
		event_type="action",
	)

	return Response({
		"message": "Recovery approved successfully.",
		"payment_id": payment.id,
		"recovery_status": recovery_case.recovery_status,
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


@api_view(["POST"])
def analyze_payment_view(request, payment_id):

	try:

		payment = Payment.objects.get(id=payment_id)

	except Payment.DoesNotExist:

		return Response(
			{"error": "Payment not found"},
			status=status.HTTP_404_NOT_FOUND,
		)

	analysis = recovery_analyze_payment(payment)

	payment.risk_level = analysis["risk_level"]
	payment.save()

	recovery_status = (
		"human_review"
		if analysis["requires_human_approval"]
		else "waiting"
	)

	recovery_case, created = RecoveryCase.objects.update_or_create(
		payment=payment,
		defaults={
			"risk_score": analysis["risk_score"],
			"diagnosis": analysis["diagnosis"],
			"recommended_action": analysis["recommended_action"],
			"confidence": str(analysis["confidence"]),
			"policy_allowed": analysis["policy_allowed"],
			"policy_reason": analysis["policy_reason"],
			"requires_human_approval": analysis["requires_human_approval"],
			"recovery_status": recovery_status,
		},
	)

	return Response({
		"message": "Payment analyzed successfully",
		"payment_id": payment.id,
		"created": created,
		"analysis": analysis,
		"recovery_status": recovery_case.recovery_status,
	})


@api_view(["GET"])
def analyze_payment(request, payment_id):

	try:
		payment = Payment.objects.get(id=payment_id)

	except Payment.DoesNotExist:
		return Response(
			{"error": "Payment not found"},
			status=status.HTTP_404_NOT_FOUND,
		)

	risk_analysis = calculate_risk(payment)
	decision = get_recovery_decision(
		payment,
		risk_analysis,
	)
	policy = validate_recovery_policy(payment, decision)

	payment.risk_level = risk_analysis["risk_level"]
	payment.save()

	recovery_status = (
		"human_review"
		if policy["requires_human_approval"]
		else "waiting"
	)

	recovery_case, created = RecoveryCase.objects.update_or_create(
		payment=payment,
		defaults={
			"risk_score": risk_analysis["risk_score"],
			"diagnosis": (
				"Risk factors: "
				+ ", ".join(risk_analysis["reasons"])
			),
			"recommended_action": decision["recommended_action"],
			"confidence": str(decision["confidence"]),
			"policy_allowed": policy["allowed"],
			"policy_reason": policy["reason"],
			"requires_human_approval": policy["requires_human_approval"],
			"recovery_status": recovery_status,
		},
	)

	AuditEvent.objects.create(
		payment=payment,
		event="AI payment analysis completed",
		description=(
			f"Risk score: {risk_analysis['risk_score']}/100. "
			f"Recommended action: {decision['recommended_action']}."
		),
		event_type="ai",
	)

	return Response({
		"message": "Payment analyzed successfully",
		"payment_id": payment.id,
		"customer": payment.customer,
		"created": created,
		"risk_analysis": risk_analysis,
		"recovery_decision": decision,
		"policy": policy,
		"recovery_status": recovery_case.recovery_status,
	})


@api_view(["POST"])
def register_merchant(request):
	business_name = request.data.get("business_name", "").strip()
	full_name = request.data.get("full_name", "").strip()
	email = request.data.get("email", "").strip().lower()
	phone_number = request.data.get("phone_number", "").strip()
	password = request.data.get("password", "")
	gstin = request.data.get("gstin", "").strip()

	if not all([business_name, full_name, email, phone_number, password]):
		return Response(
			{"error": "All required fields must be provided."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	if User.objects.filter(username=email).exists():
		return Response(
			{"error": "An account with this email already exists."},
			status=status.HTTP_400_BAD_REQUEST,
		)

	try:
		validate_password(password)
	except ValidationError as error:
		return Response(
			{"error": list(error.messages)},
			status=status.HTTP_400_BAD_REQUEST,
		)

	name_parts = full_name.split(" ", 1)
	first_name = name_parts[0]
	last_name = name_parts[1] if len(name_parts) > 1 else ""

	user = User.objects.create_user(
		username=email,
		email=email,
		password=password,
		first_name=first_name,
		last_name=last_name,
	)

	merchant = Merchant.objects.create(
		user=user,
		business_name=business_name,
		phone_number=phone_number,
		gstin=gstin,
	)

	return Response(
		{
			"message": "Merchant account created successfully.",
			"merchant": {
				"id": merchant.id,
				"business_name": merchant.business_name,
				"email": user.email,
				"full_name": full_name,
			},
		},
		status=status.HTTP_201_CREATED,
	)

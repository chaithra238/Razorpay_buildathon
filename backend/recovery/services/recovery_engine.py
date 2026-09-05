from decimal import Decimal


def analyze_payment(payment):
    score = 0
    reasons = []

    failure_scores = {
        "Bank Timeout": 30,
        "Payment Abandoned": 40,
        "Gateway Error": 60,
    }
    score += failure_scores.get(payment.failure_reason, 20)
    reasons.append(f"Failure reason: {payment.failure_reason}")

    amount = Decimal(payment.amount)
    if amount >= 10000:
        score += 25
        reasons.append("High transaction amount")
    elif amount >= 5000:
        score += 15
        reasons.append("Medium transaction amount")
    else:
        score += 5
        reasons.append("Low transaction amount")

    payment_method_scores = {
        "UPI": 10,
        "Card": 15,
        "Net Banking": 12,
    }
    score += payment_method_scores.get(payment.payment_method, 10)
    reasons.append(f"Payment method: {payment.payment_method}")

    score = min(score, 100)

    if score >= 70:
        risk_level = "high"
    elif score >= 40:
        risk_level = "medium"
    else:
        risk_level = "low"

    if payment.failure_reason == "Bank Timeout":
        recommended_action = "Retry Payment"
        confidence = 85
        requires_human_approval = False
    elif payment.failure_reason == "Payment Abandoned":
        recommended_action = "Send Payment Reminder"
        confidence = 90
        requires_human_approval = False
    elif payment.failure_reason == "Gateway Error":
        recommended_action = "Human Review"
        confidence = 80
        requires_human_approval = True
    else:
        recommended_action = "Manual Investigation"
        confidence = 60
        requires_human_approval = True

    if requires_human_approval:
        policy_allowed = False
        policy_reason = "This recovery action requires human approval."
    else:
        policy_allowed = True
        policy_reason = "Automatic recovery action is allowed."

    diagnosis = (
        "Payment was analyzed based on failure reason, transaction amount, "
        "and payment method. Risk factors identified: "
        f"{', '.join(reasons)}."
    )

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "diagnosis": diagnosis,
        "recommended_action": recommended_action,
        "confidence": confidence,
        "policy_allowed": policy_allowed,
        "policy_reason": policy_reason,
        "requires_human_approval": requires_human_approval,
    }


def validate_recovery_action(payment, decision):

    # Rule 1:
    # If the recovery decision requires human approval,
    # automatic execution is blocked.

    if decision["requires_human_approval"]:

        return {
            "allowed": False,

            "reason":
                "AI decision requires human approval before execution.",

            "requiresHumanApproval": True,
        }


    # Rule 2:
    # High-value payments require approval.

    if payment.amount > 10000:

        return {
            "allowed": False,

            "reason":
                "Payment exceeds the automatic recovery threshold of ₹10,000.",

            "requiresHumanApproval": True,
        }


    # Rule 3:
    # Action is safe for automatic execution.

    return {
        "allowed": True,

        "reason":
            "Recovery action is within the configured policy limits.",

        "requiresHumanApproval": False,
    }

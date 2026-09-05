def get_recovery_decision(payment, risk_analysis):
    risk_score = risk_analysis["risk_score"]
    risk_level = risk_analysis["risk_level"]

    failure_reason = payment.failure_reason.lower()

    if "gateway" in failure_reason:
        return {
            "recommended_action": "Human Review",
            "confidence": 85,
            "requires_human_approval": True,
            "reason": (
                "Gateway failures may require manual verification "
                "before retrying the payment."
            ),
        }

    if "bank timeout" in failure_reason:
        if risk_level == "high":
            return {
                "recommended_action": "Retry Payment",
                "confidence": 90,
                "requires_human_approval": False,
                "reason": (
                    "The payment failed due to a temporary bank timeout "
                    "and can be retried."
                ),
            }

        return {
            "recommended_action": "Wait and Retry",
            "confidence": 80,
            "requires_human_approval": False,
            "reason": (
                "The payment may succeed after waiting for the banking "
                "system to stabilize."
            ),
        }

    if "abandoned" in failure_reason:
        return {
            "recommended_action": "Send Payment Reminder",
            "confidence": 88,
            "requires_human_approval": False,
            "reason": (
                "The customer did not complete the payment. A reminder "
                "may help recover the transaction."
            ),
        }

    if risk_score >= 70:
        return {
            "recommended_action": "Human Review",
            "confidence": 75,
            "requires_human_approval": True,
            "reason": (
                "The payment has a high risk score and requires human "
                "verification."
            ),
        }

    return {
        "recommended_action": "Manual Investigation",
        "confidence": 60,
        "requires_human_approval": True,
        "reason": (
            "The system does not have enough confidence to recommend "
            "automatic recovery."
        ),
    }

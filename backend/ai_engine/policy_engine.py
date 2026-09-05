def validate_recovery_policy(payment, decision):
    """Apply deterministic approval safeguards to an AI recommendation."""
    amount = float(payment.amount)
    recommended_action = decision["recommended_action"]
    risk_level = payment.risk_level

    # High-value payments require human approval.
    if amount >= 10000:
        return {
            "allowed": False,
            "requires_human_approval": True,
            "reason": (
                "High-value payments require "
                "human approval before recovery."
            ),
        }

    # Human-review recommendations cannot be automatically executed.
    if recommended_action == "Human Review":
        return {
            "allowed": False,
            "requires_human_approval": True,
            "reason": "AI recommended manual human review.",
        }

    # High-risk payments require review regardless of the recommended action.
    if risk_level == "high":
        return {
            "allowed": False,
            "requires_human_approval": True,
            "reason": (
                "High-risk payments cannot be "
                "automatically recovered."
            ),
        }

    return {
        "allowed": True,
        "requires_human_approval": False,
        "reason": (
            "Recovery action is allowed "
            "under the automated recovery policy."
        ),
    }

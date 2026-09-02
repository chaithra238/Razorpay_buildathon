def validate_recovery_action(payment, decision):

    # Rule 1:
    # If the recovery decision requires human approval,
    # automatic execution is blocked.

    if decision["requiresHumanApproval"]:

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
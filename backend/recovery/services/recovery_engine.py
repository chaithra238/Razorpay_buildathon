def analyze_payment(payment):

    failure_reason = payment.failure_reason


    if failure_reason == "Bank Timeout":

        return {
            "diagnosis":
                "The payment failed because the bank did not respond within the expected time.",

            "recommendedAction":
                "Wait and Retry",

            "confidence":
                "high",

            "requiresHumanApproval":
                False,
        }


    elif failure_reason == "Payment Abandoned":

        return {
            "diagnosis":
                "The customer started the payment process but did not complete the transaction.",

            "recommendedAction":
                "Send Reminder",

            "confidence":
                "medium",

            "requiresHumanApproval":
                False,
        }


    elif failure_reason == "Gateway Error":

        return {
            "diagnosis":
                "The payment could not be completed because of a payment gateway issue.",

            "recommendedAction":
                "Human Review",

            "confidence":
                "medium",

            "requiresHumanApproval":
                True,
        }


    else:

        return {
            "diagnosis":
                "The system could not confidently determine the failure reason.",

            "recommendedAction":
                "Human Review",

            "confidence":
                "low",

            "requiresHumanApproval":
                True,
        }


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
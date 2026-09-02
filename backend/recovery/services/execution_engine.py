def execute_recovery(payment, recovery_case):

    # Policy blocked
    if not recovery_case.policy_allowed:

        return {
            "success": False,

            "message":
                "Recovery action requires human approval.",

            "recoveredAmount": 0,

            "status": "human_review",
        }

    # Wait and Retry
    if recovery_case.recommended_action == "Wait and Retry":

        return {
            "success": True,

            "message":
                "Payment was successfully recovered after the retry.",

            "recoveredAmount": float(payment.amount),

            "status": "recovered",
        }

    # Send Reminder
    if recovery_case.recommended_action == "Send Reminder":

        return {
            "success": False,

            "message":
                "Recovery action was initiated. Waiting for customer response.",

            "recoveredAmount": 0,

            "status": "in_progress",
        }

    # Default fallback
    return {
        "success": False,

        "message":
            "Recovery action could not be automatically executed.",

        "recoveredAmount": 0,

        "status": "human_review",
    }

from .recovery_engine import analyze_payment
from .policy_engine import validate_recovery_action


def run_recovery_agent(payment):

    # Step 1: Analyze the failed payment
    decision = analyze_payment(payment)

    # Step 2: Validate the recommended action
    policy_result = validate_recovery_action(
        payment,
        decision
    )

    return {
        "decision": decision,
        "policy": policy_result,
    }

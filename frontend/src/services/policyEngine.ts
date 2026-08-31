import type { Payment } from "../types/payment";
import type { RecoveryDecision } from "./recoveryEngine";

export interface PolicyResult {
  allowed: boolean;
  reason: string;
  requiresHumanApproval: boolean;
}

export function validateRecoveryAction(
  payment: Payment,
  decision: RecoveryDecision
): PolicyResult {
  /*
    Rule 1:
    If AI explicitly requests human review,
    automatic execution is blocked.
  */

  if (decision.requiresHumanApproval) {
    return {
      allowed: false,
      reason: "AI decision requires human approval before execution.",
      requiresHumanApproval: true,
    };
  }

  /*
    Rule 2:
    High-value payments require approval.
  */

  if (payment.amount > 10000) {
    return {
      allowed: false,
      reason: "Payment exceeds the automatic recovery threshold of ₹10,000.",
      requiresHumanApproval: true,
    };
  }

  /*
    Rule 3:
    Action is safe for automatic execution.
  */

  return {
    allowed: true,
    reason: "Recovery action is within the configured policy limits.",
    requiresHumanApproval: false,
  };
}

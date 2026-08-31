import type { Payment } from "../types/payment";

export interface RecoveryDecision {
  diagnosis: string;

  recommendedAction: string;

  confidence: "low" | "medium" | "high";

  requiresHumanApproval: boolean;
}

export function analyzePayment(
  payment: Payment
): RecoveryDecision {
  switch (payment.failureReason) {
    case "Bank Timeout":
      return {
        diagnosis:
          "The payment failed because the bank did not respond within the expected time.",

        recommendedAction: "Wait and Retry",

        confidence: "high",

        requiresHumanApproval: false,
      };

    case "Payment Abandoned":
      return {
        diagnosis:
          "The customer started the payment process but did not complete the transaction.",

        recommendedAction: "Send Reminder",

        confidence: "medium",
        requiresHumanApproval: false,
      };

    case "Gateway Error":
      return {
        diagnosis:
          "The payment could not be completed because of a payment gateway issue.",

        recommendedAction: "Human Review",

        confidence: "medium",
        requiresHumanApproval: true,
      };

    default:
      return {
        diagnosis:
          "The system could not confidently determine the failure reason.",

        recommendedAction: "Human Review",

        confidence: "low",

        requiresHumanApproval: true,
      };
  }
}

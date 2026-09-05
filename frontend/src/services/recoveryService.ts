import type { Payment } from "../types/payment";
import { api } from "./api";

import type { RecoveryDecision } from "./recoveryEngine";
import type { PolicyResult } from "./policyEngine";

export interface RecoveryAnalysisResponse {

  paymentId: string;

  payment: Payment;

  decision: RecoveryDecision;
  policy: PolicyResult;

}

export async function analyzeRecovery(
  paymentId: string
): Promise<RecoveryAnalysisResponse> {

  const response = await api.post(
    "/recovery/analyze/",
    {
      paymentId,
    }
  );

  return response.data;

}

export interface RecoveryExecutionResponse {
  paymentId: string;

  success: boolean;

  message: string;

  recoveredAmount: number;

  recoveryStatus: string;
}

export async function executeRecovery(
  paymentId: string
): Promise<RecoveryExecutionResponse> {

  const response = await api.post(
    "/recovery/execute/",
    {
      paymentId,
    }
  );

  return response.data;

}

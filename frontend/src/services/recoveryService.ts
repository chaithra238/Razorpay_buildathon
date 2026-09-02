import axios from "axios";

import type { Payment } from "../types/payment";

import type { RecoveryDecision } from "./recoveryEngine";
import type { PolicyResult } from "./policyEngine";

const API_URL =
  "http://127.0.0.1:8000/api";

export interface RecoveryAnalysisResponse {

  paymentId: string;

  payment: Payment;

  decision: RecoveryDecision;
  policy: PolicyResult;

}

export async function analyzeRecovery(
  paymentId: string
): Promise<RecoveryAnalysisResponse> {

  const response = await axios.post(
    `${API_URL}/recovery/analyze/`,
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

  const response = await axios.post(
    `${API_URL}/recovery/execute/`,
    {
      paymentId,
    }
  );

  return response.data;

}

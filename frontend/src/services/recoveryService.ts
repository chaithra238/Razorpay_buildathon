import type { Payment } from "../types/payment";
import { api } from "./api";

import type { RecoveryDecision as LegacyRecoveryDecision } from "./recoveryEngine";
import type { PolicyResult } from "./policyEngine";

export interface RecoveryAnalysisResponse {

  paymentId: string;

  payment: Payment;

  decision: LegacyRecoveryDecision;
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

export interface ExecuteRecoveryResponse {
  message: string;
  recommended_action?: string;
  recovery_status: string;
}

export async function executeRecovery(
  paymentId: string
): Promise<ExecuteRecoveryResponse> {

  const response = await api.post(
    `/payments/${paymentId}/execute-recovery/`
  );

  return response.data;

}

export interface RiskAnalysis {
  risk_score: number;
  risk_level: string;
  reasons: string[];
}

export interface RecoveryDecision {
  recommended_action: string;
  confidence: number;
  requires_human_approval: boolean;
  reason: string;
}

export interface AnalyzePaymentResponse {
  message: string;
  payment_id: string;
  customer: string;
  created: boolean;
  risk_analysis: RiskAnalysis;
  recovery_decision: RecoveryDecision;
  recovery_status: string;
}

export async function analyzePayment(
  paymentId: string
): Promise<AnalyzePaymentResponse> {
  const response = await api.get(
    `/payments/${paymentId}/analyze/`
  );

  return response.data;
}

export interface CompleteRecoveryResponse {
  message: string;
  payment_id: string;
  recovered_amount: number;
  payment_status: string;
  recovery_status: string;
}

export async function completeRecovery(
  paymentId: string
): Promise<CompleteRecoveryResponse> {
  const response = await api.post(
    `/payments/${paymentId}/complete-recovery/`
  );

  return response.data;
}

export interface RecoveryCaseResponse {
  payment_id: string;
  customer: string;
  risk_score: number;
  risk_level: string;
  diagnosis: string;
  recommended_action: string;
  confidence: string;
  policy_allowed: boolean;
  policy_reason: string;
  requires_human_approval: boolean;
  recovery_status: string;
  recovered_amount: number;
}

export async function getRecoveryCase(
  paymentId: string
): Promise<RecoveryCaseResponse> {
  const response = await api.get(
    `/payments/${paymentId}/recovery-case/`
  );

  return response.data;
}

export interface ApproveRecoveryResponse {
  message: string;
  payment_id: string;
  recovery_status: string;
}

export async function approveRecovery(
  paymentId: string
): Promise<ApproveRecoveryResponse> {
  const response = await api.post(
    `/payments/${paymentId}/approve-recovery/`
  );

  return response.data;
}

import { api } from "./api";

export interface DashboardStats {
  totalPayments: number;

  atRiskPayments: number;

  recoveredPayments: number;

  paymentsAnalyzed: number;

  recoveryAttempts: number;

  successfulRecoveries: number;

  humanReviewCases: number;

  totalRecoveredAmount: number;

  recoveryRate: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get("/dashboard/");

  return response.data;
}

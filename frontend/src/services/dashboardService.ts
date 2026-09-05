import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

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
  const response = await axios.get(
    `${API_URL}/dashboard/`
  );

  return response.data;
}

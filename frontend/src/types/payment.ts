export type PaymentStatus =
  | "at_risk"
  | "recovered";

export type RiskLevel =
  | "low"
  | "medium"
  | "high";

export type RecoveryStatus =
  | "waiting"
  | "in_progress"
  | "pending"
  | "successful";


export interface Payment {

  id: string;

  customer: string;

  amount: number;

  paymentMethod: string;

  failureReason: string;

  status: PaymentStatus;

  riskLevel: RiskLevel;

  transactionTime: string;


  recommendedAction?: string;

  recoveryStatus?: RecoveryStatus;

  recovered?: boolean;

}
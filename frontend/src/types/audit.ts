export type AuditEvent = {
  id: string;

  paymentId: string;

  event: string;

  description: string;

  timestamp: string;

  type:
    | "failure"
    | "ai"
    | "policy"
    | "action"
    | "success"
    | "review";
};

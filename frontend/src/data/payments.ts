import type { Payment } from "../types/payment";

export const payments: Payment[] = [
  {
    id: "PAY-1001",
    customer: "Rahul Sharma",
    amount: 5000,
    paymentMethod: "UPI",

    failureReason: "Bank Timeout",

    status: "at_risk",

    riskLevel: "high",

    recommendedAction: "Wait & Retry",

    recoveryStatus: "waiting",

    transactionTime: "Today, 10:32 AM",

    recovered: false,
  },

  {
    id: "PAY-1002",
    customer: "Anjali Nair",
    amount: 8500,
    paymentMethod: "Card",

    failureReason: "Payment Abandoned",

    status: "at_risk",

    riskLevel: "medium",

    recommendedAction: "Send Reminder",

    recoveryStatus: "in_progress",

    transactionTime: "Today, 09:45 AM",

    recovered: false,
  },

  {
    id: "PAY-1003",
    customer: "Vikram Rao",
    amount: 12000,
    paymentMethod: "UPI",

    failureReason: "Gateway Error",

    status: "at_risk",

    riskLevel: "high",

    recommendedAction: "Human Review",

    recoveryStatus: "pending",

    transactionTime: "Today, 09:10 AM",

    recovered: false,
  },

  {
    id: "PAY-1004",
    customer: "Priya Menon",
    amount: 6500,
    paymentMethod: "Net Banking",

    failureReason: "Bank Timeout",

    status: "recovered",

    riskLevel: "medium",

    recommendedAction: "Wait & Retry",

    recoveryStatus: "successful",

    transactionTime: "Yesterday, 04:20 PM",

    recovered: true,
  },

  {
    id: "PAY-1005",
    customer: "Arjun Kumar",
    amount: 10000,
    paymentMethod: "UPI",

    failureReason: "Payment Abandoned",

    status: "at_risk",

    riskLevel: "medium",

    recommendedAction: "Send Payment Link",

    recoveryStatus: "in_progress",

    transactionTime: "Yesterday, 03:45 PM",

    recovered: false,
  },

  {
    id: "PAY-1006",
    customer: "Sneha Reddy",
    amount: 7500,
    paymentMethod: "Card",

    failureReason: "Bank Timeout",

    status: "recovered",

    riskLevel: "low",

    recommendedAction: "Wait & Retry",

    recoveryStatus: "successful",

    transactionTime: "Yesterday, 01:30 PM",

    recovered: true,
  },

  {
    id: "PAY-1007",
    customer: "Kiran Das",
    amount: 15000,
    paymentMethod: "UPI",

    failureReason: "Gateway Error",

    status: "at_risk",

    riskLevel: "high",

    recommendedAction: "Human Review",

    recoveryStatus: "pending",

    transactionTime: "Yesterday, 11:20 AM",

    recovered: false,
  },

  {
    id: "PAY-1008",
    customer: "Meera Nair",
    amount: 9000,
    paymentMethod: "Net Banking",

    failureReason: "Payment Abandoned",

    status: "recovered",

    riskLevel: "medium",

    recommendedAction: "Send Reminder",

    recoveryStatus: "successful",

    transactionTime: "Aug 28, 02:15 PM",

    recovered: true,
  },

  {
    id: "PAY-1009",
    customer: "Rohan Shetty",
    amount: 4500,
    paymentMethod: "UPI",

    failureReason: "Bank Timeout",

    status: "at_risk",

    riskLevel: "low",

    recommendedAction: "Wait & Retry",

    recoveryStatus: "waiting",

    transactionTime: "Aug 28, 10:40 AM",

    recovered: false,
  },

  {
    id: "PAY-1010",
    customer: "Divya Rao",
    amount: 11000,
    paymentMethod: "Card",

    failureReason: "Gateway Error",

    status: "at_risk",

    riskLevel: "high",

    recommendedAction: "Human Review",

    recoveryStatus: "pending",

    transactionTime: "Aug 27, 05:00 PM",

    recovered: false,
  },
];

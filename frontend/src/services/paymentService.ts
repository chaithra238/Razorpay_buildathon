import axios from "axios";

import type { Payment } from "../types/payment";
import { payments as mockPayments } from "../data/payments";


const API_URL =
  "http://127.0.0.1:8000/api";


export async function getPayments(): Promise<Payment[]> {

  try {

    const response = await axios.get(`${API_URL}/payments/`);

    const payments = response.data.map((payment: Payment) => ({
      ...payment,
      amount: Number(payment.amount),
    }));

    return payments;

  } catch (err) {

    // Backend unreachable — fall back to local mock data so the UI remains usable.
    console.warn("getPayments() failed, using local mock payments:", err);

    // Ensure amounts are numbers
    return mockPayments.map((p) => ({ ...p, amount: Number(p.amount) }));

  }

}
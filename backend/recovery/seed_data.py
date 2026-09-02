from recovery.models import Payment


def seed_payments():

    payments = [

        {
            "id": "PAY-1001",
            "customer": "Rahul Sharma",
            "amount": 5000,
            "payment_method": "UPI",
            "failure_reason": "Bank Timeout",
            "risk_level": "high",
            "status": "at_risk",
            "transaction_time": "2026-09-02 10:30 AM",
        },

        {
            "id": "PAY-1002",
            "customer": "Ananya Nair",
            "amount": 2500,
            "payment_method": "UPI",
            "failure_reason": "Payment Abandoned",
            "risk_level": "medium",
            "status": "at_risk",
            "transaction_time": "2026-09-02 11:15 AM",
        },

        {
            "id": "PAY-1003",
            "customer": "Vikram Rao",
            "amount": 12000,
            "payment_method": "Card",
            "failure_reason": "Gateway Error",
            "risk_level": "high",
            "status": "at_risk",
            "transaction_time": "2026-09-02 12:00 PM",
        },

        {
            "id": "PAY-1004",
            "customer": "Meera Menon",
            "amount": 7500,
            "payment_method": "UPI",
            "failure_reason": "Insufficient Balance",
            "risk_level": "medium",
            "status": "at_risk",
            "transaction_time": "2026-09-02 01:30 PM",
        },

        {
            "id": "PAY-1005",
            "customer": "Arjun Kumar",
            "amount": 3200,
            "payment_method": "Net Banking",
            "failure_reason": "Bank Timeout",
            "risk_level": "low",
            "status": "at_risk",
            "transaction_time": "2026-09-02 02:45 PM",
        },

    ]

    for payment_data in payments:

        Payment.objects.get_or_create(

            id=payment_data["id"],

            defaults=payment_data

        )

    print("Payment data added successfully.")

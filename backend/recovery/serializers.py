from rest_framework import serializers

from .models import Payment, AuditEvent


class PaymentSerializer(serializers.ModelSerializer):

    paymentMethod = serializers.CharField(
        source="payment_method"
    )

    failureReason = serializers.CharField(
        source="failure_reason"
    )

    riskLevel = serializers.CharField(
        source="risk_level"
    )

    transactionTime = serializers.CharField(
        source="transaction_time"
    )

    class Meta:

        model = Payment

        fields = [
            "id",
            "customer",
            "amount",
            "paymentMethod",
            "failureReason",
            "riskLevel",
            "status",
            "transactionTime",
        ]


class AuditEventSerializer(serializers.ModelSerializer):

    paymentId = serializers.CharField(
        source="payment.id",
        read_only=True
    )

    timestamp = serializers.DateTimeField(
        format="%b %d, %Y %I:%M %p",
        read_only=True
    )

    type = serializers.CharField(
        source="event_type",
        read_only=True
    )

    class Meta:

        model = AuditEvent

        fields = [
            "id",
            "paymentId",
            "event",
            "description",
            "timestamp",
            "type",
        ]

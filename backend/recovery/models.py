from django.db import models
from django.contrib.auth.models import User


class Merchant(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="merchant_profile",
    )

    business_name = models.CharField(max_length=200)

    phone_number = models.CharField(max_length=20, blank=True)

    gstin = models.CharField(max_length=20, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.business_name


class Payment(models.Model):
    STATUS_CHOICES = [
        ("at_risk", "At Risk"),
        ("recovered", "Recovered"),
        ("pending", "Pending"),
    ]

    RISK_CHOICES = [
        ("high", "High"),
        ("medium", "Medium"),
        ("low", "Low"),
    ]

    id = models.CharField(max_length=50, primary_key=True)

    customer = models.CharField(max_length=200)

    amount = models.DecimalField(max_digits=12, decimal_places=2)

    payment_method = models.CharField(max_length=100)

    failure_reason = models.CharField(max_length=300)

    risk_level = models.CharField(max_length=20, choices=RISK_CHOICES)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="at_risk",
    )

    transaction_time = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} - {self.customer}"


class RecoveryCase(models.Model):
    STATUS_CHOICES = [
        ("analyzing", "Analyzing"),
        ("waiting", "Waiting for Execution"),
        ("in_progress", "Recovery In Progress"),
        ("recovered", "Recovered"),
        ("human_review", "Human Review Required"),
    ]

    payment = models.OneToOneField(
        Payment,
        on_delete=models.CASCADE,
        related_name="recovery_case",
    )

    risk_score = models.IntegerField(default=0)

    diagnosis = models.TextField(blank=True)

    recommended_action = models.CharField(max_length=200, blank=True)

    confidence = models.CharField(max_length=20, blank=True)

    policy_allowed = models.BooleanField(default=False)

    policy_reason = models.TextField(blank=True)

    requires_human_approval = models.BooleanField(default=False)

    recovery_status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="waiting",
    )

    recovered_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Recovery - {self.payment.id}"


class AuditEvent(models.Model):
    EVENT_TYPES = [
        ("ai", "AI Analysis"),
        ("policy", "Policy"),
        ("action", "Action"),
        ("success", "Success"),
        ("review", "Human Review"),
    ]

    payment = models.ForeignKey(
        Payment,
        on_delete=models.CASCADE,
        related_name="audit_events",
    )

    event = models.CharField(max_length=200)

    description = models.TextField()

    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)

    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.payment.id} - {self.event}"

from django.urls import path

from .views import (
    payment_list,
    analyze_recovery,
    execute_recovery,
    complete_recovery,
    get_recovery_case,
    approve_recovery,
    register_merchant,
    audit_event_list,
    dashboard_stats,
    analyze_payment,
)

urlpatterns = [

    path(
        "auth/register/",
        register_merchant,
        name="register-merchant",
    ),

    path(
        "payments/",
        payment_list,
        name="payment-list",
    ),

    path(
        "audit-events/",
        audit_event_list,
        name="audit-event-list",
    ),

    path(
        "recovery/analyze/",
        analyze_recovery,
        name="analyze-recovery",
    ),

    path(
        "recovery/execute/",
        execute_recovery,
        name="execute-recovery",
    ),

    path(
        "payments/<str:payment_id>/execute-recovery/",
        execute_recovery,
        name="payment-execute-recovery",
    ),

    path(
        "payments/<str:payment_id>/complete-recovery/",
        complete_recovery,
        name="payment-complete-recovery",
    ),

    path(
        "payments/<str:payment_id>/recovery-case/",
        get_recovery_case,
        name="payment-recovery-case",
    ),

    path(
        "payments/<str:payment_id>/approve-recovery/",
        approve_recovery,
        name="payment-approve-recovery",
    ),

    path(
        "dashboard/",
        dashboard_stats,
        name="dashboard-stats",
    ),

    path(
        "payments/<str:payment_id>/analyze/",
        analyze_payment,
        name="analyze-payment",
    ),

]

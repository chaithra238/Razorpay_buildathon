from django.urls import path

from .views import (
    payment_list,
    analyze_recovery,
    execute_recovery_action,
    audit_event_list,
)

urlpatterns = [

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
        execute_recovery_action,
        name="execute-recovery",
    ),

]

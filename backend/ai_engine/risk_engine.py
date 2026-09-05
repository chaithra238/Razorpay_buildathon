def calculate_risk(payment):
	"""
	Calculate a risk score for a failed payment.

	Returns the risk score, risk level, and contributing reasons.
	"""

	score = 0
	reasons = []

	amount = float(payment.amount)
	failure_reason = payment.failure_reason.lower()

	if amount >= 10000:
		score += 40
		reasons.append("High transaction amount")
	elif amount >= 5000:
		score += 25
		reasons.append("Medium transaction amount")
	else:
		score += 10

	if "gateway" in failure_reason:
		score += 35
		reasons.append("Gateway failure detected")
	elif "bank timeout" in failure_reason:
		score += 25
		reasons.append("Bank timeout detected")
	elif "abandoned" in failure_reason:
		score += 20
		reasons.append("Payment abandoned")

	if score >= 60:
		risk_level = "high"
	elif score >= 35:
		risk_level = "medium"
	else:
		risk_level = "low"

	return {
		"risk_score": score,
		"risk_level": risk_level,
		"reasons": reasons,
	}

# RecoverAI

RecoverAI is a payment recovery management application built for the Razorpay Buildathon. It helps merchants monitor failed payments, identify revenue at risk, analyze payment failures, and manage recovery actions.

## Features

- Dashboard metrics for payments, risk, recovery, and human review.
- At-risk payment search, risk/status filters, and responsive payment table.
- Recovery analysis with AI recommendation and policy validation.
- Recovery execution with human-review handling.
- Analytics for revenue, recovery rate, and failure reasons.
- Audit trail for AI, policy, action, success, and review events.
- Merchant login and registration UI with protected frontend routes.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Axios
- React Router
- Lucide React
- CSS

### Backend

- Python
- Django
- Django REST Framework

### Database

- PostgreSQL
- Neon

### Deployment

- Frontend: Vercel
- Backend: Render

## Project Structure

```text
Razorpay_buildathon/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── css/
│       ├── data/
│       ├── pages/
│       ├── services/
│       └── types/
└── backend/
	├── config/
	├── recovery/
	│   ├── management/
	│   ├── migrations/
	│   ├── services/
	│   ├── models.py
	│   ├── serializers.py
	│   ├── urls.py
	│   └── views.py
	├── requirements.txt
	└── manage.py
```

## Backend Setup

From `backend`, create or activate the virtual environment and install dependencies:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` locally. Do not commit it:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

Apply migrations and seed the database:

```powershell
python manage.py migrate
python manage.py seed_data
```

Start the API:

```powershell
python manage.py runserver
```

The local payments endpoint is:

```text
http://127.0.0.1:8000/api/payments/
```

## Frontend Setup

From `frontend`:

```powershell
npm install
```

For local development, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

The production API URL is configured in `frontend/.env.production`.

Start the frontend:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
```

## API Routes

- `GET /api/payments/`
- `GET /api/dashboard/`
- `GET /api/audit-events/`
- `POST /api/recovery/analyze/`
- `POST /api/recovery/execute/`

The frontend uses a centralized Axios client in `frontend/src/services/api.ts`. Its base URL is read from `VITE_API_BASE_URL`.

## Data Models

### Payment

Stores payment ID, customer, amount, payment method, failure reason, risk level, status, and transaction time.

### RecoveryCase

Stores diagnosis, recommended action, confidence, policy status, human approval requirement, recovery status, and recovered amount.

### AuditEvent

Stores the payment reference, event description, event type, and timestamp.

The seed command currently creates 10 payment records and their recovery cases in the configured PostgreSQL database.

# Razorpay_buildathon

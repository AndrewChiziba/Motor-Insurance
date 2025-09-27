Stages (User Flow)

Stage 0: Search/Add Car

SearchPage.tsx (search by registration).

AddCar.tsx (add vehicle if not found).

✅ After selecting car → move to Quote.

Stage 1: Quote

Quote.tsx (choose insurance type + duration, see cost).

✅ After confirming → move to Policy.

Stage 2: Policy

Policy.tsx (display generated policy, user confirms).

✅ After confirming → move to Payment.

Stage 3: Payment

Payment.tsx (choose card/mobile money, simulate success).

✅ On success → toast + summary.

Admin Flow

Dashboard.tsx (view/manage policies, rates, users).

6. Step-by-Step Implementation Plan

Auth

Implement Signup & Login (pages/auth/).

Connect with backend (api/auth.ts).

Store token & role in localStorage.

Stage 0 (Search/Add Car)

Implement SearchPage.tsx + AddCar.tsx.

Connect with backend (api/vehicle.ts).

Ensure unique registration enforced.

Stage 1 (Quote)

UI for selecting insurance type (comprehensive/third-party).

Select duration (1–4 quarters).

Display calculated cost from backend.

Stage 2 (Policy)

Display policy details (vehicle + coverage + cost).

Confirm → move to payment.

Stage 3 (Payment)

Card form OR mobile money form.

Simulate payment → toast success/failure.

Admin Dashboard

Routes & components for admin functionality.
The backend is running on url: http://localhost:5126/api/

Auth

register details are below:
Register Schema:
{
  "email": "string",
  "password": "string",
  "fullName": "string"
}

Response body:
{
  "message": "Account Successfully Created"
}

Status:201

Fullname should be a single string without spaces, replace spaces with underscore

login details are below:
Register Schema:
{
  "email": "string",
  "password": "string"
}

Response body:
{
 {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQG1haW4iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZkODMwNjY4LWYxNGYtNDhkNy1iNDkwLTY1YWYzYzY4YmFmNSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImpvaG5AbWFpbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNsaWVudCIsImp0aSI6Ijc4NTRlOWVhLWM1MWQtNGJmYS05MmRlLTk0N2EzOTViZTdhOCIsImV4cCI6MTc1ODgyNTU0NywiaXNzIjoiTW90b3JJbnN1cmFuY2VBUEkiLCJhdWQiOiJNb3Rvckluc3VyYW5jZUNsaWVudHMifQ.0SEVaAxiBNr9ZULhQzpK8PyIp9AaLSmcxuK_oPd-fTE",
  "expires": "2025-09-25T18:39:07.9505415Z",
  "role": "Client",
  "email": "john@main"
}
}

Status:200
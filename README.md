# 🐾 VetCare Hub

VetCare Hub is a full-stack AI-powered animal health management platform designed for veterinary clinics and animal owners.
It enables seamless appointment scheduling, case management, AI-based disease prediction, and vaccination tracking — all through role-based dashboards.

---

🚀 Key Features

👤 For Animal Owners

- Register and manage animals (species, breed, health status)
- Book appointments with veterinarians
- View health records, vaccination history, and AI predictions
- Get notifications for appointments and vet advice
- Use AI Assistant for instant health-related queries

🩺 For Veterinarians

- Dashboard with real-time statistics (cases, appointments, emergencies)
- Manage consultation cases with filtering options
- Review AI-predicted diagnoses and provide treatment plans
- Handle appointment requests (approve/reject/complete)
- AI Assistant for clinical decision support
- Notifications for new cases and updates

🛠️ For Admins

- Manage users (owners & vets)
- Monitor animals, cases, and appointments
- Access analytics dashboard

🤖 AI Assistant

- 24/7 support for:
  - Disease identification
  - Treatment suggestions
  - Medication & dosage guidance
- Helps with second opinions and rare cases

---

🧠 Tech Stack

Layer| Technology
Frontend| React, Vite, Tailwind CSS
Backend| Django, Django REST Framework
Database| SQLite (can switch to PostgreSQL/MySQL)
AI/ML| Python-based ML models

---

📁 Project Structure

vetcarehub_shruthi/
├── backend/
├── frontend/
├── README.md

---

⚙️ Setup Instructions

🔹 Backend Setup

cd backend
python -m venv .venv

Activate virtual environment:

- Windows:

.venv\Scripts\activate

Install dependencies:



Run migrations:

python manage.py makemigrations
python manage.py migrate

Create admin user:

python manage.py createsuperuser

Run server:

python manage.py runserver

---

🔹 Frontend Setup

cd frontend
npm install
npm run dev

---

▶️ Usage

- Frontend: http://localhost:5173/
- Backend API: http://localhost:8000/

Login as:

- Owner
- Veterinarian
- Admin

---

🔧 Customization

- AI models → "backend/predictions/ai_services/"
- User roles → "backend/users/"
- UI pages → "frontend/src/pages/"

---

🌟 Future Enhancements

- Deploy on AWS / Docker
- Real-time chat with vets
- Mobile app version
- Advanced AI diagnosis models

---

📌 Note

Large ML model files are excluded from GitHub.
They can be hosted using cloud storage (AWS S3 / Google Drive).

---

📄 License

This project is developed for educational and demonstration purposes.

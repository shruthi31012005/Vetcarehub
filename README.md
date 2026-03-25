# 🐾 VetCare Hub

**VetCare Hub** is a **full-stack AI-powered animal health management platform** designed for veterinary clinics and animal owners.
It enables seamless appointment scheduling, case management, AI-based disease prediction, and vaccination tracking — all through **role-based dashboards**.

---

## 🚀 Key Features

### 👤 For Animal Owners

* Register and manage animals (species, breed, health status)
* Book appointments with veterinarians
* View health records, vaccination history, and AI predictions
* Receive notifications for appointments and vet advice
* Access AI Assistant for instant health-related queries

### 🩺 For Veterinarians

* Dashboard with real-time statistics (cases, appointments, emergencies)
* Manage consultation cases with filtering options
* Review AI-predicted diagnoses and provide treatment plans
* Handle appointment requests (approve/reject/complete)
* Access AI Assistant for clinical decision support
* Receive notifications for new cases and updates

### 🛠️ For Admins

* Manage users (owners & vets)
* Monitor animals, cases, and appointments
* Access analytics dashboard

### 🤖 AI Assistant

* 24/7 support for:

  * Disease identification
  * Treatment suggestions
  * Medication & dosage guidance
* Helps with second opinions and rare cases

---

## 🧠 Tech Stack

| Layer    | Technology                                     |
| -------- | ---------------------------------------------- |
| Frontend | React, Vite, Tailwind CSS                      |
| Backend  | Django, Django REST Framework                  |
| Database | SQLite *(can be switched to PostgreSQL/MySQL)* |
| AI/ML    | Python-based ML models                         |

---

## 📁 Project Structure

```bash
vetcarehub_shruthi/
├── backend/
├── frontend/
├── README.md
```

---

## ⚙️ Setup Instructions

### 🔹 Backend Setup

```bash
cd backend
python -m venv .venv
```

Activate virtual environment:

```bash
.venv\Scripts\activate   # Windows
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create admin user:

```bash
python manage.py createsuperuser
```

Run server:

```bash
python manage.py runserver
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## ▶️ Usage

* 🌐 Frontend: http://localhost:5173/
* 🔗 Backend API: http://localhost:8000/

Login as:

* Owner
* Veterinarian
* Admin

---

## 🔧 Customization

* AI models → `backend/predictions/ai_services/`
* User roles → `backend/users/`
* UI pages → `frontend/src/pages/`

---

## 🌟 Future Enhancements

* 🚀 Deploy on AWS / Docker
* 💬 Real-time chat with vets
* 📱 Mobile app version
* 🧠 Advanced AI diagnosis models

---

## 📌 Important Notes

### 🧠 Model File

Large ML model files are excluded from this repository due to GitHub size limits.
They must be downloaded manually before running the project.

---

## 🧠 Model Download

👉 Download the trained model from:
https://drive.google.com/drive/folders/1OVsGqPWzN6L84BRgzszCvACDRwZIKOtC?usp=sharing

📁 Place the downloaded file in:

```
backend/predictions/ai_services/models/
```

📌 File name must be:

```
disease_model.pkl
```

⚠️ The project will not run properly without this file.

---

## 🔐 API Key Setup

This project uses external AI services for the AI Assistant and prediction features.

### 🔑 Required API Keys

You need the following:

* **Google Gemini API Key**
* **OpenRouter API Key**

---

### 📂 Step 1: Create `.env` file

Create a `.env` file inside backend:

```bash
backend/.env
```

---

### ✏️ Step 2: Add API Keys

```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

---

### 🌐 Get API Keys

#### 🔹 Gemini API

https://aistudio.google.com/app/apikey

#### 🔹 OpenRouter API

https://openrouter.ai/keys

---

### ⚠️ Security Notes

* ❌ Never upload `.env` file to GitHub
* ✅ Add `.env` to `.gitignore`
* 🔐 Keep your API keys private
* ⚠️ Regenerate keys if exposed

---

### 💡 How It Works

* **Gemini API** → Handles core AI responses
* **OpenRouter API** → Provides flexible model access and advanced AI capabilities

---

### 🚨 Common Errors

* Missing API key → AI features won’t work
* Invalid key → Authentication errors
* `.env` not configured → backend may fail

---

## 📄 License

This project is developed for **educational and demonstration purposes**.

# Technology for Social Good – Faculty-Driven Project Management System

A high-performance, AI-integrated project management platform designed for academic institutions to track social-good initiatives and map them to UN Sustainable Development Goals (SDGs).

## 🚀 Key Features

*   **Role-Based Access Control (RBAC):** Distinct interfaces for Faculty and Students.
*   **SDG Classification:** Automated mapping of project problem statements to the 17 UN SDGs using a **BERT-based Transformer model**.
*   **Literature Intelligence Repository (LIR):** A **RAG (Retrieval-Augmented Generation)** system that allows users to query uploaded research papers (PDF/TXT) using the **Groq LLM**.
*   **Real-time Collaboration:** Integrated workspace with task tracking, file attachments, and a dedicated project chat system.
*   **Availability Validation:** Smart team assignment that prevents student double-booking.

## 🛠️ Tech Stack

### Frontend
*   **Core:** React 18, Vite
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **State Management:** Zustand

### Backend
*   **Framework:** FastAPI (Python)
*   **Database:** MongoDB with Beanie ODM & Motor (Async)
*   **AI/ML:** PyTorch, Transformers (Hugging Face), Groq API
*   **Tools:** Pydantic, Uvicorn, PyPDF

## 🏗️ System Architecture

The project follows a decoupled architecture:
1.  **React Frontend:** Provides a premium, interactive UI for project management.
2.  **FastAPI Backend:** Orchestrates API requests, manages authentication, and interfaces with AI models.
3.  **NoSQL Database:** MongoDB stores project metadata, user profiles, and chat history.
4.  **AI Layer:** Houses the BERT classification model and the RAG-based literature assistant.

## 🚦 Getting Started

### Prerequisites
*   Python 3.10+
*   Node.js & npm
*   MongoDB Instance
*   Groq API Key (for RAG features)

### Backend Setup
1.  Navigate to `backend/`
2.  Install dependencies: `pip install -r requirements.txt`
3.  Configure `.env` with `MONGODB_URL` and `GROQ_API_KEY`.
4.  Run server: `python main.py`

### Frontend Setup
1.  Navigate to `frontend/`
2.  Install dependencies: `npm install`
3.  Start dev server: `npm run dev`

## 📊 Performance & Metrics (Simulated)
*   **40% reduction** in administrative overhead via centralized tracking.
*   **60% faster** literature surveys through the RAG-based AI assistant.
*   **95%+ accuracy** in SDG classification using the SDG-BERT model.

---
Developed for the **SRM VDP Hackathon**.

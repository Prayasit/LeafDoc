# 🌿 LeafDoc

### AI-Powered Plant Identification and Disease Detection System

LeafDoc is an AI-powered web application designed to help users identify plants, detect plant diseases, and access useful plant care information. The application also provides plant trivia, growth tracking, and an interactive PlantBot chatbot for plant-related questions.

## ✨ Features

- 🌿 **Plant Identification** — Identify plant species using an uploaded image or captured photo.
- 🦠 **Disease Detection** — Analyze plant images and symptoms to identify potential diseases and receive suggested treatments.
- 🌱 **Plant Care Information** — Get useful care guidance including sunlight, watering, soil, and temperature requirements.
- 💡 **Plant Trivia** — Explore interesting facts and information about identified plants.
- 📈 **Growth Tracking** — Track plant growth progress through an interactive growth tracker.
- 🤖 **PlantBot** — Ask plant-related questions through an interactive AI-powered chatbot.
- 📷 **Camera Support** — Capture plant images directly through the device camera.
- 📱 **Responsive Interface** — Designed for a smooth experience across different screen sizes.

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**

### AI & Backend Services
- **Genkit**
- **Google Generative AI / Gemini**
- **Firebase**

### Libraries & Tools
- **Zod** — Schema validation
- **React Hook Form** — Form handling
- **Recharts** — Data visualization
- **Radix UI** — UI components
- **npm** — Package management

## 🏗️ Project Architecture

LeafDoc follows a modern Next.js application architecture with Genkit-based AI flows.

```text
User
 │
 ▼
LeafDoc Web Interface
 │
 ├── Plant Identification
 ├── Disease Detection
 ├── Plant Care
 ├── Plant Trivia
 ├── Growth Tracking
 └── PlantBot
 │
 ▼
Next.js / React
 │
 ▼
Genkit AI Flows
 │
 ▼
Google Generative AI / Gemini
 │
 ▼
AI-generated Plant Insights

## 📁 Project Structure

```text
LeafDoc/
├── Documentation/
│   ├── LeafDoc Final.pdf
│   ├── LeafDoc Journal Paper.pdf
│   ├── LeafDoc Thesis.pdf
│   ├── MP Synopsis.pdf
│   └── Research Paper.pdf
│
├── Leafdoc/
│   ├── docs/
│   │   └── blueprint.md
│   ├── src/
│   │   ├── ai/
│   │   │   ├── flows/
│   │   │   │   ├── detect-disease.ts
│   │   │   │   ├── identify-plant.ts
│   │   │   │   └── plant-chat-flow.ts
│   │   │   ├── ai-instance.ts
│   │   │   └── dev.ts
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── services/
│   ├── .env.example
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.ts
│   └── tsconfig.json
│
├── Screenshots/
│
├── Test samples/
│
├── .gitignore
└── README.md

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

- **Node.js** 18+
- **npm**
- A valid **Google Generative AI API key**

### 1. Clone the Repository

```bash
git clone https://github.com/Prayasit/LeafDoc.git
cd LeafDoc/Leafdoc
npm install
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
PLANT_ID_API_KEY=your_plant_id_api_key
npm run dev
http://localhost:9002
npm run typecheck
npm run build
npm start

## 📸 Screenshots

### Home Page

![LeafDoc Home Page](Screenshots/Home%20page.png)

### Plant Identification

![Plant Identification](Screenshots/Identification.png)

### Identification Result

![Plant Identification Result](Screenshots/Identification%20Output.png)

### Disease Detection

![Disease Detection](Screenshots/Disease%20Detection.png)

### Disease Detection Result

![Disease Detection Result](Screenshots/Disease%20Detection%20Output.png)

### Plant Care Information

![Plant Care Information](Screenshots/Care%20Information.png)

### Plant Trivia

![Plant Trivia](Screenshots/Plant%20Trivia.png)

### Growth Tracking

![Growth Tracking](Screenshots/Growth%20Tracking.png)

### PlantBot

![PlantBot](Screenshots/PlantBot.png)

## 📚 Documentation

The repository includes the major project documentation and supporting academic materials.

| Document | Description |
|---|---|
| [LeafDoc Final](Documentation/LeafDoc%20Final.pdf) | Final project documentation |
| [LeafDoc Thesis](Documentation/LeafDoc%20Thesis.pdf) | Detailed project thesis |
| [Journal Paper](Documentation/LeafDoc%20Journal%20Paper.pdf) | Research journal paper |
| [Research Paper](Documentation/Research%20Paper.pdf) | Research documentation |
| [MP Synopsis](Documentation/MP%20Synopsis.pdf) | Major project synopsis |
| [Project Presentation](Documentation/LeafDoc-A-Generative-AI-Based-Plant-Identification-and-Disease-Diagnosis-System.pptx) | Project presentation |

## 🧪 Testing

LeafDoc was tested using a collection of plant images and disease samples included in the `Test samples/` directory.

The project was also validated using the following checks:

- **TypeScript Type Checking**
  ```bash
  npm run typecheck
  npm run build

## 👨‍💻 Author

**Prayas Gotefode**

MCA Student | Data Analytics & Software Development

- GitHub: [@Prayasit](https://github.com/Prayasit)
- LinkedIn: [Prayas Gotefode](https://www.linkedin.com/)

## 📌 Project Status

**Status:** Completed Academic Major Project

LeafDoc was developed as a major project to explore the use of generative AI for plant identification, disease diagnosis, and plant care assistance.

## 📄 License

This project was developed as an academic major project.

The source code and documentation are provided for educational and portfolio purposes.

## ⭐ Project Summary

LeafDoc combines a modern web interface with generative AI capabilities to provide an accessible plant assistance platform. It brings plant identification, disease detection, care guidance, trivia, growth tracking, and conversational assistance together in a single application.

The project demonstrates the practical use of **Next.js, React, TypeScript, Genkit, and Google Generative AI** to build an AI-powered application.

---

⭐ **If you find this project interesting, consider giving the repository a star!**
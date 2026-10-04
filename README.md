# Ship Fast — All-in-One Content & Code Creator Engine 🚀

> Architect multi-channel social media campaigns, production-ready fullstack code sandboxes, and visual assets seamlessly powered by OpenAI & Gemini.

---

## 🌟 Overview

**ShipFast** is an all-in-one AI Studio application that turns natural language prompts into complete marketing campaigns, interactive web previews, fullstack codebase files, and visual graphics simultaneously.

### ✨ Key Features

- **⚡ Omni Generator**: Turn one prompt into formatted content for LinkedIn, X (Twitter), Instagram, TikTok, Facebook, plus full runnable code and visual assets.
- **💻 Interactive Code Sandbox**: Auto-detects frameworks/languages and generates high-fidelity interactive React/Tailwind preview sandboxes.
- **🎨 AI Image Studio**: Generate high-res visual assets using OpenAI DALL-E or Google Gemini with intelligent style and aspect-ratio detection.
- **🚀 One-Click GitHub Push**: Export generated repositories directly to your personal GitHub account.
- **📱 Social Publisher**: Draft and simulate multi-channel social media publishing.
- **📊 History & Analytics**: Scoped per device with MongoDB Atlas synchronization.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend**: Express.js, Node.js (Mounted via Vite middleware in dev / Vercel Serverless in prod)
- **AI Models**: OpenAI GPT-4o-mini & DALL-E, Google Gemini 3.8 Flash & Flash Lite
- **Database**: MongoDB Atlas (Mongoose)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/MokomiriEphraim/ShipFast.git
cd ShipFast
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Add your API credentials:

```env
OPENAI_API_KEY=sk-proj-your-openai-key-here
GEMINI_API_KEY=your-gemini-key-here (optional)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database (optional)
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub.
2. Import your repository into [Vercel](https://vercel.com).
3. Set the following **Environment Variables** in Vercel project settings:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `GEMINI_API_KEY`: (Optional) Your Gemini API key
   - `MONGODB_URI`: (Optional) MongoDB connection string
4. Click **Deploy**! Vercel handles static assets (`dist`) and serverless routing (`/api/*`) automatically via `vercel.json`.

---

## 📜 License

MIT License © 2026 MONO//GEN

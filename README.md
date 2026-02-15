# My Awesome Project

A collection of AI-powered applications built with modern web technologies.

## Projects

### Chore Manager
**`/client` + `/server`**

An office chore management app with a calendar interface similar to Outlook. Assign, schedule, and track recurring chores across team members with real-time sync.

- **Tech:** React, TypeScript, Vite, react-big-calendar, Express, Node.js
- **Features:** Calendar view (daily/weekly/monthly), recurring chore scheduling, team member management, real-time sync across clients

### Meal Planner
**`/meal-planner-ui`**

An AI-powered meal planning assistant that generates personalized meal plans and recipes.

- **Tech:** React, TypeScript, Vite, react-markdown
- **Features:** AI-generated meal plans, recipe display with markdown rendering
- **Live:** [meal-planner-ui.vercel.app](https://meal-planner-ui.vercel.app)

### Travel Agent
**`/travel-agent-ui`**

An AI travel planning assistant for USA trips, providing personalized itineraries and destination recommendations.

- **Tech:** React, TypeScript, Vite, Vercel
- **Features:** AI-powered travel planning, personalized USA trip itineraries, conversational interface
- **Live:** [my-awesome-project-psi-two.vercel.app](https://my-awesome-project-psi-two.vercel.app)

### Wizarding Worlds with Veo
**`/wizarding-worlds`**

A Harry Potter-themed AI experience that generates cinematic video worlds from text prompts using Google Veo 3.1. Describe any wizarding world and watch it come to life as a photorealistic cinematic video.

- **Tech:** Next.js, TypeScript, Tailwind CSS, Google Veo 3.1 API
- **Features:** Text-to-video generation via Veo 3.1, cinematic full-screen video player, preset wizarding world prompts (Hogwarts Great Hall, Forbidden Forest, Diagon Alley, and more), Harry Potter-themed UI with golden magical aesthetic
- **API:** Requires a Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/apikey))
- **Live:** [wizarding-worlds.vercel.app](https://wizarding-worlds.vercel.app)

## Getting Started

### Chore Manager
```bash
npm run install:all
npm run dev
```

### Meal Planner
```bash
cd meal-planner-ui
npm install && npm run dev
```

### Travel Agent
```bash
cd travel-agent-ui
npm install && npm run dev
```

### Wizarding Worlds
```bash
cd wizarding-worlds
npm install
cp .env.example .env.local  # Add your GEMINI_API_KEY
npm run dev
```

## Tech Stack

- **Frontend:** React, Next.js, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **AI:** Google Gemini API, Google Veo 3.1
- **Deploy:** Vercel

# AI-Powered-YouTube-Video-Intelligence-Tool

A full-stack AI-powered platform that analyzes YouTube videos for sentiment, virality, and audience insights using transcript analysis, comment mining, and LLM-generated summaries.


 
---
 
##  What It Does
 
- Fetches and analyzes YouTube video transcripts
- Mines and sentiment-scores viewer comments
- Generates a cognitive + virality timeline per video segment
- Highlights the **Top 3 viral moments** with timestamps
- Produces an **AI insight summary** (audience reaction, agreement, sentiment strength)
- Displays interactive sentiment and virality graphs
- Caches all results in MongoDB so repeat analyses are instant
- Firebase authentication (email/password signup & login)
- Per-user history and profile page
---
 
## Project Structure
 
```
videointel/
│
├── backend/                         # FastAPI backend
│   ├── src/
│   │   ├── main.py                  # App entry point, CORS setup
│   │   ├── routes/
│   │   │   └── video_routes.py      # /analyze, /history, /profile endpoints
│   │   ├── pipeline/
│   │   │   └── analyzer.py          # VideoAnalysisPipeline (main orchestrator)
│   │   ├── video_intelligence/
│   │   │   ├── preprocessing/
│   │   │   │   ├── transcript.py    # YouTube transcript fetcher
│   │   │   │   └── data_cleaning.py # Chunk + clean transcript DataFrame
│   │   │   ├── audience/
│   │   │   │   ├── comments_fetcher.py    # YouTube comments API
│   │   │   │   ├── comments_preprocess.py
│   │   │   │   ├── comments_sentiment.py  # Sentiment scoring for comments
│   │   │   │   ├── video_sentiment.py     # Sentiment scoring for transcript
│   │   │   │   └── llm_results.py         # LLM insight generator
│   │   │   ├── insights/
│   │   │   │   ├── cognitive_timeline.py  # Attention/cognitive load per segment
│   │   │   │   └── virality_generator.py  # Virality score per segment
│   │   │   └── validation/
│   │   │       └── input_validation.py
│   │   ├── auth/
│   │   │   └── firebase_auth.py     # Firebase token verification
│   │   └── database/
│   │       └── mongo.py             # MongoDB client + queries
│   └── requirements.txt
│
└── frontend/                        # React frontend
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.jsx        # Main dashboard (analysis + charts)
    │   │   ├── Login.jsx            # Firebase login page
    │   │   └── Signup.jsx           # Firebase signup page
    │   ├── firebase.js              # Firebase app init
    │   ├── App.js                   # Routes setup
    │   └── index.js
    └── package.json
```
 
---
 
##  Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, SVG charts (custom), Firebase Auth |
| Backend | FastAPI, Python 3.11, Uvicorn |
| Database | MongoDB (via PyMongo) |
| Auth | Firebase Authentication |
| NLP/ML | Custom sentiment + virality scoring pipeline |
| LLM | OpenAI / Anthropic (via `llm_results.py`) |
| APIs | YouTube Data API v3, YouTube Transcript API |
 
---
 
##  Prerequisites
 
Make sure you have these installed:
 
- **Python 3.10+** → https://www.python.org/downloads/
- **Node.js 18+** → https://nodejs.org/
- **MongoDB** → https://www.mongodb.com/try/download/community (local) or use MongoDB Atlas (cloud, free tier)
- A **Firebase project** → https://console.firebase.google.com/

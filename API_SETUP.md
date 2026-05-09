# AI Analysis Setup & Running Instructions

## Prerequisites
- Groq API key from https://console.groq.com/keys
- Node.js 16+

## Environment Setup

1. **Create/Update `.env` file:**
```env
# Server-side only, not exposed to frontend
GROQ_API_KEY=your_groq_api_key_here
```

## Running Locally (Development)

### Option 1: Automatic (Recommended)
Run both frontend and API server together:
```bash
npm install
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:5173`
- Start API server on `http://localhost:3001`
- Both will be available automatically

### Option 2: Manual (Separate Terminals)
Terminal 1 - Frontend:
```bash
npm run dev:frontend
```

Terminal 2 - API Server:
```bash
npm run dev:server
```

## Production Deployment (Vercel)

1. **Set environment variable in Vercel:**
   - Go to Vercel Project Settings → Environment Variables
   - Add: `GROQ_API_KEY=your_groq_api_key_here`

2. **Deploy:**
   - The `api/analyze.ts` function will be automatically recognized by Vercel
   - API calls will use `/api/analyze` endpoint
   - No additional configuration needed

## How It Works

### Local Development
- Frontend: `http://localhost:5173` (Vite)
- API Server: `http://localhost:3001` (Node.js/Express)
- API calls automatically route to `http://localhost:3001/api/analyze`

### Production (Vercel)
- Frontend: Your Vercel domain (static)
- API: `your-domain.vercel.app/api/analyze` (serverless function)
- API calls automatically route to `/api/analyze`

## Troubleshooting

**404 Error on API calls:**
- Make sure `npm run dev` is running (both servers)
- Check that `GROQ_API_KEY` is set in `.env`
- Verify API server is running on port 3001

**"API configuration error":**
- `GROQ_API_KEY` environment variable not set
- Check your `.env` file

**Port already in use:**
- For server: `PORT=3002 npm run dev:server`
- For frontend: Change Vite config if needed

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Local development API endpoint for AI analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { algoName, quantum, processes, metrics } = req.body;

    // Validate request
    if (!algoName || quantum === undefined || !processes || !metrics) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get API key from environment variable
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY not configured');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Build the analysis prompt
    const prompt = `You are a CPU scheduling systems expert. Analyze these simulation results.

ALGORITHM: ${algoName} | QUANTUM: ${quantum}ms
PROCESSES: ${processes.map((p) => `${p.id}(AT:${p.arrivalTime},BT:${p.burstTime},P:${p.priority})`).join(' ')}
RESULTS: AvgWT=${metrics.avgWaitingTime.toFixed(2)}ms AvgTAT=${metrics.avgTurnaroundTime.toFixed(2)}ms CPU=${metrics.cpuUtilization.toFixed(1)}% CtxSw=${metrics.contextSwitches}
PER-PROCESS: ${metrics.results.map((r) => `${r.id}(WT:${r.waitingTime},TAT:${r.turnaroundTime})`).join(' ')}

In 3-4 sentences: (1) Is this good/poor for this workload? (2) Which algorithm would be better and why? (3) One concrete optimization. Wrap algorithm names in <strong> tags.`;

    // Call Groq API
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!groqResponse.ok) {
      let errData;
      try {
        errData = await groqResponse.json();
      } catch {
        errData = { error: groqResponse.statusText };
      }
      console.error('Groq API error:', errData);
      const msg = errData?.error?.message || errData?.error || groqResponse.statusText;
      return res.status(groqResponse.status).json({
        error: `API Error ${groqResponse.status}: ${msg}`,
      });
    }

    const data = await groqResponse.json();
    const analysis = data.choices?.[0]?.message?.content ?? 'Analysis unavailable.';

    return res.status(200).json({ analysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/analyze`);
});

/**
 * Get the appropriate API endpoint based on environment
 * Local development: http://localhost:3001/api/analyze
 * Production (Vercel): /api/analyze
 */
export function getAnalyzeEndpoint(): string {
  // In production (Vercel), use relative path
  if (import.meta.env.PROD) {
    return '/api/analyze';
  }

  // In development, use local Node.js server
  const devServerUrl = typeof window !== 'undefined' 
    ? `http://localhost:3001` 
    : 'http://localhost:3001';
  
  return `${devServerUrl}/api/analyze`;
}

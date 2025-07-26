import React, { useState, useEffect } from 'react';
import './App.css';

interface ApiResponse {
  message: string;
  data?: any;
}

function App() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  useEffect(() => {
    // Test API connection
    const testApi = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/test`);
        const data = await response.json();
        setApiResponse(data);
        setApiStatus('Connected ✅');
      } catch (error) {
        console.error('API connection failed:', error);
        setApiStatus('Failed ❌');
      }
    };

    testApi();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎮 Flow Puzzle</h1>
        <p>Connect the colored letters to solve the puzzle!</p>
        
        <div className="status-panel">
          <h3>System Status</h3>
          <p><strong>API Status:</strong> {apiStatus}</p>
          {apiResponse && (
            <div className="api-response">
              <p><strong>API Response:</strong> {apiResponse.message}</p>
            </div>
          )}
        </div>

        <div className="game-placeholder">
          <h3>🚧 Game Coming Soon...</h3>
          <p>Docker container yapısı test ediliyor</p>
        </div>
      </header>
    </div>
  );
}

export default App;

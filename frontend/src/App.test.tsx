import React, { useState, useEffect } from 'react';
import './App.css';
import SimpleGame from './components/SimpleGame';

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
        const response = await fetch('/api/test');
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

  return React.createElement('div', { className: 'App' }, [
    React.createElement('header', { key: 'header', className: 'App-header' }, [
      React.createElement('h1', { key: 'title' }, '🎮 Flow Puzzle'),
      
      React.createElement('div', { key: 'status', className: 'status-panel' }, [
        React.createElement('h3', { key: 'status-title' }, 'System Status'),
        React.createElement('p', { key: 'api-status' }, [
          React.createElement('strong', { key: 'label' }, 'API Status: '),
          apiStatus
        ]),
        apiResponse && React.createElement('div', { key: 'api-response', className: 'api-response' }, [
          React.createElement('p', { key: 'response' }, [
            React.createElement('strong', { key: 'label2' }, 'API Response: '),
            apiResponse.message
          ])
        ])
      ]),

      React.createElement('div', { key: 'game', className: 'game-section' }, [
        React.createElement(SimpleGame, { key: 'simple-game' })
      ])
    ])
  ]);
}

export default App;

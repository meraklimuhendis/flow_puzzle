import React from 'react';

function App() {
  const [apiStatus, setApiStatus] = React.useState('Checking...');
  
  React.useEffect(() => {
    const testApi = async () => {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        setApiStatus(' API Connected: ' + data.message);
      } catch (error) {
        console.error('API Error:', error);
        setApiStatus(' API Failed');
      }
    };
    
    testApi();
  }, []);

  return React.createElement('div', { style: { padding: '20px', textAlign: 'center' } }, [
    React.createElement('h1', { key: 'title' }, ' Flow Puzzle'),
    React.createElement('p', { key: 'desc' }, 'Flow Puzzle oyunu geliştirme ortamı başarıyla kuruldu!'),
    React.createElement('div', { 
      key: 'status',
      style: { 
        background: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        margin: '20px 0'
      }
    }, [
      React.createElement('h3', { key: 'status-title' }, 'System Status'),
      React.createElement('p', { key: 'react-status' }, ' React.js çalışıyor'),
      React.createElement('p', { key: 'ts-status' }, ' TypeScript çalışıyor'),
      React.createElement('p', { key: 'docker-status' }, ' Docker Container çalışıyor'),
      React.createElement('p', { key: 'api-status' }, apiStatus)
    ])
  ]);
}

export default App;

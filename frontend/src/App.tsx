import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState<string>('Loading');

  useEffect(() => {
    fetch('http://localhost:5000/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('Error connecting to backend'));
  }, []);

  return (
    <div>
      <h1>Hotel App</h1>
      <p>Backend Status: {status}</p>
    </div>
  );
}

export default App;
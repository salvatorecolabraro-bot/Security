import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001`;
      const response = await axios.post(`${apiUrl}/api/login`, { username, password });
      
      const { token, role, username: resUser } = response.data;
      
      // Salva nel localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', resUser);
      
      // Chiama il callback per aggiornare lo stato di App
      onLoginSuccess(token, role, resUser);
    } catch (err) {
      console.error(err);
      setError('Credenziali non valide o errore di connessione.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f6f8' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#337ab7', margin: '0 0 10px 0' }}>FiberCop Security</h1>
          <p style={{ color: '#666', margin: 0, fontSize: '14px' }}>Accedi per continuare</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#f8d7da', color: '#a94442', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '10px',
              padding: '12px', 
              backgroundColor: '#5cb85c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            {loading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>
        
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#888', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
          Utenti Demo:<br/>
          <strong>admin</strong> / <strong>admin123</strong> (Gestione Completa)<br/>
          <strong>viewer</strong> / <strong>viewer123</strong> (Sola Lettura)
        </div>
      </div>
    </div>
  );
}

export default Login;

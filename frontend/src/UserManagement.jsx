import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/api/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError("Errore nel caricamento della lista utenti.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/api/users`, { username, password, role }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`Utente "${username}" creato con successo!`);
      setUsername('');
      setPassword('');
      setRole('viewer');
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante la creazione dell'utente.");
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Sei sicuro di voler eliminare l'utente "${name}"? L'azione è irreversibile.`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(`Utente "${name}" eliminato.`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Errore durante l'eliminazione dell'utente.");
    }
  };

  return (
    <div style={{ flex: 1, padding: '20px', backgroundColor: '#f4f6f8', overflowY: 'auto' }}>
      <h2 style={{ color: '#333', marginTop: 0, marginBottom: '20px' }}>Gestione Utenti</h2>

      {error && <div style={{ backgroundColor: '#f8d7da', color: '#a94442', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
      {success && <div style={{ backgroundColor: '#dff0d8', color: '#3c763d', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>{success}</div>}

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        
        {/* Tabella Utenti */}
        <div style={{ flex: 2, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px', color: '#337ab7', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Lista Utenti</h3>
          
          {loading ? (
            <p style={{ fontSize: '13px', color: '#777' }}>Caricamento in corso...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#333' }}>ID</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#333' }}>Username</th>
                  <th style={{ padding: '10px', textAlign: 'left', color: '#333' }}>Ruolo</th>
                  <th style={{ padding: '10px', textAlign: 'right', color: '#333' }}>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px', color: '#777' }}>{user.id}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#333' }}>{user.username}</td>
                    <td style={{ padding: '10px' }}>
                      <span style={{ 
                        backgroundColor: user.role === 'admin' ? '#5cb85c' : '#5bc0de', 
                        color: 'white', 
                        padding: '3px 8px', 
                        borderRadius: '10px', 
                        fontSize: '11px',
                        textTransform: 'uppercase'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        style={{ backgroundColor: '#d9534f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px' }}
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>Nessun utente trovato.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Form Aggiungi Utente */}
        <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px', color: '#337ab7', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Aggiungi Nuovo Utente</h3>
          
          <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: 'bold', color: '#555' }}>Ruolo</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '13px' }}
              >
                <option value="viewer">Viewer (Sola Lettura)</option>
                <option value="admin">Admin (Gestione Completa)</option>
              </select>
            </div>

            <button 
              type="submit"
              style={{ backgroundColor: '#5cb85c', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginTop: '5px' }}
            >
              Crea Utente
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
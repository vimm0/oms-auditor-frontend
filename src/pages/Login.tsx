import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Monitor } from 'lucide-react';
import { setCachedUser } from '../lib/userCache';

const API_BASE = (import.meta as unknown as { env: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? 'http://127.0.0.1:8000';

export default function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: parseInt(userId, 10),
                    password,
                    computer_name: 'MacBook-Client',
                }),
            });

            if (response.ok) {
                const data = await response.json() as { user_name?: string; right?: string };
                setCachedUser({
                    user_name: data.user_name ?? 'User',
                    right: data.right ?? '',
                    user_id: parseInt(userId, 10),
                });
                navigate('/dashboard');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            setError('Connection refused');
        }
    };

    return (
        <div className="page-container" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '400px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', background: 'linear-gradient(to right, #1976d2, #1565c0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    OMS Auditor
                </h1>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#666' }} />
                        <input
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            type="number"
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#666' }} />
                        <input
                            className="input-field"
                            style={{ paddingLeft: '40px' }}
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary">
                        Access System
                    </button>

                    {error && <p style={{ color: '#ef4444', marginTop: '0.5rem' }}>{error}</p>}
                </form>

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', color: '#666', fontSize: '0.875rem' }}>
                    <Monitor size={16} />
                    <span>System v2.0 (Modern)</span>
                </div>
            </div>
        </div>
    );
}

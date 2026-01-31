import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Monitor } from 'lucide-react';

export default function Login() {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: parseInt(userId),
                    password: password,
                    computer_name: 'MacBook-Client' // Mock or get from Tauri/Browser
                }),
            });

            if (response.ok) {
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
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    OMS Auditor
                </h1>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
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
                        <Lock size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
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

                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                    <Monitor size={16} />
                    <span>System v2.0 (Modern)</span>
                </div>
            </div>
        </div>
    );
}

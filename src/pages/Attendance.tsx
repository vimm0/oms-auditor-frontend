import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

export default function Attendance() {
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');

    const handleCheckIn = async () => {
        // Current date logic (simplistic wrapper for demo)
        const today = new Date();
        const nepDate = "2080.10." + today.getDate(); // Mock Nepali date

        try {
            const res = await fetch('http://127.0.0.1:8000/api/attendance/checkin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: 1, // Mock user ID (should come from Auth context)
                    nep_date: nepDate,
                    nep_month: "10"
                })
            });
            const data = await res.json();
            setMessage(data.message);
            loadHistory();
        } catch (err) {
            console.error(err);
            setMessage("Failed to check in");
        }
    };

    const loadHistory = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/attendance/history/1');
            const data = await res.json();
            setHistory(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <div className="page-container" style={{ flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <h2>Attendance</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleCheckIn} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={18} /> Check In Today
                    </button>
                </div>
            </header>

            {message && (
                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', borderRadius: '8px', marginBottom: '1rem' }}>
                    {message}
                </div>
            )}

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3>History</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '0.5rem' }}>Date (Nep)</th>
                            <th style={{ padding: '0.5rem' }}>Time</th>
                            <th style={{ padding: '0.5rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((record: any) => (
                            <tr key={record.ID} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem' }}>{record.Nepdate}</td>
                                <td style={{ padding: '0.5rem' }}>{new Date(record.atttime).toLocaleTimeString()}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#22c55e', fontSize: '0.8rem' }}>Present</span>
                                </td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr><td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No records found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

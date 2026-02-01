import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function ImportData() {
    const [file, setFile] = useState<File | null>(null);
    const [dataType, setDataType] = useState('staff');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('idle');
        setMessage('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', dataType);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/import', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.detail || 'Import failed');
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage('Network error or server unavailable');
        }
    };

    return (
        <div className="page-container" style={{ flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <h2>Import Data</h2>
            </header>

            <div className="glass-panel" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Data Type</label>
                        <select
                            className="input-field"
                            value={dataType}
                            onChange={(e) => setDataType(e.target.value)}
                            style={{ background: 'rgba(15, 23, 42, 0.5)', color: 'white' }}
                        >
                            <option value="staff">Staff Details</option>
                            <option value="parti">Parti (Clients)</option>
                            {/* Add more options as backend supports them */}
                        </select>
                    </div>

                    <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '2rem', textAlign: 'center', transition: 'border-color 0.2s', cursor: 'pointer', position: 'relative' }}>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                        <Upload size={32} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
                        <p style={{ margin: 0, fontWeight: 500 }}>
                            {file ? file.name : 'Click to upload CSV'}
                        </p>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Drag and drop or browse'}
                        </p>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={handleUpload}
                        disabled={!file}
                        style={{ opacity: !file ? 0.5 : 1, cursor: !file ? 'not-allowed' : 'pointer' }}
                    >
                        Upload and Import
                    </button>

                    {status === 'success' && (
                        <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle size={20} />
                            {message}
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={20} />
                            {message}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

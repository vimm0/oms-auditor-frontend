import { useEffect, useState } from 'react';
import { BarChart3, PieChart, Users, FileText } from 'lucide-react';

interface Stats {
    ten_crore_plus: number;
    five_to_ten_crore: number;
    total_transaction: number;
    non_audited: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        // Fetch stats
        fetch('http://127.0.0.1:8000/api/dashboard/stats?fiscal_year=2080')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error("Failed to fetch stats", err));
    }, []);

    return (
        <div className="page-container" style={{ flexDirection: 'column' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard Overview</h2>
                <div className="glass-panel" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                    Fiscal Year: 2080/81
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                <StatCard
                    title="Total Transactions"
                    value={stats ? `NPR ${(stats.total_transaction / 10000000).toFixed(2)} Cr` : 'Loading...'}
                    icon={<BarChart3 color="#3b82f6" />}
                />
                <StatCard
                    title="High Value Files (>10Cr)"
                    value={stats?.ten_crore_plus.toString() || '-'}
                    icon={<FileText color="#a855f7" />}
                />
                <StatCard
                    title="Pending Audits"
                    value={stats?.non_audited.toString() || '-'}
                    icon={<Users color="#f59e0b" />}
                />
            </div>

            <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem', flex: 1 }}>
                <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <PieChart size={20} /> Transaction Distribution
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Detailed visualization would go here using chart.js or recharts.
                </p>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{title}</span>
                <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                    {icon}
                </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {value}
            </div>
        </div>
    );
}

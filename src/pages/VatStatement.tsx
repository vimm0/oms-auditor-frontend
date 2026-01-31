import { useState } from 'react';
import { Calculator, Save } from 'lucide-react';

export default function VatStatement() {
    const [inputs, setInputs] = useState({
        taxable_sales: 0,
        taxable_purchase: 0,
        taxable_import: 0
    });

    const [calcs, setCalcs] = useState<any>(null);
    const [msg, setMsg] = useState('');

    const handleCalculate = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/vat/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            });
            const data = await res.json();
            setCalcs(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        // Logic to save
        try {
            const res = await fetch('http://127.0.0.1:8000/api/vat/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fiscal_year: "2080/81",
                    month: "10",
                    pan_no: "123456789", // Mock
                    payable_amount: 5000, // Mock or computed
                    user_name: "Admin",
                    parti_name: "Test Client"
                })
            });
            const data = await res.json();
            setMsg(data.message);
        } catch (err) {
            setMsg("Submission failed");
        }
    };

    return (
        <div className="page-container" style={{ flexDirection: 'column' }}>
            <header className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
                <h2>VAT Statement</h2>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label>Taxable Sales</label>
                        <input className="input-field" type="number"
                            value={inputs.taxable_sales}
                            onChange={e => setInputs({ ...inputs, taxable_sales: parseFloat(e.target.value) })}
                        />

                        <label>Taxable Purchase</label>
                        <input className="input-field" type="number"
                            value={inputs.taxable_purchase}
                            onChange={e => setInputs({ ...inputs, taxable_purchase: parseFloat(e.target.value) })}
                        />

                        <label>Taxable Import</label>
                        <input className="input-field" type="number"
                            value={inputs.taxable_import}
                            onChange={e => setInputs({ ...inputs, taxable_import: parseFloat(e.target.value) })}
                        />

                        <button className="btn-primary" onClick={handleCalculate} style={{ marginTop: '1rem' }}>
                            <Calculator size={18} style={{ marginRight: '8px' }} /> Calculate
                        </button>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3>Results</h3>
                    {calcs && (
                        <div style={{ marginTop: '1rem' }}>
                            <p>Expected Sales VAT: {calcs.sales_vat_13}</p>
                            <p>Expected Purchase VAT: {calcs.purchase_vat_13}</p>
                            <hr style={{ borderColor: 'var(--glass-border)', margin: '1rem 0' }} />
                            <button className="btn-primary" onClick={handleSubmit} style={{ background: '#22c55e' }}>
                                <Save size={18} style={{ marginRight: '8px' }} /> Submit Return
                            </button>
                        </div>
                    )}
                    {msg && <p style={{ marginTop: '1rem', color: '#fbbf24' }}>{msg}</p>}
                </div>
            </div>
        </div>
    );
}

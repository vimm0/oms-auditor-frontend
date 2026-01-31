import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Alert,
} from '@mui/material';

export default function Attendance() {
  const [history, setHistory] = useState<{ ID: number; Nepdate?: string; atttime?: string }[]>([]);
  const [message, setMessage] = useState('');

  const handleCheckIn = async () => {
    const today = new Date();
    const nepDate = '2080.10.' + today.getDate();

    try {
      const res = await fetch('http://127.0.0.1:8000/api/attendance/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 1,
          nep_date: nepDate,
          nep_month: '10',
        }),
      });
      const data = await res.json();
      setMessage(data.message);
      loadHistory();
    } catch (err) {
      console.error(err);
      setMessage('Failed to check in');
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
      <Box component="header" sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: 1, bgcolor: 'background.paper' }}>
        <Typography variant="h6">Attendance</Typography>
        <Button variant="contained" startIcon={<CheckCircle size={18} />} onClick={handleCheckIn}>
          Check In Today
        </Button>
      </Box>

      {message && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>History</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Date (Nep)</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Time</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.ID} hover>
                  <TableCell>{record.Nepdate ?? '—'}</TableCell>
                  <TableCell>{record.atttime ? new Date(record.atttime).toLocaleTimeString() : '—'}</TableCell>
                  <TableCell>
                    <Typography component="span" sx={{ px: 1, py: 0.5, borderRadius: 1, bgcolor: 'success.main', color: 'success.contrastText', fontSize: '0.8rem' }}>
                      Present
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {history.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

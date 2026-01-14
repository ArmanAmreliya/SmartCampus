import React, { useState } from 'react';
import { LeaveRequest } from '../types';
import { X, Calendar, FileText, Send, CheckCircle2 } from 'lucide-react';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: LeaveRequest) => void;
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [type, setType] = useState<'Medical' | 'Personal' | 'Academic' | 'Other'>('Medical');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'Pending',
      timestamp: Date.now()
    };
    onSubmit(newRequest);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-bgPrimary w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-5 border-b border-border flex justify-between items-center bg-bgSecondary">
          <h2 className="text-lg font-bold text-textPrimary">Apply for Leave</h2>
          <button onClick={onClose} className="p-1 hover:bg-card rounded-full text-textSecondary"><X className="w-5 h-5"/></button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-accent mb-4" />
            <h3 className="text-xl font-bold text-textPrimary">Application Submitted</h3>
            <p className="text-textSecondary mt-2">Your faculty mentor will review it shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase mb-2">Leave Type</label>
              <div className="grid grid-cols-4 gap-2">
                {['Medical', 'Personal', 'Academic', 'Other'].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t as any)}
                    className={`text-sm py-2 rounded-lg border transition-all ${
                      type === t ? 'bg-accent text-bgPrimary border-accent font-bold' : 'bg-transparent text-textSecondary border-border hover:border-textSecondary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase mb-2">Start Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-2 text-textPrimary focus:border-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-textSecondary uppercase mb-2">End Date</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-2 text-textPrimary focus:border-accent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-textSecondary uppercase mb-2">Reason</label>
              <textarea
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Briefly explain why you need leave..."
                className="w-full h-32 bg-card border border-border rounded-lg px-4 py-2 text-textPrimary focus:border-accent outline-none resize-none"
              />
            </div>

            <div className="pt-2">
              <button type="submit" className="w-full py-3 bg-accent text-bgPrimary rounded-xl font-bold hover:bg-accentHover transition-colors flex justify-center items-center">
                <Send className="w-4 h-4 mr-2" /> Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

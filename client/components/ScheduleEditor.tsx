import React, { useState } from 'react';
import { DaySchedule, TimeSlot } from '../types';
import { Plus, X, Calendar, Copy } from 'lucide-react';

interface ScheduleEditorProps {
  initialSchedule: DaySchedule[];
  onSave: (schedule: DaySchedule[]) => void;
}

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({ initialSchedule, onSave }) => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule || []);
  const [isSaved, setIsSaved] = useState(false);

  const toggleDay = (dayIndex: number) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].isEnabled = !newSchedule[dayIndex].isEnabled;
    setSchedule(newSchedule);
    setIsSaved(false);
  };

  const addSlot = (dayIndex: number) => {
    const newSchedule = [...schedule];
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: '09:00',
      end: '17:00'
    };
    newSchedule[dayIndex].slots.push(newSlot);
    setSchedule(newSchedule);
    setIsSaved(false);
  };

  const removeSlot = (dayIndex: number, slotId: string) => {
    const newSchedule = [...schedule];
    newSchedule[dayIndex].slots = newSchedule[dayIndex].slots.filter(s => s.id !== slotId);
    setSchedule(newSchedule);
    setIsSaved(false);
  };

  const updateSlot = (dayIndex: number, slotId: string, field: 'start' | 'end', value: string) => {
    const newSchedule = [...schedule];
    const slot = newSchedule[dayIndex].slots.find(s => s.id === slotId);
    if (slot) {
      slot[field] = value;
      setSchedule(newSchedule);
      setIsSaved(false);
    }
  };

  const handleSave = () => {
    onSave(schedule);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 h-full">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-textPrimary">Weekly Hours</h2>
          <p className="text-sm text-textSecondary mt-1">Set your recurring availability for the semester.</p>
        </div>
        <button
          onClick={handleSave}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isSaved ? 'bg-accentHover text-bgPrimary' : 'bg-accent text-bgPrimary hover:bg-accentHover'
          }`}
        >
          {isSaved ? 'Saved Changes' : 'Save Schedule'}
        </button>
      </div>

      <div className="space-y-4">
        {schedule.map((daySchedule, index) => (
          <div key={daySchedule.day} className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 py-2 border-b border-border/50 last:border-0">
            
            {/* Day Toggle */}
            <div className="flex items-center w-24 pt-2">
              <button
                onClick={() => toggleDay(index)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors mr-3 ${
                  daySchedule.isEnabled 
                    ? 'bg-accent border-accent' 
                    : 'bg-transparent border-textSecondary hover:border-textPrimary'
                }`}
              >
                {daySchedule.isEnabled && <CheckIcon className="w-3.5 h-3.5 text-bgPrimary" />}
              </button>
              <span className={`font-semibold ${daySchedule.isEnabled ? 'text-textPrimary' : 'text-textSecondary'}`}>
                {daySchedule.day}
              </span>
            </div>

            {/* Slots Area */}
            <div className="flex-1 mt-2 sm:mt-0">
              {!daySchedule.isEnabled ? (
                <div className="py-2 text-textSecondary text-sm italic">Unavailable</div>
              ) : (
                <div className="space-y-3">
                  {daySchedule.slots.map((slot) => (
                    <div key={slot.id} className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2 bg-bgPrimary p-1 rounded-lg border border-border">
                        <input
                          type="time"
                          value={slot.start}
                          onChange={(e) => updateSlot(index, slot.id, 'start', e.target.value)}
                          className="bg-transparent text-textPrimary text-sm focus:outline-none p-1"
                        />
                        <span className="text-textSecondary">-</span>
                        <input
                          type="time"
                          value={slot.end}
                          onChange={(e) => updateSlot(index, slot.id, 'end', e.target.value)}
                          className="bg-transparent text-textPrimary text-sm focus:outline-none p-1"
                        />
                      </div>
                      <button 
                        onClick={() => removeSlot(index, slot.id)}
                        className="text-textSecondary hover:text-error transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addSlot(index)}
                    className="flex items-center text-xs font-medium text-accent hover:text-accentHover mt-1"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Time
                  </button>
                </div>
              )}
            </div>

            {/* Actions (Copy/Placeholder for future features) */}
            {daySchedule.isEnabled && (
              <div className="hidden sm:flex items-center pt-2">
                 <button className="text-textSecondary hover:text-textPrimary" title="Copy to other days">
                   <Copy className="w-4 h-4" />
                 </button>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

// Simple internal check icon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

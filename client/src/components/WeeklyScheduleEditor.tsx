import React, { useState, useEffect } from 'react';
import { DaySchedule, WeeklySchedule, TimeSlot } from '@/types';
import { useMutation } from '@apollo/client/react';
import { UPDATE_WEEKLY_SCHEDULE } from '@/graphql/mutations';
import { Clock, Plus, Trash2, Check, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Props {
    schedule?: WeeklySchedule;
    onRefresh: () => void;
}

export const WeeklyScheduleEditor: React.FC<Props> = ({ schedule, onRefresh }) => {
    const [days, setDays] = useState<DaySchedule[]>([]);
    const [updateSchedule, { loading }] = useMutation(UPDATE_WEEKLY_SCHEDULE);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fullWeek = DAYS.map(dayName => {
            const existingDay = schedule?.days?.find(d => d.day === dayName);
            // Ensure deep clone of slots to avoid reference mutation issues if any
            if (existingDay) {
                return {
                    day: dayName,
                    isDayOff: existingDay.isDayOff,
                    slots: existingDay.slots?.map(s => ({ ...s })) || []
                };
            }
            return { day: dayName, slots: [], isDayOff: false };
        });
        setDays(fullWeek);
    }, [schedule]);

    const handleAddSlot = (dayIndex: number) => {
        const newDays = [...days];
        if (!newDays[dayIndex]) {
            newDays[dayIndex] = { day: DAYS[dayIndex], slots: [], isDayOff: false };
        }
        newDays[dayIndex].slots.push({ startTime: '09:00', endTime: '10:00', label: 'Lecture' });
        setDays(newDays);
    };

    const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
        const newDays = [...days];
        newDays[dayIndex].slots.splice(slotIndex, 1);
        setDays(newDays);
    };

    const handleUpdateSlot = (dayIndex: number, slotIndex: number, field: keyof TimeSlot, value: string) => {
        const newDays = [...days];
        newDays[dayIndex].slots[slotIndex] = {
            ...newDays[dayIndex].slots[slotIndex],
            [field]: value
        };
        setDays(newDays);
    };

    const handleToggleDayOff = (dayIndex: number) => {
        const newDays = [...days];
        if (!newDays[dayIndex]) {
            newDays[dayIndex] = { day: DAYS[dayIndex], slots: [], isDayOff: false };
        }
        newDays[dayIndex].isDayOff = !newDays[dayIndex].isDayOff;
        setDays(newDays);
    };

    const handleSave = async () => {
        try {
            const payload = days.map(d => ({
                day: d.day,
                isDayOff: d.isDayOff || false,
                slots: d.slots.map(s => ({
                    startTime: s.startTime,
                    endTime: s.endTime,
                    label: s.label || ''
                }))
            }));

            await updateSchedule({ variables: { days: payload } });
            onRefresh();
            setIsSaved(true);
            setTimeout(() => setIsSaved(false), 2000);
        } catch (err: any) {
            alert("Failed to save schedule: " + err.message);
        }
    };



    return (
        <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-textPrimary flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-accent" />
                    Weekly Schedule
                </h3>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`flex items-center px-4 py-2 rounded-lg font-bold text-sm transition-all ${isSaved ? 'bg-emerald-500 text-white' : 'bg-accent text-bgPrimary hover:bg-accentHover'}`}
                >
                    {loading ? 'Saving...' : isSaved ? <><Check className="w-4 h-4 mr-1.5" /> Saved</> : <><Save className="w-4 h-4 mr-1.5" /> Save Changes</>}
                </button>
            </div>

            <div className="space-y-4">
                {days.map((d, index) => {
                    return (
                        <motion.div
                            key={d.day}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl border ${d.isDayOff ? 'border-dashed border-border bg-bgSecondary/30' : 'border-border bg-bgSecondary'}`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <span className={`font-bold w-24 ${d.isDayOff ? 'text-textSecondary line-through' : 'text-textPrimary'}`}>{d.day}</span>
                                    <label className="flex items-center space-x-2 text-xs text-textSecondary cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            checked={d.isDayOff || false}
                                            onChange={() => handleToggleDayOff(index)}
                                            className="rounded border-border bg-bgPrimary text-accent focus:ring-accent"
                                        />
                                        <span>Day Off</span>
                                    </label>
                                </div>
                                {!d.isDayOff && (
                                    <button onClick={() => handleAddSlot(index)} className="p-1.5 rounded-lg hover:bg-white/5 text-accent hover:text-accentHover transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {!d.isDayOff && (
                                <div className="space-y-2 pl-4 border-l-2 border-border/50">
                                    {d.slots.length === 0 && <p className="text-xs text-textSecondary italic">No slots defined</p>}
                                    {d.slots.map((slot, sIndex) => (
                                        <div key={sIndex} className="flex flex-wrap items-center gap-2">
                                            <input
                                                type="time"
                                                value={slot.startTime}
                                                onChange={(e) => handleUpdateSlot(index, sIndex, 'startTime', e.target.value)}
                                                className="bg-bgPrimary border border-border text-textPrimary text-xs rounded px-2 py-1 focus:border-accent outline-none"
                                            />
                                            <span className="text-textSecondary text-xs">-</span>
                                            <input
                                                type="time"
                                                value={slot.endTime}
                                                onChange={(e) => handleUpdateSlot(index, sIndex, 'endTime', e.target.value)}
                                                className="bg-bgPrimary border border-border text-textPrimary text-xs rounded px-2 py-1 focus:border-accent outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={slot.label || ''}
                                                onChange={(e) => handleUpdateSlot(index, sIndex, 'label', e.target.value)}
                                                placeholder="Label (e.g. Lecture)"
                                                className="bg-bgPrimary border border-border text-textPrimary text-xs rounded px-2 py-1 w-32 focus:border-accent outline-none"
                                            />
                                            <button onClick={() => handleRemoveSlot(index, sIndex)} className="text-textSecondary hover:text-error transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

import React, { useMemo } from 'react';
import { Faculty, FacultyStatus } from '../types';
import { ArrowLeft, Mail, GraduationCap, BookOpen, Clock, Building2, Calendar, CheckCircle2, MinusCircle, XCircle, Briefcase, FileText, User, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion, Variants } from 'framer-motion';

interface FacultyProfilePageProps {
  faculty: Faculty;
  onBack: () => void;
  onRequestAppointment?: (id: string) => void;
  isSelfView?: boolean;
}

// Fix: Explicitly type variants as Variants to satisfy motion component props and Easing literals
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export const FacultyProfilePage: React.FC<FacultyProfilePageProps> = ({ faculty, onBack, onRequestAppointment, isSelfView = false }) => {
  
  const getStatusColor = (status: FacultyStatus) => {
    switch (status) {
      case FacultyStatus.AVAILABLE: return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case FacultyStatus.BUSY: return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case FacultyStatus.NOT_AVAILABLE: return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-textSecondary';
    }
  };

  const getStatusIcon = (status: FacultyStatus) => {
    switch (status) {
      case FacultyStatus.AVAILABLE: return <CheckCircle2 className="w-5 h-5 mr-2" />;
      case FacultyStatus.BUSY: return <MinusCircle className="w-5 h-5 mr-2" />;
      case FacultyStatus.NOT_AVAILABLE: return <XCircle className="w-5 h-5 mr-2" />;
      default: return null;
    }
  };

  const chartData = useMemo(() => {
    if (!faculty.schedule) return [];
    const daysOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    return faculty.schedule
      .filter(d => d.isEnabled)
      .map(d => {
        let totalHours = 0;
        d.slots.forEach(slot => {
           const start = parseInt(slot.start.split(':')[0]) + parseInt(slot.start.split(':')[1])/60;
           const end = parseInt(slot.end.split(':')[0]) + parseInt(slot.end.split(':')[1])/60;
           totalHours += (end - start);
        });
        return { day: d.day, hours: totalHours };
      })
      .sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));
  }, [faculty.schedule]);

  const timeRange = { start: 9, end: 18 };
  const totalHours = timeRange.end - timeRange.start;
  
  const getSlotStyle = (start: string, end: string) => {
      const startH = parseInt(start.split(':')[0]) + parseInt(start.split(':')[1])/60;
      const endH = parseInt(end.split(':')[0]) + parseInt(end.split(':')[1])/60;
      const left = ((startH - timeRange.start) / totalHours) * 100;
      const width = ((endH - startH) / totalHours) * 100;
      return { left: `${left}%`, width: `${width}%` };
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <button 
        onClick={onBack}
        className="flex items-center text-textSecondary hover:text-textPrimary transition-colors group mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        {isSelfView ? 'Back to Dashboard' : 'Back to Faculty List'}
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xl relative"
      >
        <div className="h-48 bg-gradient-to-r from-bgSecondary via-card to-bgSecondary relative overflow-hidden">
          <div className="absolute inset-0 bg-accent/5"></div>
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start -mt-20">
            <div className="flex-shrink-0 relative">
              <div className="w-40 h-40 rounded-2xl border-4 border-card bg-bgSecondary overflow-hidden shadow-lg">
                <img src={faculty.image} alt={faculty.name} className="w-full h-full object-cover" />
              </div>
              <div className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-bold border flex items-center shadow-lg backdrop-blur-md ${getStatusColor(faculty.status)}`}>
                {getStatusIcon(faculty.status)}
                {faculty.status}
              </div>
            </div>
            <div className="flex-1 pt-4 md:pt-20">
              <h1 className="text-3xl font-bold text-textPrimary mb-1">{faculty.name}</h1>
              <p className="text-xl text-accent mb-4">{faculty.position}</p>
              <div className="flex flex-wrap gap-4 text-sm text-textSecondary">
                <div className="flex items-center bg-bgSecondary px-3 py-1.5 rounded-lg border border-border"><Building2 className="w-4 h-4 mr-2 text-accent" />{faculty.department}</div>
                <div className="flex items-center bg-bgSecondary px-3 py-1.5 rounded-lg border border-border"><Mail className="w-4 h-4 mr-2 text-accent" />{faculty.email}</div>
              </div>
            </div>
            <div className="pt-4 md:pt-20 w-full md:w-auto">
               {!isSelfView && onRequestAppointment && (
                 <button onClick={() => onRequestAppointment(faculty.id)} className="w-full md:w-auto px-6 py-3 bg-accent text-bgPrimary rounded-xl font-bold hover:bg-accentHover transition-all shadow-lg flex items-center justify-center"><Calendar className="w-4 h-4 mr-2" />Book Appointment</button>
               )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="bg-card rounded-xl border border-border p-6 shadow-sm overflow-hidden">
             <h3 className="text-lg font-bold text-textPrimary mb-6 flex items-center"><Calendar className="w-5 h-5 mr-2 text-accent" /> Weekly Schedule</h3>
             <div className="overflow-x-auto pb-2">
                <div className="min-w-[500px]">
                   <div className="flex text-xs text-textSecondary mb-2 pl-12 border-b border-border pb-2">
                      {Array.from({length: totalHours + 1}).map((_, i) => (<div key={i} className="flex-1 text-center" style={{ width: `${100/totalHours}%` }}>{timeRange.start + i}:00</div>))}
                   </div>
                   <div className="space-y-3">
                      {faculty.schedule?.filter(d => ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].includes(d.day)).map((day) => (
                         <div key={day.day} className="flex items-center h-10 group hover:bg-bgSecondary/30 rounded-lg transition-colors">
                            <div className="w-12 text-xs font-bold text-textSecondary flex-shrink-0">{day.day}</div>
                            <div className="flex-1 relative h-8 bg-bgSecondary/50 rounded-lg overflow-hidden border border-border/50">
                               <div className="absolute inset-0 flex">{Array.from({length: totalHours}).map((_, i) => (<div key={i} className="flex-1 border-r border-border/30 last:border-0"></div>))}</div>
                               {day.isEnabled && day.slots.map((slot) => (<motion.div key={slot.id} initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="absolute top-1 bottom-1 bg-accent/80 rounded-md border border-accent flex items-center justify-center hover:bg-accent cursor-pointer group/slot" style={getSlotStyle(slot.start, slot.end)}><span className="text-[10px] text-bgPrimary font-bold opacity-0 group-hover/slot:opacity-100 transition-opacity whitespace-nowrap px-1">{slot.start} - {slot.end}</span></motion.div>))}
                               {!day.isEnabled && (<div className="absolute inset-0 flex items-center justify-center bg-bgPrimary/50"><span className="text-[10px] text-textSecondary uppercase tracking-widest">Unavailable</span></div>)}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>

          <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center"><User className="w-5 h-5 mr-2 text-accent" /> About</h3>
            <p className="text-textSecondary leading-relaxed whitespace-pre-line">{faculty.bio || "No biography available for this faculty member."}</p>
          </motion.div>

          {(faculty.education || (faculty.experience && faculty.experience.length > 0)) && (
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center"><Briefcase className="w-5 h-5 mr-2 text-accent" /> Experience & Education</h3>
              <div className="space-y-6">
                {faculty.experience && faculty.experience.length > 0 && (
                  <div><h4 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-3">Experience</h4><div className="space-y-4">{faculty.experience.map((exp, idx) => (<div key={idx} className="relative pl-4 border-l-2 border-border"><div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent"></div><h5 className="font-bold text-textPrimary">{exp.role}</h5><p className="text-sm text-textPrimary">{exp.institution}</p><p className="text-xs text-textSecondary mt-1">{exp.years}</p></div>))}</div></div>
                )}
                {faculty.education && (
                  <div><h4 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-3">Education</h4><div className="bg-bgSecondary rounded-lg p-4 border border-border"><p className="text-textPrimary whitespace-pre-line leading-relaxed text-sm">{faculty.education}</p></div></div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
           <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center"><Clock className="w-5 h-5 mr-2 text-accent" /> Current Availability</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-2 border-b border-border"><span className="text-textSecondary text-sm">Status</span><span className={`font-semibold ${faculty.status === FacultyStatus.AVAILABLE ? 'text-emerald-500' : faculty.status === FacultyStatus.BUSY ? 'text-amber-500' : 'text-red-500'}`}>{faculty.status}</span></div>
                 <div className="flex justify-between items-center py-2 border-b border-border"><span className="text-textSecondary text-sm">Next Slot</span><span className="text-textPrimary font-medium">{faculty.nextAvailableSlot || 'Unknown'}</span></div>
                 <div className="flex justify-between items-center py-2"><span className="text-textSecondary text-sm">Office Location</span><span className="text-textPrimary font-medium">Block B, 2nd Floor</span></div>
              </div>
           </motion.div>

           <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-bold text-textPrimary mb-4 flex items-center"><BarChart3 className="w-5 h-5 mr-2 text-accent" /> Hours Per Day</h3>
              <div className="h-48 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} /><XAxis dataKey="day" stroke="#A0A0A0" fontSize={10} tickLine={false} axisLine={false} /><YAxis stroke="#A0A0A0" fontSize={10} tickLine={false} axisLine={false} /><Tooltip cursor={{fill: '#2A2A2A'}} contentStyle={{ backgroundColor: '#333', borderColor: '#444', borderRadius: '8px', color: '#E0E0E0' }} itemStyle={{ color: '#2ECC71' }} /><Bar dataKey="hours" fill="#2ECC71" radius={[4, 4, 0, 0]}>{chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.hours > 0 ? '#2ECC71' : '#2A2A2A'} />))}</Bar></BarChart></ResponsiveContainer></div>
           </motion.div>
        </div>
      </div>
    </div>
  );
};
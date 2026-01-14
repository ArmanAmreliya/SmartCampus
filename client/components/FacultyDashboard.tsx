import React, { useState, useEffect, useCallback } from 'react';
import { Faculty, FacultyStatus, DaySchedule, Appointment, ChatMessage, BroadcastMessage } from '../types';
import { Edit2, Megaphone, Check, Calendar, Settings, CheckCircle2, XCircle, Clock, User, Bot, Send, BrainCircuit, ListFilter, Trash2, RefreshCcw } from 'lucide-react';
import { ScheduleEditor } from './ScheduleEditor';
import { storageService } from '../services/storageService';
import { generateChatResponse } from '../services/geminiService';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface FacultyDashboardProps {
  currentFaculty: Faculty;
  onUpdateStatus: (id: string, status: FacultyStatus, nextSlot: string) => void;
  onPostBroadcast: (message: string) => void;
}

// Fix: Explicitly type variants as Variants to ensure compatibility with motion components
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Fix: Explicitly type variants as Variants and cast easing array to a tuple to satisfy Easing type
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ 
  currentFaculty, 
  onUpdateStatus, 
  onPostBroadcast 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'assistant' | 'schedule'>('overview');
  const [status, setStatus] = useState<FacultyStatus>(currentFaculty.status);
  const [nextSlot, setNextSlot] = useState(currentFaculty.nextAvailableSlot || '');
  const [broadcastText, setBroadcastText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [myBroadcasts, setMyBroadcasts] = useState<BroadcastMessage[]>([]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: `Hello ${currentFaculty.name}! I am your AI Teaching Assistant. I can help you draft emails to students, generate quiz questions, or summarize leave requests.`, timestamp: Date.now() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const refreshData = useCallback(() => {
    const allAppointments = storageService.getAppointments();
    const myAppointments = allAppointments.filter(a => a.facultyId === currentFaculty.id);
    setAppointments(myAppointments);
    const allBroadcasts = storageService.getBroadcasts();
    setMyBroadcasts(allBroadcasts.filter(b => b.facultyId === currentFaculty.id));
  }, [currentFaculty.id]);

  useEffect(() => {
    refreshData();
    const handleStorageChange = () => refreshData();
    const handleLocalUpdate = () => refreshData();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-update', handleLocalUpdate);
    const interval = setInterval(refreshData, 2000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-update', handleLocalUpdate);
      clearInterval(interval);
    };
  }, [refreshData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleStatusSave = () => {
    onUpdateStatus(currentFaculty.id, status, nextSlot);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handlePost = () => {
    if (!broadcastText.trim()) return;
    onPostBroadcast(broadcastText);
    setBroadcastText('');
    refreshData();
    alert('Broadcast posted successfully!');
  };

  const handleDeleteBroadcast = (id: string) => {
    if(window.confirm("Remove this announcement?")) {
      storageService.deleteBroadcast(id);
      refreshData();
    }
  };

  const handleAppointmentAction = (aptId: string, newStatus: 'Confirmed' | 'Cancelled' | 'Deleted') => {
    if (newStatus === 'Deleted') {
      if (window.confirm("Permanently delete this appointment record?")) {
        storageService.deleteAppointment(aptId);
      }
    } else {
      const allAppointments = storageService.getAppointments();
      const updatedAll = allAppointments.map(a => 
        a.id === aptId ? { ...a, status: newStatus } : a
      );
      storageService.saveAppointments(updatedAll);
    }
  };

  const handleAssistantSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);
    try {
        const prompt = `You are an AI Teaching Assistant for ${currentFaculty.name}, a professor at L.D. College of Engineering. Task: ${userMsg.text}`;
        const responseText = await generateChatResponse(prompt, [], []); 
        const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: responseText,
            timestamp: Date.now()
        };
        setChatMessages(prev => [...prev, botMsg]);
    } catch (error) {
        console.error(error);
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleScheduleSave = (newSchedule: DaySchedule[]) => {
    const allFaculty = storageService.getFacultyList();
    const updatedList = allFaculty.map(f => 
       f.id === currentFaculty.id ? { ...f, schedule: newSchedule } : f
    );
    storageService.saveFacultyList(updatedList);
    currentFaculty.schedule = newSchedule; 
    alert('Schedule updated successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 bg-card w-full md:w-fit p-1 rounded-xl border border-border">
          {['overview', 'appointments', 'assistant', 'schedule'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center capitalize ${
                activeTab === tab ? 'bg-bgPrimary text-accent shadow-sm' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {tab === 'overview' && <Settings className="w-4 h-4 mr-2" />}
              {tab === 'appointments' && <Calendar className="w-4 h-4 mr-2" />}
              {tab === 'assistant' && <BrainCircuit className="w-4 h-4 mr-2" />}
              {tab === 'schedule' && <Clock className="w-4 h-4 mr-2" />}
              {tab}
            </button>
          ))}
        </div>
        <button 
           onClick={handleManualRefresh}
           className="px-4 py-2 bg-card border border-border rounded-xl hover:bg-bgSecondary text-textSecondary hover:text-accent transition-all shadow-sm flex items-center justify-center gap-2 group self-end md:self-auto"
         >
            <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-accent' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="text-xs font-semibold">Sync Data</span>
         </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div 
            key="overview"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-6 h-fit shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-textPrimary flex items-center">
                  <Edit2 className="w-5 h-5 mr-2 text-accent" />
                  Update Availability
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-3">Current Status</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[FacultyStatus.AVAILABLE, FacultyStatus.BUSY, FacultyStatus.NOT_AVAILABLE].map(s => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          status === s
                            ? `bg-${s === FacultyStatus.AVAILABLE ? 'emerald' : s === FacultyStatus.BUSY ? 'amber' : 'red'}-500/10 border-${s === FacultyStatus.AVAILABLE ? 'emerald' : s === FacultyStatus.BUSY ? 'amber' : 'red'}-500 text-${s === FacultyStatus.AVAILABLE ? 'emerald' : s === FacultyStatus.BUSY ? 'amber' : 'red'}-500 ring-1 ring-${s === FacultyStatus.AVAILABLE ? 'emerald' : s === FacultyStatus.BUSY ? 'amber' : 'red'}-500`
                            : 'bg-bgSecondary border-border text-textSecondary hover:border-textPrimary'
                        }`}
                      >
                        <div className="flex items-center">
                          {s === FacultyStatus.AVAILABLE && <CheckCircle2 className="w-5 h-5 mr-3" />}
                          {s === FacultyStatus.BUSY && <Calendar className="w-5 h-5 mr-3" />}
                          {s === FacultyStatus.NOT_AVAILABLE && <XCircle className="w-5 h-5 mr-3" />}
                          <span className="font-semibold">{s}</span>
                        </div>
                        {status === s && <div className={`w-2 h-2 rounded-full bg-${s === FacultyStatus.AVAILABLE ? 'emerald' : s === FacultyStatus.BUSY ? 'amber' : 'red'}-500`}></div>}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary mb-2">Next Available (Student View)</label>
                  <input type="text" value={nextSlot} onChange={(e) => setNextSlot(e.target.value)} placeholder="e.g., 2:00 PM or Tomorrow" className="w-full px-4 py-3 rounded-lg bg-bgPrimary border border-border text-textPrimary focus:ring-1 focus:ring-accent focus:border-accent outline-none" />
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={handleStatusSave} className={`flex items-center px-6 py-2.5 rounded-lg text-bgPrimary font-bold transition-all shadow-lg ${isSaved ? 'bg-emerald-500' : 'bg-accent hover:bg-accentHover shadow-accent/20'}`}>
                    {isSaved ? <><Check className="w-4 h-4 mr-2" /> Live Updated!</> : 'Publish Status'}
                  </button>
                </div>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-6 h-fit shadow-lg flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-textPrimary flex items-center mb-4">
                  <Megaphone className="w-5 h-5 mr-2 text-warning" /> Student Broadcast
                </h2>
                <textarea value={broadcastText} onChange={(e) => setBroadcastText(e.target.value)} placeholder="e.g. BE Sem 6 Class for today is rescheduled to 2 PM in Lab 4." className="w-full h-32 p-4 bg-bgPrimary border border-border text-textPrimary rounded-lg focus:ring-1 focus:ring-warning focus:border-warning outline-none resize-none placeholder-textSecondary" />
                <div className="mt-4 flex justify-end">
                  <button onClick={handlePost} disabled={!broadcastText.trim()} className="bg-warning text-bgPrimary px-6 py-2.5 rounded-lg font-bold hover:bg-yellow-600 disabled:opacity-50 transition-colors shadow-lg shadow-warning/10">Post to Students</button>
                </div>
              </div>
              {myBroadcasts.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-bold text-textPrimary mb-3">Your Active Announcements</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {myBroadcasts.map(b => (
                      <div key={b.id} className="bg-bgSecondary p-3 rounded-lg text-sm flex justify-between items-start group">
                        <div><p className="text-textPrimary">{b.message}</p><p className="text-xs text-textSecondary mt-1">{b.timestamp}</p></div>
                        <button onClick={() => handleDeleteBroadcast(b.id)} className="text-textSecondary hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'appointments' && (
          <motion.div 
            key="appointments"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-textPrimary">Student Appointments</h2>
            </div>
            {appointments.length === 0 ? (
               <motion.div variants={itemVariants} className="bg-card border border-border rounded-xl p-12 text-center">
                  <Calendar className="w-16 h-16 text-textSecondary mx-auto mb-4 opacity-20" />
                  <h3 className="text-lg font-semibold text-textPrimary">No appointments requests</h3>
               </motion.div>
            ) : (
               <div className="grid grid-cols-1 gap-4">
                  {appointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map((apt) => (
                     <motion.div key={apt.id} variants={itemVariants} className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-textSecondary">
                        <div className="flex items-start space-x-4">
                           <div className="bg-bgSecondary p-3 rounded-xl text-center min-w-[60px] border border-border">
                              <span className="block text-xs text-textSecondary font-bold uppercase">{new Date(apt.date).toLocaleDateString(undefined, {month: 'short'})}</span>
                              <span className="block text-xl font-bold text-textPrimary">{new Date(apt.date).getDate()}</span>
                           </div>
                           <div>
                              <div className="flex items-center space-x-2 mb-1">
                                 <h3 className="font-bold text-lg text-textPrimary">{apt.purpose}</h3>
                                 <span className={`text-[10px] px-2 py-0.5 rounded-full border ${apt.status === 'Pending' ? 'bg-warning/10 text-warning border-warning' : apt.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500' : 'bg-red-500/10 text-red-500 border-red-500'}`}>{apt.status}</span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-textSecondary"><span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {apt.time}</span><span className="flex items-center"><User className="w-3 h-3 mr-1" /> Student ID: {apt.id.slice(0,5)}...</span></div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3">
                           {apt.status === 'Pending' && (
                             <><button onClick={() => handleAppointmentAction(apt.id, 'Cancelled')} className="px-4 py-2 border border-border text-textSecondary rounded-lg hover:border-red-500 transition-colors text-sm font-medium">Reject</button><button onClick={() => handleAppointmentAction(apt.id, 'Confirmed')} className="px-4 py-2 bg-accent text-bgPrimary rounded-lg hover:bg-accentHover transition-colors text-sm font-bold shadow-lg shadow-accent/20">Confirm Slot</button></>
                           )}
                           {apt.status === 'Confirmed' && (
                             <button onClick={() => handleAppointmentAction(apt.id, 'Cancelled')} className="px-4 py-2 bg-bgSecondary text-textSecondary border border-border rounded-lg text-sm hover:text-error transition-colors">Cancel Appointment</button>
                           )}
                           {(apt.status === 'Cancelled' || apt.status === 'Completed') && (
                              <button onClick={() => handleAppointmentAction(apt.id, 'Deleted')} className="p-2 text-textSecondary hover:text-error transition-colors"><Trash2 className="w-5 h-5" /></button>
                           )}
                        </div>
                     </motion.div>
                  ))}
               </div>
            )}
          </motion.div>
        )}

        {activeTab === 'assistant' && (
          <motion.div 
            key="assistant"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]"
          >
            <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col shadow-xl">
               <div className="bg-bgSecondary p-4 border-b border-border flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center"><BrainCircuit className="w-5 h-5 text-accent" /></div>
                  <div><h3 className="font-bold text-textPrimary">Faculty AI Companion</h3><p className="text-xs text-textSecondary">Powered by Gemini 3 Flash</p></div>
               </div>
               <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                     <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'model' && (<div className="w-8 h-8 rounded-full bg-bgSecondary flex items-center justify-center mr-2 border border-border flex-shrink-0"><Bot className="w-4 h-4 text-textSecondary" /></div>)}
                        <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-accent text-bgPrimary rounded-br-none shadow-lg shadow-accent/10' : 'bg-bgSecondary border border-border text-textPrimary rounded-bl-none'}`}>{msg.text.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}</div>
                     </div>
                  ))}
                  {isChatLoading && <div className="flex justify-start"><div className="bg-bgSecondary px-4 py-2 rounded-2xl rounded-bl-none text-textSecondary text-xs border border-border animate-pulse">Generating response...</div></div>}
               </div>
               <div className="p-4 bg-bgSecondary/50 border-t border-border"><div className="flex space-x-2"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAssistantSend()} placeholder="Draft an email for leave approval..." className="flex-1 bg-bgPrimary border border-border rounded-xl px-4 py-3 text-sm text-textPrimary focus:ring-1 focus:ring-accent outline-none" /><button onClick={handleAssistantSend} disabled={!chatInput.trim() || isChatLoading} className="p-3 bg-accent text-bgPrimary rounded-xl hover:bg-accentHover disabled:opacity-50 transition-colors shadow-lg"><Send className="w-5 h-5" /></button></div></div>
            </div>
            <div className="space-y-4">
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border p-5 shadow-lg">
                  <h3 className="font-bold text-textPrimary mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                     <button onClick={() => setChatInput("Draft an email to BE Semester 4 studentsregarding mid-semester exam syllabus.")} className="w-full text-left p-3 rounded-lg bg-bgSecondary hover:bg-bgPrimary border border-border text-xs text-textPrimary transition-colors">📝 Draft Exam Email</button>
                     <button onClick={() => setChatInput("Generate 5 multiple choice questions on Data Structures (Linked Lists).")} className="w-full text-left p-3 rounded-lg bg-bgSecondary hover:bg-bgPrimary border border-border text-xs text-textPrimary transition-colors">❓ Generate Quiz Questions</button>
                  </div>
               </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === 'schedule' && (
          <motion.div 
            key="schedule"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2">
              <ScheduleEditor initialSchedule={currentFaculty.schedule || []} onSave={handleScheduleSave} />
            </div>
            <div className="space-y-6">
               <div className="bg-card rounded-xl border border-border p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-textPrimary mb-4">Date-specific hours</h3>
                  <button className="w-full py-2 border border-accent text-accent rounded-lg hover:bg-accent hover:text-bgPrimary transition-colors flex items-center justify-center"><Calendar className="w-4 h-4 mr-2" /> Add Specific Hours</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
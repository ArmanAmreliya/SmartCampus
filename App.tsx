import React, { useState, useEffect } from 'react';
import { UserRole, Faculty, FacultyStatus, BroadcastMessage, AppView, StudentNotification } from './types';
import { INITIAL_FACULTY, INITIAL_BROADCASTS } from './constants';
import { StudentDashboard } from './components/StudentDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { LogOut } from 'lucide-react';
import { storageService } from './services/storageService';
import { FacultyProfilePage } from './components/FacultyProfilePage';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ThreeDShapes } from './components/ThreeDShapes';
import { ParticleField } from './components/ParticleField';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LANDING);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.STUDENT);
  
  const [facultyList, setFacultyList] = useState<Faculty[]>(storageService.getFacultyList());
  const [broadcasts, setBroadcasts] = useState<BroadcastMessage[]>(storageService.getBroadcasts());
  const [loggedInFacultyId, setLoggedInFacultyId] = useState<string>('');
  const [showFacultyProfile, setShowFacultyProfile] = useState(false);

  useEffect(() => {
    if (storageService.getFacultyList().length === 0) {
      storageService.saveFacultyList(INITIAL_FACULTY);
      setFacultyList(INITIAL_FACULTY);
    }
  }, []);

  const handleLogin = (role: UserRole, facultyId?: string) => {
    setUserRole(role);
    if (role === UserRole.FACULTY && facultyId) {
      setLoggedInFacultyId(facultyId);
    }
    setShowFacultyProfile(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const handleLogout = () => {
    setCurrentView(AppView.LANDING);
    setUserRole(UserRole.STUDENT);
    setLoggedInFacultyId('');
    setShowFacultyProfile(false);
  };

  const handleUpdateStatus = (id: string, status: FacultyStatus, nextSlot: string) => {
    const updatedList = facultyList.map(f => {
      if (f.id === id) {
        return { ...f, status, nextAvailableSlot: nextSlot };
      }
      return f;
    });
    setFacultyList(updatedList);
    storageService.saveFacultyList(updatedList);

    if (status === FacultyStatus.AVAILABLE) {
      const requests = storageService.getNotificationRequests();
      const pendingForThisFaculty = requests.filter(r => r.facultyId === id);

      if (pendingForThisFaculty.length > 0) {
        const faculty = facultyList.find(f => f.id === id);
        pendingForThisFaculty.forEach(req => {
          const newNotification: StudentNotification = {
            id: Date.now().toString() + Math.random(),
            title: 'Faculty Available',
            message: `${faculty?.name} is now marked as AVAILABLE. You can visit them now.`,
            type: 'AVAILABILITY',
            timestamp: Date.now(),
            isRead: false,
            facultyImage: faculty?.image
          };
          storageService.addStudentNotification(newNotification);
        });
        storageService.removeNotificationRequests(id);
      }
    }
  };

  const handlePostBroadcast = (message: string) => {
    const currentFaculty = facultyList.find(f => f.id === loggedInFacultyId);
    if (!currentFaculty) return;

    const newBroadcast: BroadcastMessage = {
      id: Date.now().toString(),
      facultyId: currentFaculty.id,
      facultyName: currentFaculty.name,
      message: message,
      timestamp: 'Just now',
      department: currentFaculty.department
    };
    
    const updatedBroadcasts = [newBroadcast, ...broadcasts];
    setBroadcasts(updatedBroadcasts);
    storageService.saveBroadcasts(updatedBroadcasts);
  };

  const currentFaculty = facultyList.find(f => f.id === loggedInFacultyId) || facultyList[0];

  const pageVariants: Variants = {
    initial: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Global 3D Background */}
      <ThreeDShapes />
      <ParticleField />
      
      <AnimatePresence mode="wait">
        {currentView === AppView.LANDING && (
          <motion.div key="landing" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="relative z-10">
            <LandingPage onNavigate={setCurrentView} />
          </motion.div>
        )}

        {currentView === AppView.LOGIN && (
          <motion.div key="login" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="relative z-10">
            <LoginPage onLogin={handleLogin} onBack={() => setCurrentView(AppView.LANDING)} />
          </motion.div>
        )}

        {currentView === AppView.DASHBOARD && (
          <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="enter" exit="exit" className="min-h-screen relative z-10">
            {userRole === UserRole.STUDENT ? (
              <StudentDashboard 
                facultyList={facultyList} 
                broadcasts={broadcasts} 
                onLogout={handleLogout}
              />
            ) : (
              <div className="min-h-screen">
                <div className="bg-bgSecondary/80 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-50">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xl tracking-tight">SmartCampus</span>
                    <span className="text-[10px] bg-accent/20 text-accent px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border border-accent/30">Faculty Portal</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {currentFaculty && (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setShowFacultyProfile(true)}
                        className="flex items-center space-x-3 hover:bg-white/5 px-3 py-1.5 rounded-xl transition-colors group"
                      >
                        <div className="text-right hidden md:block">
                           <span className="block text-sm font-bold text-textPrimary group-hover:text-accent transition-colors">
                              {currentFaculty.name}
                           </span>
                           <span className="block text-[10px] text-textSecondary uppercase tracking-widest">My Profile</span>
                        </div>
                        <img 
                          src={currentFaculty.image} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-xl border border-white/10 group-hover:border-accent transition-colors"
                        />
                      </motion.button>
                    )}

                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-textSecondary hover:text-error transition-all bg-white/5 border border-white/10 hover:border-error px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                </div>
                <main className="p-4 md:p-8">
                  <AnimatePresence mode="wait">
                    {showFacultyProfile ? (
                      <motion.div key="f-profile" variants={pageVariants} initial="initial" animate="enter" exit="exit">
                        <FacultyProfilePage 
                          faculty={currentFaculty} 
                          onBack={() => setShowFacultyProfile(false)} 
                          isSelfView={true}
                        />
                      </motion.div>
                    ) : (
                      <motion.div key="f-dash" variants={pageVariants} initial="initial" animate="enter" exit="exit">
                        <FacultyDashboard 
                          currentFaculty={currentFaculty}
                          onUpdateStatus={handleUpdateStatus}
                          onPostBroadcast={handlePostBroadcast}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </main>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

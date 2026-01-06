import React, { useState } from 'react';
import { UserRole } from '../types';
import { GraduationCap, UserCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { INITIAL_FACULTY } from '../constants';

interface LoginPageProps {
  onLogin: (role: UserRole, facultyId?: string) => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [viewState, setViewState] = useState<'selection' | 'faculty_list'>('selection');

  const amitaben = INITIAL_FACULTY.find(f => f.name.includes('Amitaben'));
  const maitrik = INITIAL_FACULTY.find(f => f.name.includes('Maitrik'));

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgPrimary p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        
        <div className="p-8 text-center border-b border-border bg-bgSecondary">
          <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-accent/20">
            <GraduationCap className="text-bgPrimary w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-textPrimary">SmartCampus LDCE</h2>
          <p className="text-textSecondary mt-2">Sign in to your account</p>
        </div>
        
        <div className="p-8 space-y-4">
          {viewState === 'selection' && (
            <>
              <button
                onClick={() => onLogin(UserRole.STUDENT)}
                className="w-full group relative flex items-center justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-bgPrimary bg-accent hover:bg-accentHover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all transform hover:scale-[1.02]"
              >
                <span className="absolute left-4 flex items-center pl-3">
                  <GraduationCap className="h-5 w-5 text-bgPrimary group-hover:text-white" />
                </span>
                Student Portal
              </button>
              
              <button
                onClick={() => setViewState('faculty_list')}
                className="w-full group relative flex items-center justify-center py-4 px-4 border border-border text-sm font-medium rounded-xl text-textPrimary bg-bgSecondary hover:bg-bgPrimary hover:border-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all transform hover:scale-[1.02]"
              >
                <span className="absolute left-4 flex items-center pl-3">
                  <UserCircle className="h-5 w-5 text-textSecondary group-hover:text-accent" />
                </span>
                Faculty Portal
              </button>
            </>
          )}

          {viewState === 'faculty_list' && (
            <div className="space-y-3">
              <p className="text-xs text-textSecondary uppercase font-semibold mb-2">Select Faculty Profile</p>
              
              {/* Dr. Amitaben Shah */}
              {amitaben && (
                <button
                  onClick={() => onLogin(UserRole.FACULTY, amitaben.id)}
                  className="w-full flex items-center p-3 rounded-xl bg-bgSecondary hover:bg-bgPrimary border border-border hover:border-accent transition-all group text-left"
                >
                  <img src={amitaben.image} className="w-10 h-10 rounded-full mr-3 border border-border" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-textPrimary group-hover:text-accent transition-colors">{amitaben.name}</p>
                    <p className="text-xs text-textSecondary">{amitaben.position}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-textSecondary group-hover:text-accent" />
                </button>
              )}

              {/* Mr. Maitrik Shah */}
              {maitrik && (
                <button
                  onClick={() => onLogin(UserRole.FACULTY, maitrik.id)}
                  className="w-full flex items-center p-3 rounded-xl bg-bgSecondary hover:bg-bgPrimary border border-border hover:border-accent transition-all group text-left"
                >
                   <img src={maitrik.image} className="w-10 h-10 rounded-full mr-3 border border-border" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-textPrimary group-hover:text-accent transition-colors">{maitrik.name}</p>
                    <p className="text-xs text-textSecondary">{maitrik.position}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-textSecondary group-hover:text-accent" />
                </button>
              )}

              {/* Generic/Admin */}
              <button
                  onClick={() => onLogin(UserRole.FACULTY, 'f1')} // Default to HOD
                  className="w-full flex items-center p-3 rounded-xl bg-bgSecondary hover:bg-bgPrimary border border-border hover:border-accent transition-all group text-left opacity-60"
                >
                  <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center mr-3 border border-border">
                    <UserCircle className="w-6 h-6 text-textSecondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-textPrimary">HOD (Dr. Thaker)</p>
                    <p className="text-xs text-textSecondary">Computer Engineering</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-textSecondary" />
                </button>

               <button 
                onClick={() => setViewState('selection')}
                className="w-full text-center text-sm text-textSecondary hover:text-textPrimary mt-4 flex items-center justify-center"
              >
                <ArrowLeft className="w-3 h-3 mr-1" /> Back
              </button>
            </div>
          )}
        </div>
        
        {viewState === 'selection' && (
          <div className="bg-bgSecondary px-8 py-4 border-t border-border text-center">
            <button 
              onClick={onBack}
              className="text-sm text-textSecondary hover:text-textPrimary hover:underline"
            >
              &larr; Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

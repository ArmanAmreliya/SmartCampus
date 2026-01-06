import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { User, Mail, Hash, BookOpen, Phone, GraduationCap, Camera, Save, X } from 'lucide-react';

interface StudentProfileProps {
  profile: StudentProfile;
  onUpdate: (profile: StudentProfile) => void;
}

export const StudentProfileView: React.FC<StudentProfileProps> = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>(profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-textPrimary">My Profile</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-bgSecondary border border-border text-textPrimary rounded-lg hover:border-accent hover:text-accent transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
        {/* Banner/Header Background */}
        <div className="h-32 bg-gradient-to-r from-bgSecondary to-card border-b border-border relative">
          <div className="absolute inset-0 bg-accent/5"></div>
        </div>

        <div className="px-8 pb-8">
          {/* Avatar Section */}
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-card overflow-hidden bg-bgSecondary">
                <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-accent text-bgPrimary rounded-full hover:bg-accentHover shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            {isEditing && (
              <div className="flex space-x-2 mb-2">
                <button onClick={handleCancel} className="flex items-center px-4 py-2 bg-bgSecondary text-textSecondary rounded-lg hover:text-textPrimary">
                  <X className="w-4 h-4 mr-2" /> Cancel
                </button>
                <button onClick={handleSave} className="flex items-center px-4 py-2 bg-accent text-bgPrimary rounded-lg hover:bg-accentHover shadow-lg shadow-accent/20">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Profile Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              <div className="group">
                <label className="flex items-center text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  <User className="w-3 h-3 mr-2" /> Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-bgPrimary border border-border rounded-lg px-4 py-3 text-textPrimary focus:ring-1 focus:ring-accent outline-none"
                  />
                ) : (
                  <p className="text-lg font-medium text-textPrimary pl-1">{profile.name}</p>
                )}
              </div>

              <div className="group">
                <label className="flex items-center text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  <Mail className="w-3 h-3 mr-2" /> Official Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-bgPrimary border border-border rounded-lg px-4 py-3 text-textPrimary focus:ring-1 focus:ring-accent outline-none"
                  />
                ) : (
                  <p className="text-lg font-medium text-textPrimary pl-1">{profile.email}</p>
                )}
              </div>

              <div className="group">
                <label className="flex items-center text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  <Phone className="w-3 h-3 mr-2" /> Contact Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-bgPrimary border border-border rounded-lg px-4 py-3 text-textPrimary focus:ring-1 focus:ring-accent outline-none"
                  />
                ) : (
                  <p className="text-lg font-medium text-textPrimary pl-1">{profile.phone}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="group">
                <label className="flex items-center text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  <Hash className="w-3 h-3 mr-2" /> Enrollment Number
                </label>
                <div className="bg-bgSecondary/30 rounded-lg px-4 py-3 border border-border border-dashed">
                  <p className="text-lg font-mono text-textPrimary tracking-wide">{profile.enrollmentNo}</p>
                </div>
                <p className="text-[10px] text-textSecondary mt-1 ml-1">* Cannot be changed by student</p>
              </div>

              <div className="group">
                <label className="flex items-center text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  <GraduationCap className="w-3 h-3 mr-2" /> Department
                </label>
                <div className="bg-bgSecondary/30 rounded-lg px-4 py-3 border border-border border-dashed">
                   <p className="text-lg font-medium text-textPrimary">{profile.department}</p>
                </div>
              </div>

              <div className="group">
                <label className="flex items-center text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                  <BookOpen className="w-3 h-3 mr-2" /> Current Semester
                </label>
                {isEditing ? (
                   <input
                    type="number"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className="w-full bg-bgPrimary border border-border rounded-lg px-4 py-3 text-textPrimary focus:ring-1 focus:ring-accent outline-none"
                    min={1}
                    max={8}
                  />
                ) : (
                  <p className="text-lg font-medium text-textPrimary pl-1">Semester {profile.semester}</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* LDCE Identity Badge */}
      <div className="flex items-center justify-center p-6 opacity-50">
         <p className="text-xs text-textSecondary uppercase tracking-widest font-semibold">L.D. College of Engineering • Student Identity</p>
      </div>
    </div>
  );
};

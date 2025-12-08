
import React from 'react';
import { User, Mail, Phone, MapPin, Shield, Calendar, Bell, Lock } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
          {/* Cover Photo area */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          
          <div className="relative mt-12 flex flex-col md:flex-row items-end gap-6">
             <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-xl">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white">
                   AU
                </div>
             </div>
             <div className="mb-2">
                <h1 className="text-3xl font-bold text-slate-800">Admin User</h1>
                <p className="text-slate-500 font-medium">Super Administrator • Dhaka, Bangladesh</p>
             </div>
             <div className="flex-1"></div>
             <div className="mb-2 flex gap-3">
                 <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    Edit Profile
                 </button>
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Contact Info</h3>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 text-slate-600">
                      <Mail size={18} className="text-slate-400" /> admin@rtech.com
                   </div>
                   <div className="flex items-center gap-3 text-slate-600">
                      <Phone size={18} className="text-slate-400" /> +880 1700 000000
                   </div>
                   <div className="flex items-center gap-3 text-slate-600">
                      <MapPin size={18} className="text-slate-400" /> 123 Tech Park, Dhaka
                   </div>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Role Info</h3>
                <div className="flex items-center gap-3 text-slate-600 mb-2">
                   <Shield size={18} className="text-indigo-500" /> Super Admin Access
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                   <Calendar size={18} className="text-indigo-500" /> Joined Jan 2020
                </div>
             </div>
          </div>

          {/* Right Column - Settingsish stuff */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-6">Account Settings</h3>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Bell size={20}/></div>
                          <div>
                             <h4 className="font-semibold text-slate-800">Notifications</h4>
                             <p className="text-sm text-slate-500">Receive email updates about system activity</p>
                          </div>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                       </label>
                    </div>

                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                       <div className="flex items-center gap-4">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Lock size={20}/></div>
                          <div>
                             <h4 className="font-semibold text-slate-800">Two-Factor Authentication</h4>
                             <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                          </div>
                       </div>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                       </label>
                    </div>
                 </div>
              </div>
           </div>
       </div>
    </div>
  );
};

export default Profile;

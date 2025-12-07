
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Departments from './components/Departments';
import Tasks from './components/Tasks';
import IdeaLab from './components/IdeaLab';
import CRM from './components/CRM'; 
import Calendar from './components/Calendar';
import Attendance from './components/Attendance';
import { View } from './types';
import { Bell, Search, UserCircle, Settings, LogOut, ChevronDown, Check } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mock Data for Dropdowns
  const notifications = [
    { id: 1, text: 'New task assigned: "Homepage Redesign"', time: '5m ago', unread: true },
    { id: 2, text: 'Server maintenance scheduled for 12:00 AM', time: '1h ago', unread: true },
    { id: 3, text: 'John Doe commented on "Project Alpha"', time: '2h ago', unread: false },
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard />;
      case 'EMPLOYEES': return <Employees />;
      case 'DEPARTMENTS': return <Departments />;
      case 'ATTENDANCE': return <Attendance />;
      case 'TASKS': return <Tasks />;
      case 'CRM': return <CRM />;
      case 'CALENDAR': return <Calendar />;
      case 'IDEAS': return <IdeaLab />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 relative">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-slate-200 sticky top-4 z-40 transition-all">
          {/* Search Bar */}
          <div className="relative group w-96">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
             </div>
             <input 
                type="text" 
                placeholder="Search tasks, employees, or files..." 
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:text-sm transition-all shadow-sm"
             />
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-slate-400 text-[10px] font-bold border border-slate-200 rounded px-1.5 py-0.5 bg-slate-100">⌘ K</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsUserMenuOpen(false); }}
                className={`relative p-2.5 rounded-xl transition-all outline-none ${
                  isNotificationsOpen 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                   <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-semibold text-slate-800 text-sm">Notifications</h3>
                      <button className="text-[10px] text-indigo-600 font-bold hover:underline uppercase tracking-wide">Mark all read</button>
                   </div>
                   <div className="max-h-[300px] overflow-y-auto">
                     {notifications.map(n => (
                       <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 group ${n.unread ? 'bg-indigo-50/30' : ''}`}>
                          <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.unread ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                          <div>
                            <p className={`text-sm leading-snug ${n.unread ? 'font-medium text-slate-800' : 'text-slate-600'}`}>{n.text}</p>
                            <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                          </div>
                       </div>
                     ))}
                   </div>
                   <div className="p-3 text-center border-t border-slate-50 bg-slate-50/50 hover:bg-slate-100 transition-colors cursor-pointer">
                      <span className="text-xs text-slate-500 font-medium">View All Activity</span>
                   </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative pl-4 border-l border-slate-200">
              <button 
                 onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsNotificationsOpen(false); }}
                 className="flex items-center gap-3 group focus:outline-none"
              >
                <div className="text-right hidden md:block">
                  <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">Admin User</div>
                  <div className="text-xs text-slate-500 font-medium">Super Admin</div>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md transition-transform group-hover:scale-105 ${isUserMenuOpen ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}>
                   <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                      <span className="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 to-purple-600">AU</span>
                   </div>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                   <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-sm font-bold text-slate-800">Admin User</p>
                      <p className="text-xs text-slate-500">admin@rtech.com</p>
                   </div>
                   <div className="p-2 space-y-1">
                      <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-2.5 font-medium">
                         <UserCircle size={16} className="text-slate-400" /> My Profile
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-2.5 font-medium">
                         <Settings size={16} className="text-slate-400" /> Account Settings
                      </button>
                   </div>
                   <div className="p-2 border-t border-slate-50">
                      <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2.5 font-semibold">
                         <LogOut size={16} /> Sign Out
                      </button>
                   </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;

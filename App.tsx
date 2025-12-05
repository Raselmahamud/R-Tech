import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Tasks from './components/Tasks';
import IdeaLab from './components/IdeaLab';
import { View } from './types';
import { Bell, Search, UserCircle } from 'lucide-react';

// Simple CRM Component defined inline for brevity as requested by "few files" logic, 
// though logically separate in larger apps.
const CRM: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-slate-800">Customer Relationship Management</h2>
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-4 font-semibold text-slate-600">Client Name</th>
            <th className="px-6 py-4 font-semibold text-slate-600">Company</th>
            <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
            <th className="px-6 py-4 font-semibold text-slate-600">Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[
            { name: "John Doe", company: "Alpha Corp", status: "Active", value: "$5,000" },
            { name: "Jane Smith", company: "Beta Ltd", status: "Lead", value: "$2,200" },
            { name: "Mike Ross", company: "Pearson Hardman", status: "Active", value: "$12,000" },
          ].map((c, i) => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="px-6 py-4">{c.name}</td>
              <td className="px-6 py-4">{c.company}</td>
              <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">{c.status}</span></td>
              <td className="px-6 py-4 font-mono">{c.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Simple Calendar Component
const CalendarView: React.FC = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">November 2023</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded hover:bg-slate-50">Previous</button>
          <button className="px-4 py-2 border rounded hover:bg-slate-50">Next</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden">
        {days.map(d => <div key={d} className="bg-slate-50 p-2 text-center font-semibold text-slate-600">{d}</div>)}
        {Array.from({length: 35}).map((_, i) => (
          <div key={i} className="bg-white h-32 p-2 hover:bg-indigo-50 transition-colors cursor-pointer relative group">
            <span className="text-sm text-slate-400 font-medium">{i + 1 > 30 ? i - 29 : i + 1}</span>
            {i === 4 && <div className="mt-2 bg-indigo-100 text-indigo-700 text-xs p-1 rounded font-medium">Team Standup 10:00 AM</div>}
            {i === 12 && <div className="mt-2 bg-purple-100 text-purple-700 text-xs p-1 rounded font-medium">Client Demo 2:00 PM</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard />;
      case 'EMPLOYEES': return <Employees />;
      case 'TASKS': return <Tasks />;
      case 'CRM': return <CRM />;
      case 'CALENDAR': return <CalendarView />;
      case 'IDEAS': return <IdeaLab />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-100 sticky top-4 z-40">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
            <Search className="text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none focus:outline-none w-full text-sm text-slate-700"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <div className="text-sm font-semibold text-slate-800">Admin User</div>
                <div className="text-xs text-slate-500">Super Admin</div>
              </div>
              <UserCircle size={32} className="text-slate-400" />
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

import React from 'react';
import { View } from '../types';
import { LayoutDashboard, Users, CheckSquare, Briefcase, Calendar, Lightbulb, LogOut, Settings, Clock, Building2, CreditCard, CalendarCheck } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const menuItems = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'EMPLOYEES', label: 'Employees', icon: Users },
    { id: 'DEPARTMENTS', label: 'Departments', icon: Building2 },
    { id: 'ATTENDANCE', label: 'Attendance', icon: Clock },
    { id: 'PAYROLL', label: 'Payroll', icon: CreditCard },
    { id: 'TASKS', label: 'Task Tracker', icon: CheckSquare },
    { id: 'CRM', label: 'CRM / Customers', icon: Briefcase },
    { id: 'APPOINTMENTS', label: 'Appointments', icon: CalendarCheck },
    { id: 'CALENDAR', label: 'Calendar', icon: Calendar },
    { id: 'IDEAS', label: 'Idea Lab & AI', icon: Lightbulb },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen text-slate-300 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-lg">R</div>
          R Tech
        </h1>
        <p className="text-xs text-slate-500 mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.id 
                ? 'bg-indigo-600 text-white' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;

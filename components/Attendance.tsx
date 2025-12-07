
import React, { useState } from 'react';
import { AttendanceRecord } from '../types';
import { 
  Search, Calendar, Filter, Download, ChevronLeft, ChevronRight, 
  Clock, AlertCircle, CheckCircle2, UserX, Sun
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock Data Generator
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const employees = [
    { id: '1', name: 'Rahim Khan', role: 'Manager' },
    { id: '2', name: 'Sultana Jasmine', role: 'Developer' },
    { id: '3', name: 'Karim Ullah', role: 'Designer' },
    { id: '4', name: 'David Smith', role: 'HR' },
    { id: '5', name: 'Fatima Begum', role: 'Developer' },
  ];

  const statuses: AttendanceRecord['status'][] = ['Present', 'Late', 'Absent', 'Half Day', 'Present', 'Present', 'Late'];
  
  // Generate for last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    employees.forEach(emp => {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      let checkIn = null;
      let checkOut = null;
      let hours = 0;

      if (randomStatus === 'Present') {
        checkIn = '09:00 AM';
        checkOut = '06:00 PM';
        hours = 9;
      } else if (randomStatus === 'Late') {
        checkIn = '09:45 AM';
        checkOut = '06:00 PM';
        hours = 8.25;
      } else if (randomStatus === 'Half Day') {
        checkIn = '09:00 AM';
        checkOut = '01:00 PM';
        hours = 4;
      }

      records.push({
        id: `${emp.id}-${dateStr}`,
        employeeId: emp.id,
        employeeName: emp.name,
        role: emp.role,
        date: dateStr,
        status: randomStatus,
        checkIn,
        checkOut,
        workHours: hours
      });
    });
  }
  return records;
};

const MOCK_DATA = generateMockAttendance();

const Attendance: React.FC = () => {
  const [filterType, setFilterType] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');

  // Date Navigation Logic
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (filterType === 'Daily') newDate.setDate(newDate.getDate() - 1);
    if (filterType === 'Weekly') newDate.setDate(newDate.getDate() - 7);
    if (filterType === 'Monthly') newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (filterType === 'Daily') newDate.setDate(newDate.getDate() + 1);
    if (filterType === 'Weekly') newDate.setDate(newDate.getDate() + 7);
    if (filterType === 'Monthly') newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Filter Data Logic
  const getFilteredData = () => {
    const filtered = MOCK_DATA.filter(record => {
      const recordDate = new Date(record.date);
      let match = false;

      if (filterType === 'Daily') {
        match = record.date === currentDate.toISOString().split('T')[0];
      } else if (filterType === 'Weekly') {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        match = recordDate >= startOfWeek && recordDate <= endOfWeek;
      } else {
        match = recordDate.getMonth() === currentDate.getMonth() && recordDate.getFullYear() === currentDate.getFullYear();
      }

      const searchMatch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
      return match && searchMatch;
    });

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const filteredData = getFilteredData();

  // Calculate Stats
  const stats = {
    present: filteredData.filter(r => r.status === 'Present').length,
    late: filteredData.filter(r => r.status === 'Late').length,
    absent: filteredData.filter(r => r.status === 'Absent').length,
    leaves: filteredData.filter(r => r.status === 'On Leave').length,
  };

  // Chart Data Preparation
  const chartData = [
    { name: 'Present', value: stats.present, color: '#22c55e' },
    { name: 'Late', value: stats.late, color: '#eab308' },
    { name: 'Half Day', value: filteredData.filter(r => r.status === 'Half Day').length, color: '#3b82f6' },
    { name: 'Absent', value: stats.absent, color: '#ef4444' },
  ];

  const getDateLabel = () => {
    if (filterType === 'Daily') return currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    if (filterType === 'Monthly') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Attendance Tracker</h2>
          <p className="text-slate-500">Monitor employee check-ins, working hours, and availability.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
              <Download size={16}/> Export Report
           </button>
           <div className="flex bg-slate-200 p-1 rounded-lg">
              {['Daily', 'Weekly', 'Monthly'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f as any)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    filterType === f ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Present</p>
             <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.present}</h3>
             <p className="text-xs text-slate-500 mt-1">Based on selection</p>
           </div>
           <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle2 size={24}/></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Late Arrivals</p>
             <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.late}</h3>
             <p className="text-xs text-red-500 mt-1">+2% from last week</p>
           </div>
           <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={24}/></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Absent</p>
             <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.absent}</h3>
             <p className="text-xs text-slate-500 mt-1">Unexcused</p>
           </div>
           <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={24}/></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">On Leave</p>
             <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.leaves}</h3>
             <p className="text-xs text-slate-500 mt-1">Approved</p>
           </div>
           <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Sun size={24}/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[600px]">
          {/* Toolbar */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
             <div className="flex items-center gap-4">
                <button onClick={handlePrev} className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600"><ChevronLeft size={20}/></button>
                <div className="flex items-center gap-2 font-bold text-slate-700 min-w-[150px] justify-center">
                   <Calendar size={18} className="text-indigo-500"/>
                   {getDateLabel()}
                </div>
                <button onClick={handleNext} className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600"><ChevronRight size={20}/></button>
             </div>
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="Filter by name..."
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
             <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider sticky top-0 z-10 shadow-sm">
                 <tr>
                   <th className="px-6 py-4">Employee</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4 text-center">Check In</th>
                   <th className="px-6 py-4 text-center">Check Out</th>
                   <th className="px-6 py-4 text-center">Work Hours</th>
                   <th className="px-6 py-4 text-center">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400">No attendance records found for this period.</td>
                    </tr>
                 ) : (
                   filteredData.map((record) => (
                     <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                             {record.employeeName.charAt(0)}
                           </div>
                           <div>
                             <div className="font-semibold text-slate-800 text-sm">{record.employeeName}</div>
                             <div className="text-xs text-slate-500">{record.role}</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-sm text-slate-600">
                         {new Date(record.date).toLocaleDateString()}
                       </td>
                       <td className="px-6 py-4 text-center">
                         {record.checkIn ? (
                           <span className={`px-2 py-1 rounded-md text-xs font-mono font-medium ${
                             record.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
                           }`}>
                             {record.checkIn}
                           </span>
                         ) : <span className="text-slate-300">-</span>}
                       </td>
                       <td className="px-6 py-4 text-center">
                         {record.checkOut ? (
                           <span className="text-sm text-slate-600 font-mono">{record.checkOut}</span>
                         ) : <span className="text-slate-300">-</span>}
                       </td>
                       <td className="px-6 py-4 text-center">
                         {record.workHours > 0 ? (
                           <span className={`text-sm font-bold ${record.workHours < 8 ? 'text-red-500' : 'text-green-600'}`}>
                             {record.workHours}h
                           </span>
                         ) : <span className="text-slate-300">-</span>}
                       </td>
                       <td className="px-6 py-4 text-center">
                         <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                           record.status === 'Present' ? 'bg-green-50 text-green-700 border-green-200' :
                           record.status === 'Late' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                           record.status === 'Half Day' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                           'bg-red-50 text-red-700 border-red-200'
                         }`}>
                           {record.status}
                         </span>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
          </div>
        </div>

        {/* Sidebar Charts & Summary */}
        <div className="space-y-6">
           {/* Chart */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[320px] flex flex-col">
              <h3 className="font-bold text-slate-800 mb-4">Attendance Overview</h3>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                    <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Alerts / Anomalies */}
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <AlertCircle size={18} className="text-orange-500" /> Anomalies Detected
              </h3>
              <div className="space-y-4">
                 <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
                    <UserX className="text-red-500 mt-0.5" size={16} />
                    <div>
                       <p className="text-xs font-bold text-red-800">Karim Ullah</p>
                       <p className="text-xs text-red-600">Absent for 3 consecutive days without leave application.</p>
                    </div>
                 </div>
                 <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 flex items-start gap-3">
                    <Clock className="text-yellow-600 mt-0.5" size={16} />
                    <div>
                       <p className="text-xs font-bold text-yellow-800">Sultana Jasmine</p>
                       <p className="text-xs text-yellow-700">Late arrival (avg 15m) for the last 4 days.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

import React, { useState } from 'react';
import { Employee, EmployeeRole, TaskStatus } from '../types';
import { 
  Search, Plus, User, DollarSign, Mail, Shield, Eye, Edit2, Trash2, 
  ArrowLeft, Calendar, Clock, CheckSquare, Activity, MapPin, Phone, 
  FileText, LogIn, LogOut, Briefcase, AlertCircle, X, UserPlus, 
  BookOpen, GraduationCap, CheckCircle2, ChevronRight, History,
  MoreVertical, CircleDashed
} from 'lucide-react';

// --- Types for Local State/Mock Data ---
interface AttendanceLog {
  date: string;
  checkIn: string;
  checkOut: string;
  hours: number;
  status: 'On Time' | 'Late' | 'Half Day';
}

interface PayrollRecord {
  month: string;
  basic: number;
  bonus: number;
  deductions: number;
  net: number;
  status: 'Paid' | 'Pending';
}

interface LeaveRecord {
  type: string;
  balance: number;
  used: number;
}

interface OnboardingHistoryItem {
  id: string;
  name: string;
  department: string;
  joinDate: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Pending';
  lastActivity: string;
}

// --- Mock Data ---
const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Rahim Khan', role: EmployeeRole.MANAGER, email: 'rahim@rtech.com', phone: '+880 1711 223344', joinDate: '2020-03-15', salary: 2500, status: 'Active', department: 'Management' },
  { id: '2', name: 'Sultana Jasmine', role: EmployeeRole.DEVELOPER, email: 'jasmine@rtech.com', phone: '+880 1922 334455', joinDate: '2021-06-01', salary: 1800, status: 'Active', department: 'Engineering' },
  { id: '3', name: 'Karim Ullah', role: EmployeeRole.DESIGNER, email: 'karim@rtech.com', phone: '+880 1833 445566', joinDate: '2022-01-10', salary: 1600, status: 'On Leave', department: 'Design' },
  { id: '4', name: 'David Smith', role: EmployeeRole.HR, email: 'david@rtech.com', phone: '+880 1644 556677', joinDate: '2019-11-20', salary: 2000, status: 'Active', department: 'Human Resources' },
  { id: '5', name: 'Fatima Begum', role: EmployeeRole.DEVELOPER, email: 'fatima@rtech.com', phone: '+880 1555 667788', joinDate: '2023-02-14', salary: 1900, status: 'Active', department: 'Engineering' },
];

const MOCK_ATTENDANCE: AttendanceLog[] = [
  { date: '2023-10-26', checkIn: '09:02 AM', checkOut: '06:05 PM', hours: 9, status: 'On Time' },
  { date: '2023-10-25', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: 8.75, status: 'Late' },
  { date: '2023-10-24', checkIn: '08:55 AM', checkOut: '06:10 PM', hours: 9.25, status: 'On Time' },
  { date: '2023-10-23', checkIn: '09:00 AM', checkOut: '05:30 PM', hours: 8.5, status: 'On Time' },
  { date: '2023-10-22', checkIn: '10:00 AM', checkOut: '02:00 PM', hours: 4, status: 'Half Day' },
];

const MOCK_LEAVES: LeaveRecord[] = [
  { type: 'Annual Leave', balance: 15, used: 5 },
  { type: 'Sick Leave', balance: 10, used: 2 },
  { type: 'Casual Leave', balance: 5, used: 5 },
];

const MOCK_ACTIVITIES = [
  { id: 1, text: 'Completed task "Dashboard UI Fixes"', time: '2 hours ago', icon: CheckSquare, color: 'text-green-500 bg-green-50' },
  { id: 2, text: 'Checked in at Office', time: '5 hours ago', icon: LogIn, color: 'text-blue-500 bg-blue-50' },
  { id: 3, text: 'Submitted Monthly Report', time: 'Yesterday', icon: FileText, color: 'text-purple-500 bg-purple-50' },
  { id: 4, text: 'Meeting with Client Alpha', time: '2 days ago', icon: User, color: 'text-orange-500 bg-orange-50' },
];

const MOCK_ONBOARDING_HISTORY: OnboardingHistoryItem[] = [
  { id: '101', name: 'Alice Walker', department: 'Marketing', joinDate: '2023-10-15', progress: 100, status: 'Completed', lastActivity: 'Training Completed' },
  { id: '102', name: 'John Wick', department: 'Security', joinDate: '2023-11-01', progress: 65, status: 'In Progress', lastActivity: 'Policy Signed' },
  { id: '103', name: 'Tony Stark', department: 'Engineering', joinDate: '2023-11-05', progress: 30, status: 'In Progress', lastActivity: 'Account Setup' },
  { id: '104', name: 'Bruce Banner', department: 'Research', joinDate: '2023-11-08', progress: 0, status: 'Pending', lastActivity: 'Invite Sent' },
];

// --- Components ---

const EmployeeDetailView: React.FC<{ employee: Employee; onBack: () => void }> = ({ employee, onBack }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PAYROLL' | 'ATTENDANCE' | 'TASKS'>('OVERVIEW');

  // Generate mock payroll based on salary
  const payrollHistory: PayrollRecord[] = [
    { month: 'Oct 2023', basic: employee.salary, bonus: 200, deductions: 50, net: employee.salary + 150, status: 'Paid' },
    { month: 'Sep 2023', basic: employee.salary, bonus: 0, deductions: 50, net: employee.salary - 50, status: 'Paid' },
    { month: 'Aug 2023', basic: employee.salary, bonus: 500, deductions: 100, net: employee.salary + 400, status: 'Paid' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header / Back Button */}
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-4">
        <ArrowLeft size={18} className="mr-2" /> Back to List
      </button>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-white shadow-md">
          {employee.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{employee.name}</h1>
              <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                <Briefcase size={16} /> {employee.role} • {employee.department}
              </p>
            </div>
            <div className={`mt-2 md:mt-0 px-4 py-1.5 rounded-full text-sm font-semibold inline-block ${
              employee.status === 'Active' ? 'bg-green-100 text-green-700' :
              employee.status === 'On Leave' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            }`}>
              {employee.status}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="p-2 bg-white rounded-full text-slate-500 shadow-sm"><Mail size={16} /></div>
              <div className="text-sm">
                <p className="text-slate-400 text-xs">Email</p>
                <p className="font-medium text-slate-700">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="p-2 bg-white rounded-full text-slate-500 shadow-sm"><Phone size={16} /></div>
              <div className="text-sm">
                <p className="text-slate-400 text-xs">Phone</p>
                <p className="font-medium text-slate-700">{employee.phone || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="p-2 bg-white rounded-full text-slate-500 shadow-sm"><MapPin size={16} /></div>
              <div className="text-sm">
                <p className="text-slate-400 text-xs">Location</p>
                <p className="font-medium text-slate-700">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-6">
        {['OVERVIEW', 'ATTENDANCE', 'PAYROLL', 'TASKS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 text-sm font-semibold transition-colors relative ${
              activeTab === tab ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()}
            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Content (Based on Tab) */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'OVERVIEW' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-slate-500 text-xs font-medium uppercase">Total Salary Paid</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">${(employee.salary * 12).toLocaleString()}</h3>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Activity size={12}/> YTD</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-slate-500 text-xs font-medium uppercase">Attendance Rate</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">96%</h3>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><Clock size={12}/> Average 8.5h</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <p className="text-slate-500 text-xs font-medium uppercase">Tasks Completed</p>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">45</h3>
                  <p className="text-xs text-indigo-600 mt-1 flex items-center gap-1"><CheckSquare size={12}/> 5 Pending</p>
                </div>
              </div>

              {/* Activity Log */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity size={18} className="text-indigo-500"/> Recent Activity
                </h3>
                <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:h-full before:w-0.5 before:bg-slate-100">
                  {MOCK_ACTIVITIES.map((act) => (
                    <div key={act.id} className="relative pl-10">
                      <div className={`absolute left-2 top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${act.color.replace('text-', 'bg-').replace('bg-', '')} transform -translate-x-1/2`}></div>
                      <p className="text-sm font-medium text-slate-800">{act.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'ATTENDANCE' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700">Office In/Out Log</h3>
                <button className="text-sm text-indigo-600 hover:underline">Download Report</button>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">In Time</th>
                    <th className="px-6 py-3 font-medium">Out Time</th>
                    <th className="px-6 py-3 font-medium">Hours</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_ATTENDANCE.map((log, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-6 py-3 text-slate-700">{log.date}</td>
                      <td className="px-6 py-3 text-green-600 font-medium"><LogIn size={14} className="inline mr-1"/>{log.checkIn}</td>
                      <td className="px-6 py-3 text-red-500 font-medium"><LogOut size={14} className="inline mr-1"/>{log.checkOut}</td>
                      <td className="px-6 py-3 text-slate-600">{log.hours}h</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.status === 'On Time' ? 'bg-green-100 text-green-700' :
                          log.status === 'Late' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'
                        }`}>{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'PAYROLL' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-semibold text-slate-700">Payroll History</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Month</th>
                    <th className="px-6 py-3 font-medium">Basic</th>
                    <th className="px-6 py-3 font-medium">Bonus</th>
                    <th className="px-6 py-3 font-medium">Deductions</th>
                    <th className="px-6 py-3 font-medium text-right">Net Pay</th>
                    <th className="px-6 py-3 font-medium text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payrollHistory.map((pay, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-700">{pay.month}</td>
                      <td className="px-6 py-3 text-slate-500">${pay.basic}</td>
                      <td className="px-6 py-3 text-green-600">+${pay.bonus}</td>
                      <td className="px-6 py-3 text-red-500">-${pay.deductions}</td>
                      <td className="px-6 py-3 text-right font-bold text-slate-800">${pay.net}</td>
                      <td className="px-6 py-3 text-center">
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">{pay.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeTab === 'TASKS' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                 <h3 className="font-semibold text-slate-700 mb-4">Assigned Tasks</h3>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><CheckSquare size={18}/></div>
                            <div>
                                <p className="font-medium text-slate-800">Design System Update</p>
                                <p className="text-xs text-slate-500">Due: Nov 15, 2023</p>
                            </div>
                        </div>
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">In Progress</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckSquare size={18}/></div>
                            <div>
                                <p className="font-medium text-slate-800">API Documentation</p>
                                <p className="text-xs text-slate-500">Due: Oct 30, 2023</p>
                            </div>
                        </div>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Done</span>
                    </div>
                 </div>
            </div>
          )}

        </div>

        {/* Right Sidebar (Always Visible) */}
        <div className="space-y-6">
          {/* Leave Status Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              <span>Leave Status</span>
              <span className="text-xs text-indigo-600 font-medium cursor-pointer">Apply Leave</span>
            </h3>
            <div className="space-y-4">
              {MOCK_LEAVES.map((leave, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{leave.type}</span>
                    <span className="font-medium text-slate-800">{leave.used}/{leave.balance} Used</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full" 
                      style={{ width: `${(leave.used / leave.balance) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
               <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-yellow-800 font-medium">Pending Request</p>
                    <p className="text-xs text-yellow-700">Sick Leave - Nov 12 (1 Day)</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-xl shadow-lg text-white">
            <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 px-3 rounded-lg text-sm text-left flex items-center gap-2">
                <FileText size={16} /> Generate Payslip
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 px-3 rounded-lg text-sm text-left flex items-center gap-2">
                <Briefcase size={16} /> Assign New Task
              </button>
              <button className="w-full bg-white/20 hover:bg-white/30 transition-colors py-2 px-3 rounded-lg text-sm text-left flex items-center gap-2">
                <Mail size={16} /> Send Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- New Onboarding Wizard Component ---
const OnboardingWizard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [view, setView] = useState<'HISTORY' | 'WIZARD'>('HISTORY');
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step === s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
            step > s ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {step > s ? <CheckCircle2 size={16} /> : s}
          </div>
          {s < 3 && <div className={`w-12 h-1 ${step > s ? 'bg-green-500' : 'bg-slate-200'} mx-2`}></div>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <GraduationCap className="text-indigo-200" /> Employee Onboarding
            </h3>
            <p className="text-indigo-100 text-sm mt-1">
              {view === 'HISTORY' ? 'Track and manage onboarding status' : 'Guide new hires through initial setup'}
            </p>
          </div>
          <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors"><X size={24} /></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          {view === 'HISTORY' ? (
            <div className="p-8 space-y-6">
               <div className="flex justify-between items-center">
                  <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <History size={20} className="text-indigo-500"/> Recent History
                  </h4>
                  <button 
                    onClick={() => setView('WIZARD')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-md shadow-indigo-200"
                  >
                    <Plus size={16} /> Start New Onboarding
                  </button>
               </div>

               <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-slate-50 text-slate-500 font-medium">
                     <tr>
                       <th className="px-6 py-3">Employee</th>
                       <th className="px-6 py-3">Department</th>
                       <th className="px-6 py-3">Progress</th>
                       <th className="px-6 py-3">Status</th>
                       <th className="px-6 py-3">Last Activity</th>
                       <th className="px-6 py-3 text-right">Action</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                      {MOCK_ONBOARDING_HISTORY.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                          <td className="px-6 py-4 text-slate-500">{item.department}</td>
                          <td className="px-6 py-4 w-40">
                             <div className="flex items-center gap-2">
                               <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full ${
                                      item.progress === 100 ? 'bg-green-500' : 'bg-indigo-500'
                                    }`} 
                                    style={{width: `${item.progress}%`}}
                                 ></div>
                               </div>
                               <span className="text-xs font-medium text-slate-600">{item.progress}%</span>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              item.status === 'Completed' ? 'bg-green-50 text-green-700' :
                              item.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {item.status === 'Completed' ? <CheckCircle2 size={12}/> : 
                               item.status === 'In Progress' ? <CircleDashed size={12} className="animate-spin-slow"/> : null}
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                             <div className="flex items-center gap-1.5">
                                <Clock size={12}/> {item.lastActivity}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="text-slate-400 hover:text-indigo-600">
                               <MoreVertical size={16} />
                             </button>
                          </td>
                        </tr>
                      ))}
                   </tbody>
                 </table>
               </div>
            </div>
          ) : (
            <div className="p-8">
              {renderStepIndicator()}

              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <h4 className="text-lg font-bold text-slate-800">Step 1: System Access & Setup</h4>
                  <p className="text-slate-500 text-sm">Create accounts and grant access to required tools.</p>
                  
                  <div className="space-y-3">
                    {['Create Corporate Email (Gmail)', 'Add to Slack Workspace', 'Setup Jira/Asana Access', 'Grant GitHub Repository Access'].map((item, i) => (
                      <label key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50/50 cursor-pointer transition-colors shadow-sm">
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                        <span className="text-slate-700 font-medium">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <h4 className="text-lg font-bold text-slate-800">Step 2: Policy Acknowledgment</h4>
                  <p className="text-slate-500 text-sm">Ensure compliance documents are sent and signed.</p>
                  
                  <div className="space-y-3">
                    {['Non-Disclosure Agreement (NDA)', 'Employee Handbook 2024', 'IT Security Policy', 'Remote Work Policy'].map((item, i) => (
                      <label key={i} className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50/50 cursor-pointer transition-colors shadow-sm">
                        <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                        <div className="flex-1">
                          <span className="text-slate-700 font-medium block">{item}</span>
                          <span className="text-xs text-slate-400">PDF Document • Required Signature</span>
                        </div>
                        <BookOpen size={18} className="text-slate-400" />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <h4 className="text-lg font-bold text-slate-800">Step 3: Training Assignment</h4>
                  <p className="text-slate-500 text-sm">Assign mandatory training modules based on role.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Security Awareness 101', 'Company Culture & Values', 'Agile Methodology Basics', 'Secure Coding Practices'].map((item, i) => (
                      <div key={i} className="p-4 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-all group shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg group-hover:bg-white"><GraduationCap size={20}/></div>
                          <input type="checkbox" className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" />
                        </div>
                        <h5 className="font-semibold text-slate-800 text-sm">{item}</h5>
                        <p className="text-xs text-slate-500 mt-1">Duration: 45 mins</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {view === 'WIZARD' && (
          <div className="p-6 border-t border-slate-200 bg-white flex justify-between">
            <button 
              onClick={() => step > 1 ? setStep(step - 1) : setView('HISTORY')}
              className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900 transition-colors"
            >
              {step === 1 ? 'Back to History' : 'Back'}
            </button>
            <button 
              onClick={() => step < totalSteps ? setStep(step + 1) : setView('HISTORY')}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
            >
              {step === totalSteps ? 'Complete Setup' : 'Next Step'}
              {step !== totalSteps && <ChevronRight size={16} />}
            </button>
          </div>
        )}
        {view === 'HISTORY' && (
           <div className="p-6 border-t border-slate-200 bg-white flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: '',
    email: '',
    role: EmployeeRole.DEVELOPER,
    department: '',
    salary: 0,
    status: 'Active',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);

  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  const resetForm = () => {
    setNewEmployee({
      name: '',
      email: '',
      role: EmployeeRole.DEVELOPER,
      department: '',
      salary: 0,
      status: 'Active',
      phone: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setEditingId(null);
  };

  const handleSaveEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingId) {
      // Edit existing employee
      setEmployees(employees.map(emp => 
        emp.id === editingId ? { ...emp, ...newEmployee } as Employee : emp
      ));
    } else {
      // Add new employee
      const employeeToAdd: Employee = {
        id: (Math.max(...employees.map(e => parseInt(e.id) || 0), 0) + 1).toString(),
        name: newEmployee.name!,
        email: newEmployee.email!,
        role: newEmployee.role as EmployeeRole,
        department: newEmployee.department!,
        salary: Number(newEmployee.salary) || 0,
        status: newEmployee.status as 'Active' | 'On Leave' | 'Terminated',
        phone: newEmployee.phone || '',
        joinDate: newEmployee.joinDate || new Date().toISOString().split('T')[0]
      };
      setEmployees([...employees, employeeToAdd]);
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setNewEmployee(emp);
    setEditingId(emp.id);
    setIsAddModalOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(e => e.id !== id));
      if (selectedEmployeeId === id) setSelectedEmployeeId(null);
    }
  };

  if (selectedEmployee) {
    return <EmployeeDetailView employee={selectedEmployee} onBack={() => setSelectedEmployeeId(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Top Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Employee Management</h2>
          <p className="text-slate-500">Manage your team, roles, and payroll.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm">
            <DollarSign size={16} className="text-indigo-500" />
            <span className="hidden sm:inline text-xs uppercase tracking-wide font-bold">Payroll:</span> 
            <span className="text-slate-800">${totalPayroll.toLocaleString()}</span>
          </div>
          
          <button 
            onClick={() => setIsOnboardingOpen(true)}
            className="bg-white border border-indigo-100 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
          >
            <GraduationCap size={18} /> Onboarding
          </button>

          <button 
            onClick={openAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-indigo-200 font-medium"
          >
            <Plus size={18} /> Add Employee
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-4 bg-slate-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by name, role or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee Details</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Role & Dept</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Salary</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm ring-2 ring-white">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{emp.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail size={10} /> {emp.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {emp.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {emp.joinDate || 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700 flex items-center gap-1 text-sm">
                        <Shield size={12} className="text-indigo-400" />
                        {emp.role}
                      </span>
                      <span className="text-xs text-slate-400 mt-0.5">{emp.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      emp.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                      emp.status === 'On Leave' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-mono text-slate-700 font-medium">${emp.salary.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-100">
                      <button 
                        onClick={() => setSelectedEmployeeId(emp.id)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors tooltip-trigger"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openEditModal(emp)}
                        className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Info"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Employee"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <User size={48} className="mx-auto mb-3 text-slate-300" />
              <p>No employees found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modern Add/Edit Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-indigo-800 flex justify-between items-center text-white">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <UserPlus className="text-indigo-200" size={28} /> {editingId ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
                <p className="text-indigo-100 mt-1 text-sm opacity-90">
                  {editingId ? 'Update employee details and role' : 'Enter details to onboard a new employee'}
                </p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Personal Info Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">Full Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Sarah Connor"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="email" 
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="sarah@company.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Employment Details Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Employment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">Department <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="e.g. Product Design"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                     <label className="block text-sm font-semibold text-slate-700">Monthly Salary <span className="text-red-500">*</span></label>
                     <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                       <input 
                        type="number" 
                        value={newEmployee.salary}
                        onChange={(e) => setNewEmployee({...newEmployee, salary: Number(e.target.value)})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">Role</label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <select 
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value as EmployeeRole})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                      >
                        {Object.values(EmployeeRole).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-slate-700">Status</label>
                    <div className="relative">
                      <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                      <select 
                        value={newEmployee.status}
                        onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value as any})}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                      >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEmployee}
                className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
              >
                {editingId ? 'Update Employee' : 'Save Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Wizard Modal */}
      {isOnboardingOpen && (
        <OnboardingWizard onClose={() => setIsOnboardingOpen(false)} />
      )}
    </div>
  );
};

export default Employees;

import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';
import { Users, DollarSign, CheckCircle, TrendingUp } from 'lucide-react';

// --- Mock Data ---
const financialData = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

const departmentData = [
  { name: 'Engineering', value: 45, color: '#6366f1' }, // Indigo
  { name: 'Design', value: 25, color: '#ec4899' }, // Pink
  { name: 'Marketing', value: 15, color: '#f59e0b' }, // Amber
  { name: 'Management', value: 15, color: '#10b981' }, // Emerald
];

const customerGrowthData = [
  { name: 'Mon', new: 2 },
  { name: 'Tue', new: 5 },
  { name: 'Wed', new: 3 },
  { name: 'Thu', new: 8 },
  { name: 'Fri', new: 6 },
  { name: 'Sat', new: 4 },
  { name: 'Sun', new: 7 },
];

const projectStatusData = [
  { name: 'Completed', value: 12, color: '#22c55e' },
  { name: 'In Progress', value: 8, color: '#3b82f6' },
  { name: 'Pending', value: 4, color: '#f59e0b' },
  { name: 'On Hold', value: 2, color: '#ef4444' },
];

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$128,430" icon={DollarSign} color="bg-green-500" />
        <StatCard title="Active Projects" value="12" icon={CheckCircle} color="bg-blue-500" />
        <StatCard title="Total Employees" value="48" icon={Users} color="bg-indigo-500" />
        <StatCard title="Growth Rate" value="+24.5%" icon={TrendingUp} color="bg-purple-500" />
      </div>

      {/* Row 1: Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-800">Revenue Overview</h3>
             <select className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 text-slate-600 focus:outline-none cursor-pointer hover:bg-slate-100">
                <option>Last 6 Months</option>
                <option>Last Year</option>
             </select>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={financialData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `$${value}`} />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Financials vs Expenses</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} tickFormatter={(value) => `$${value}`} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend iconType="circle" wrapperStyle={{paddingTop: '10px'}} />
              <Bar dataKey="revenue" name="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Operational Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Department Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[380px]">
             <h3 className="text-lg font-bold text-slate-800 mb-2">Employee Distribution</h3>
             <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                 </PieChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Project Status */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[380px]">
             <h3 className="text-lg font-bold text-slate-800 mb-2">Project Status</h3>
             <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return percent > 0.05 ? (
                          <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={10} fontWeight="bold">
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        ) : null;
                      }}
                      labelLine={false}
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                 </PieChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Customer Acquisition Trend */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-[380px]">
             <h3 className="text-lg font-bold text-slate-800 mb-2">New Customers (Weekly)</h3>
             <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={customerGrowthData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                   <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                   <Line type="monotone" dataKey="new" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 6 }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
             <div className="mt-2 text-center bg-slate-50 rounded-lg p-2 border border-slate-100">
               <p className="text-sm text-slate-500">Total this week: <span className="font-bold text-indigo-600">35</span></p>
             </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;

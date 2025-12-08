
import React, { useState } from 'react';
import { PayrollRecord } from '../types';
import { 
  DollarSign, Download, Search, Filter, Printer, CheckCircle, 
  Clock, AlertCircle, FileText, ChevronRight, ChevronDown,
  CreditCard, Calculator, Settings, X, Plus, Trash2, Calendar, Building2, Wallet,
  CheckCircle2, Minus
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock Employees Data (Source of Truth for Generator)
const EMPLOYEES = [
  { id: '1', name: 'Rahim Khan', role: 'Manager', department: 'Management', salary: 2500 },
  { id: '2', name: 'Sultana Jasmine', role: 'Developer', department: 'Engineering', salary: 1800 },
  { id: '3', name: 'Karim Ullah', role: 'Designer', department: 'Design', salary: 1600 },
  { id: '4', name: 'David Smith', role: 'HR', department: 'Human Resources', salary: 2000 },
  { id: '5', name: 'Fatima Begum', role: 'Developer', department: 'Engineering', salary: 1900 },
];

const Payroll: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  // Store all records for all months here
  const [allPayrollData, setAllPayrollData] = useState<PayrollRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Generator State
  const [generatorConfig, setGeneratorConfig] = useState({
    month: new Date().toISOString().slice(0, 7),
    includeBonus: true,
    bonusAmount: 50, // Flat bonus for demo
    deductTax: true,
    taxRate: 5 // %
  });

  // Filter data for the view
  const currentMonthRecords = allPayrollData.filter(r => r.month === selectedMonth);

  // Extract unique departments for filter dropdown
  const uniqueDepartments = Array.from(new Set(EMPLOYEES.map(e => e.department)));

  const filteredData = currentMonthRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
    const matchesDept = departmentFilter === 'All' || record.department === departmentFilter;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const handleMarkAsPaid = (id: string) => {
    setAllPayrollData(prev => prev.map(rec => 
      rec.id === id ? { ...rec, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] } : rec
    ));
  };

  const handleDeleteRecord = (id: string) => {
    if(window.confirm("Are you sure you want to remove this record?")) {
        setAllPayrollData(prev => prev.filter(rec => rec.id !== id));
    }
  };

  const handleGeneratePayroll = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if data exists
    const exists = allPayrollData.some(r => r.month === generatorConfig.month);
    if (exists) {
        if (!window.confirm(`Payroll for ${generatorConfig.month} already exists. Do you want to regenerate (this will overwrite existing data)?`)) {
            return;
        }
        // Remove old data for that month
        setAllPayrollData(prev => prev.filter(r => r.month !== generatorConfig.month));
    }

    const newRecords: PayrollRecord[] = EMPLOYEES.map(emp => {
        const bonus = generatorConfig.includeBonus ? generatorConfig.bonusAmount : 0;
        const deductions = generatorConfig.deductTax ? (emp.salary * generatorConfig.taxRate / 100) : 0;
        
        return {
            id: `${emp.id}-${generatorConfig.month}-${Date.now()}`,
            employeeId: emp.id,
            employeeName: emp.name,
            role: emp.role,
            department: emp.department,
            month: generatorConfig.month,
            basicSalary: emp.salary,
            bonus: bonus,
            deductions: deductions,
            netSalary: emp.salary + bonus - deductions,
            status: 'Pending'
        };
    });

    setAllPayrollData(prev => [...prev.filter(r => r.month !== generatorConfig.month), ...newRecords]);
    setSelectedMonth(generatorConfig.month); // Switch view to generated month
    setIsGeneratorOpen(false);
  };

  // Statistics for selected month
  const totalPayroll = currentMonthRecords.reduce((sum, r) => sum + r.netSalary, 0);
  const totalPaid = currentMonthRecords.filter(r => r.status === 'Paid').reduce((sum, r) => sum + r.netSalary, 0);
  const totalPending = currentMonthRecords.filter(r => r.status === 'Pending').reduce((sum, r) => sum + r.netSalary, 0);

  // Preview Calculations for Generator
  const previewTotalBase = EMPLOYEES.reduce((sum, e) => sum + e.salary, 0);
  const previewBonus = generatorConfig.includeBonus ? (EMPLOYEES.length * generatorConfig.bonusAmount) : 0;
  const previewTax = generatorConfig.deductTax ? (previewTotalBase * generatorConfig.taxRate / 100) : 0;
  const previewTotalNet = previewTotalBase + previewBonus - previewTax;

  // Chart Data
  const chartData = [
    { name: 'Paid', amount: totalPaid, fill: '#22c55e' },
    { name: 'Pending', amount: totalPending, fill: '#f59e0b' },
  ];

  // Helper to format month safely for display
  const getFormattedMonth = (monthStr: string) => {
    const [y, m] = monthStr.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Payroll Management</h2>
          <p className="text-slate-500">Manage monthly salaries, generate slips, and track payments.</p>
        </div>
        <div className="flex items-center gap-3">
           {/* Custom Month Picker UI */}
           <div className="relative group">
              <div className="flex items-center gap-2 bg-white border-2 border-indigo-50 px-5 py-2.5 rounded-xl shadow-sm group-hover:border-indigo-100 group-hover:shadow-md transition-all cursor-pointer">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">View Month:</span>
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 min-w-[120px]">
                    {getFormattedMonth(selectedMonth)}
                  </span>
                  <ChevronDown size={16} className="text-slate-400 group-hover:text-indigo-500 ml-2"/>
              </div>
              <input 
                 type="month" 
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                 value={selectedMonth}
                 onChange={(e) => setSelectedMonth(e.target.value)}
              />
           </div>
           
           <button 
             onClick={() => setIsGeneratorOpen(true)}
             className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
           >
              <Calculator size={18}/> Salary Generator
           </button>
        </div>
      </div>

      {/* Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                {/* Header */}
                <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-bold flex items-center gap-2"><Wallet size={24} className="text-indigo-200"/> Payroll Generator</h3>
                        <p className="text-indigo-100 text-xs mt-1 opacity-90">Calculate and generate monthly salary slips</p>
                    </div>
                    <button 
                      onClick={() => setIsGeneratorOpen(false)} 
                      className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                    >
                      <X size={20}/>
                    </button>
                </div>
                
                <form onSubmit={handleGeneratePayroll} className="p-6 space-y-6">
                    {/* Month Selection */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Period</label>
                        <div className="relative">
                           <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                           <input 
                                type="month" 
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-medium text-slate-700"
                                value={generatorConfig.month}
                                onChange={(e) => setGeneratorConfig({...generatorConfig, month: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    {/* Settings Cards - Refined */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Bonus Card */}
                        <div 
                           onClick={() => setGeneratorConfig({...generatorConfig, includeBonus: !generatorConfig.includeBonus})}
                           className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                             generatorConfig.includeBonus ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
                           }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`font-bold text-sm ${generatorConfig.includeBonus ? 'text-emerald-700' : 'text-slate-600'}`}>Performance Bonus</span>
                                {generatorConfig.includeBonus && <CheckCircle2 size={18} className="text-emerald-500" />}
                            </div>
                            
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <span className="text-slate-400 text-sm">$</span>
                                <input 
                                    type="number" 
                                    disabled={!generatorConfig.includeBonus}
                                    className="w-full bg-transparent border-b border-slate-300 py-1 text-lg font-bold text-slate-800 focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                                    value={generatorConfig.bonusAmount}
                                    onChange={(e) => setGeneratorConfig({...generatorConfig, bonusAmount: Number(e.target.value)})}
                                />
                            </div>
                        </div>

                        {/* Tax Card */}
                        <div 
                           onClick={() => setGeneratorConfig({...generatorConfig, deductTax: !generatorConfig.deductTax})}
                           className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all overflow-hidden ${
                             generatorConfig.deductTax ? 'border-red-400 bg-red-50/30' : 'border-slate-100 bg-white hover:border-slate-200'
                           }`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`font-bold text-sm ${generatorConfig.deductTax ? 'text-red-700' : 'text-slate-600'}`}>Tax Deduction</span>
                                {generatorConfig.deductTax && <CheckCircle2 size={18} className="text-red-500" />}
                            </div>
                            
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <span className="text-slate-400 text-sm">%</span>
                                <input 
                                    type="number" 
                                    disabled={!generatorConfig.deductTax}
                                    className="w-full bg-transparent border-b border-slate-300 py-1 text-lg font-bold text-slate-800 focus:outline-none focus:border-red-500 disabled:opacity-50"
                                    value={generatorConfig.taxRate}
                                    onChange={(e) => setGeneratorConfig({...generatorConfig, taxRate: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Receipt Style Summary */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-slate-200 text-slate-600 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                           Estimated Summary
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center text-slate-500">
                                <span>Total Employees</span>
                                <span className="font-mono font-medium">{EMPLOYEES.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-600">
                                <span>Gross Salary Base</span>
                                <span className="font-mono font-medium">${previewTotalBase.toLocaleString()}</span>
                            </div>
                            {generatorConfig.includeBonus && (
                                <div className="flex justify-between items-center text-emerald-600">
                                    <span className="flex items-center gap-1"><Plus size={12}/> Total Bonuses</span>
                                    <span className="font-mono font-bold">+${previewBonus.toLocaleString()}</span>
                                </div>
                            )}
                            {generatorConfig.deductTax && (
                                <div className="flex justify-between items-center text-red-500">
                                    <span className="flex items-center gap-1"><Minus size={12}/> Total Tax ({generatorConfig.taxRate}%)</span>
                                    <span className="font-mono font-bold">-${previewTax.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="h-px bg-slate-300 my-2"></div>
                            <div className="flex justify-between items-center text-lg">
                                <span className="font-bold text-slate-800">Net Payable</span>
                                <span className="font-bold text-indigo-600 font-mono">${previewTotalNet.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => setIsGeneratorOpen(false)} 
                          className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <Settings size={18} /> Generate
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {currentMonthRecords.length > 0 ? (
        <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Payroll Cost</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-1">${totalPayroll.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400 mt-1">For {getFormattedMonth(selectedMonth)}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><DollarSign size={24}/></div>
                </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Paid Amount</p>
                        <h3 className="text-3xl font-bold text-green-600 mt-1">${totalPaid.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400 mt-1">{currentMonthRecords.filter(r => r.status === 'Paid').length} Employees Paid</p>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle size={24}/></div>
                </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Amount</p>
                        <h3 className="text-3xl font-bold text-amber-500 mt-1">${totalPending.toLocaleString()}</h3>
                        <p className="text-xs text-slate-400 mt-1">{currentMonthRecords.filter(r => r.status === 'Pending').length} Employees Pending</p>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24}/></div>
                </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Table */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                        type="text"
                        placeholder="Search employee..."
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2">
                            <Building2 className="text-slate-400" size={16} />
                            <select 
                                className="pl-2 pr-4 py-2 text-sm bg-transparent focus:outline-none text-slate-600 font-medium"
                                value={departmentFilter}
                                onChange={(e) => setDepartmentFilter(e.target.value)}
                            >
                                <option value="All">All Departments</option>
                                {uniqueDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2">
                            <Filter className="text-slate-400" size={16} />
                            <select 
                                className="pl-2 pr-4 py-2 text-sm bg-transparent focus:outline-none text-slate-600 font-medium"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                            >
                                <option value="All">All Status</option>
                                <option value="Paid">Paid</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                        <tr>
                        <th className="px-6 py-4">Employee</th>
                        <th className="px-6 py-4 text-right">Basic</th>
                        <th className="px-6 py-4 text-right text-green-600">Bonus</th>
                        <th className="px-6 py-4 text-right text-red-500">Deductions</th>
                        <th className="px-6 py-4 text-right font-bold">Net Salary</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredData.map(record => (
                        <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                    {record.employeeName.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-800 text-sm">{record.employeeName}</div>
                                    <div className="text-xs text-slate-500">{record.department}</div>
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right text-sm text-slate-600">${record.basicSalary.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-sm text-green-600">+${record.bonus.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-sm text-red-500">-${record.deductions.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-sm font-bold text-slate-800">${record.netSalary.toLocaleString()}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                                record.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                {record.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                {record.status === 'Pending' && (
                                    <button 
                                        onClick={() => handleMarkAsPaid(record.id)}
                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-md"
                                        title="Mark as Paid"
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => setSelectedRecord(record)}
                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md"
                                    title="View Payslip"
                                >
                                    <FileText size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteRecord(record.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                                    title="Delete Record"
                                >
                                    <Trash2 size={18}/>
                                </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                        {filteredData.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-12 text-slate-400">No records found matching filter.</td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                </div>
                </div>

                {/* Sidebar Summary */}
                <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[300px]">
                    <h3 className="font-bold text-slate-800 mb-4">Payment Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{top: 0, right: 30, left: 20, bottom: 20}}>
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="amount" barSize={30} radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="bg-indigo-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-2">Process Payments</h3>
                        <p className="text-indigo-200 text-sm mb-4">All pending items can be processed in batch via bank integration.</p>
                        <button 
                            className="w-full py-2 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                            onClick={() => alert("Bank integration would process payments here.")}
                        >
                            Disburse Funds
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <CreditCard size={120} />
                    </div>
                </div>
                </div>
            </div>
        </>
      ) : (
          <div className="flex flex-col items-center justify-center h-[500px] bg-white rounded-xl border border-slate-200 shadow-sm text-center p-8">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
                  <Calculator size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No Payroll Data for {getFormattedMonth(selectedMonth)}</h3>
              <p className="text-slate-500 max-w-md mb-8">
                  It looks like payroll hasn't been generated for this month yet. Use the generator to create salary slips for all employees.
              </p>
              <button 
                onClick={() => setIsGeneratorOpen(true)}
                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-transform hover:-translate-y-1"
              >
                  Run Payroll Generator
              </button>
          </div>
      )}

      {/* Payslip Modal */}
      {selectedRecord && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
               {/* Modal Header */}
               <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <FileText size={18} className="text-indigo-600"/> Payslip Preview
                  </h3>
                  <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600">
                     <ChevronRight size={20} className="rotate-90"/>
                  </button>
               </div>

               {/* Payslip Content */}
               <div className="p-8 bg-white" id="payslip-content">
                  <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                     <div>
                        <h2 className="text-2xl font-bold text-slate-900">R Tech</h2>
                        <p className="text-xs text-slate-500 mt-1">123 Tech Park, Dhaka</p>
                     </div>
                     <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">Payslip #{selectedRecord.id.split('-')[0]}</p>
                        <p className="text-xs text-slate-500 mt-1">{getFormattedMonth(selectedRecord.month)}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mb-8">
                     <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Employee</p>
                        <h4 className="font-bold text-slate-800">{selectedRecord.employeeName}</h4>
                        <p className="text-xs text-slate-500">{selectedRecord.role}</p>
                        <p className="text-xs text-slate-500">{selectedRecord.department}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Payment Status</p>
                        <span className={`inline-block px-2 py-1 rounded-md text-xs font-bold ${
                           selectedRecord.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                           {selectedRecord.status}
                        </span>
                        {selectedRecord.paymentDate && (
                           <p className="text-xs text-slate-500 mt-1">Paid on: {selectedRecord.paymentDate}</p>
                        )}
                     </div>
                  </div>

                  <div className="space-y-3 mb-6">
                     <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                        <span className="text-slate-600">Basic Salary</span>
                        <span className="font-medium text-slate-800">${selectedRecord.basicSalary.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                        <span className="text-slate-600">Bonus & Allowances</span>
                        <span className="font-medium text-green-600">+${selectedRecord.bonus.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                        <span className="text-slate-600">Tax & Deductions</span>
                        <span className="font-medium text-red-500">-${selectedRecord.deductions.toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                     <span className="font-bold text-slate-700">Net Payable</span>
                     <span className="text-xl font-bold text-indigo-600">${selectedRecord.netSalary.toLocaleString()}</span>
                  </div>
               </div>

               {/* Footer Actions */}
               <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
                  <button 
                     onClick={() => setSelectedRecord(null)}
                     className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                  >
                     Close
                  </button>
                  <button 
                     className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm"
                     onClick={() => window.print()}
                  >
                     <Printer size={16}/> Print / Download
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Payroll;

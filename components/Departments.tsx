
import React, { useState } from 'react';
import { Department } from '../types';
import { 
  Search, Plus, Edit2, Trash2, Building2, Users, DollarSign, 
  MapPin, X, Briefcase, Mail, Phone, ArrowLeft, Eye, Shield, CheckCircle,
  Filter, ArrowUpDown, Upload, RefreshCw, Image as ImageIcon
} from 'lucide-react';

// Mock Data
const MOCK_DEPARTMENTS: Department[] = [
  { 
    id: '1', 
    name: 'Engineering', 
    head: 'Rahim Khan', 
    email: 'eng@rtech.com', 
    phone: '+880 1711 000111', 
    employeeCount: 24, 
    budget: 150000, 
    status: 'Active', 
    location: 'Floor 3, East Wing',
    logo: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzRmNDZlNSIgcng9IjQwIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSI4MCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVOPC90ZXh0Pjwvc3ZnPg=='
  },
  { 
    id: '2', 
    name: 'Human Resources', 
    head: 'David Smith', 
    email: 'hr@rtech.com', 
    phone: '+880 1711 000222', 
    employeeCount: 5, 
    budget: 45000, 
    status: 'Active', 
    location: 'Floor 1, West Wing' 
  },
  { 
    id: '3', 
    name: 'Marketing', 
    head: 'Alice Doe', 
    email: 'marketing@rtech.com', 
    phone: '+880 1711 000333', 
    employeeCount: 12, 
    budget: 85000, 
    status: 'Active', 
    location: 'Floor 2, Central' 
  },
  { 
    id: '4', 
    name: 'Sales', 
    head: 'Bob Johnson', 
    email: 'sales@rtech.com', 
    phone: '+880 1711 000444', 
    employeeCount: 18, 
    budget: 120000, 
    status: 'Inactive', 
    location: 'Floor 2, East Wing' 
  },
];

// Mock Employees for Detail View
const MOCK_DEPT_EMPLOYEES = [
  { id: '1', name: 'Rahim Khan', role: 'Manager', email: 'rahim@rtech.com', status: 'Active', department: 'Engineering', avatar: 'R' },
  { id: '2', name: 'Sultana Jasmine', role: 'Developer', email: 'jasmine@rtech.com', status: 'Active', department: 'Engineering', avatar: 'S' },
  { id: '5', name: 'Fatima Begum', role: 'Developer', email: 'fatima@rtech.com', status: 'Active', department: 'Engineering', avatar: 'F' },
  { id: '10', name: 'Karim Ullah', role: 'Designer', email: 'karim@rtech.com', status: 'On Leave', department: 'Design', avatar: 'K' },
  { id: '4', name: 'David Smith', role: 'HR', email: 'david@rtech.com', status: 'Active', department: 'Human Resources', avatar: 'D' },
  { id: '3', name: 'Alice Doe', role: 'Manager', email: 'alice@rtech.com', status: 'Active', department: 'Marketing', avatar: 'A' },
  { id: '6', name: 'John Doe', role: 'Designer', email: 'john.d@rtech.com', status: 'On Leave', department: 'Marketing', avatar: 'J' },
  { id: '7', name: 'Bob Johnson', role: 'Manager', email: 'bob@rtech.com', status: 'Active', department: 'Sales', avatar: 'B' },
  { id: '8', name: 'Sarah Connor', role: 'Sales Rep', email: 'sarah@rtech.com', status: 'Active', department: 'Sales', avatar: 'S' },
];

const Departments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(MOCK_DEPARTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [viewingDept, setViewingDept] = useState<Department | null>(null);

  // Filter & Sort State
  const [sortBy, setSortBy] = useState('name-asc');
  const [filterStatus, setFilterStatus] = useState('all');

  // Form State
  const [formData, setFormData] = useState<Partial<Department>>({
    name: '',
    head: '',
    email: '',
    phone: '',
    budget: 0,
    employeeCount: 0,
    status: 'Active',
    location: '',
    logo: ''
  });

  const filteredDepartments = departments
    .filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            d.head.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || d.status.toLowerCase() === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        case 'budget-high': return b.budget - a.budget;
        case 'budget-low': return a.budget - b.budget;
        default: return 0;
      }
    });

  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
  const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);

  const handleOpenModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData(dept);
    } else {
      setEditingDept(null);
      setFormData({
        name: '',
        head: '',
        email: '',
        phone: '',
        budget: 0,
        employeeCount: 0,
        status: 'Active',
        location: '',
        logo: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
      if (viewingDept?.id === id) setViewingDept(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateLogo = () => {
    if (!formData.name) return;
    const colors = ['#4f46e5', '#0ea5e9', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const initials = formData.name.substring(0, 2).toUpperCase();
    
    // Create a simple SVG data URL
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="${randomColor}" rx="40" />
        <text x="50%" y="50%" dy=".35em" fill="white" font-family="sans-serif" font-size="80" font-weight="bold" text-anchor="middle">${initials}</text>
      </svg>
    `;
    const base64 = btoa(svg);
    setFormData({ ...formData, logo: `data:image/svg+xml;base64,${base64}` });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.head) return;

    if (editingDept) {
      setDepartments(departments.map(d => 
        d.id === editingDept.id ? { ...d, ...formData } as Department : d
      ));
      // Update viewing state if currently viewing the edited dept
      if (viewingDept?.id === editingDept.id) {
        setViewingDept({ ...viewingDept, ...formData } as Department);
      }
    } else {
      const newDept: Department = {
        id: Date.now().toString(),
        name: formData.name!,
        head: formData.head!,
        email: formData.email || '',
        phone: formData.phone || '',
        budget: Number(formData.budget) || 0,
        employeeCount: Number(formData.employeeCount) || 0,
        status: (formData.status as any) || 'Active',
        location: formData.location || '',
        logo: formData.logo || ''
      };
      setDepartments([...departments, newDept]);
    }
    setIsModalOpen(false);
  };

  // --- Detailed View Component ---
  if (viewingDept) {
    const deptEmployees = MOCK_DEPT_EMPLOYEES.filter(e => e.department === viewingDept.name);
    
    return (
      <div className="space-y-6 animate-fade-in pb-10">
        <button onClick={() => setViewingDept(null)} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors group">
           <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Departments
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <Building2 size={200} />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-6">
                 {/* Logo display in header */}
                 <div className="w-24 h-24 rounded-2xl bg-white shadow-lg border-4 border-white overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {viewingDept.logo ? (
                      <img src={viewingDept.logo} alt={viewingDept.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Building2 size={32} />
                      </div>
                    )}
                 </div>

                 <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{viewingDept.name}</h1>
                    <div className="flex items-center gap-4 text-slate-500">
                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-500"/> {viewingDept.location || 'Main HQ'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        <span className={`flex items-center gap-1.5 font-medium ${viewingDept.status === 'Active' ? 'text-green-600' : 'text-slate-500'}`}>
                          {viewingDept.status === 'Active' ? <CheckCircle size={16}/> : <X size={16}/>}
                          {viewingDept.status}
                        </span>
                    </div>
                 </div>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                 <button onClick={() => handleOpenModal(viewingDept)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors font-medium">
                    <Edit2 size={16}/> Edit Details
                 </button>
                 <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-200 font-medium">
                    <Plus size={16}/> Add Member
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Left Column: Info & Stats */}
           <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Head of Department</h3>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600 border-2 border-white shadow-sm">
                       {viewingDept.head.charAt(0)}
                    </div>
                    <div>
                       <div className="font-bold text-slate-800">{viewingDept.head}</div>
                       <div className="text-xs text-slate-500">Department Manager</div>
                    </div>
                 </div>
                 <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                       <Mail size={16} className="text-slate-400"/> {viewingDept.email}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                       <Phone size={16} className="text-slate-400"/> {viewingDept.phone}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 text-xs font-bold uppercase">Budget</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-1">${viewingDept.budget.toLocaleString()}</h3>
                 </div>
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-slate-400 text-xs font-bold uppercase">Employees</p>
                    <h3 className="text-xl font-bold text-slate-800 mt-1">{viewingDept.employeeCount}</h3>
                 </div>
              </div>
           </div>

           {/* Right Column: Employee List */}
           <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Users size={18} className="text-indigo-500"/> Team Members
                 </h3>
                 <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    {deptEmployees.length} Members
                 </span>
              </div>
              <div className="flex-1 overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                       <tr>
                          <th className="px-6 py-3">Employee</th>
                          <th className="px-6 py-3">Role</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {deptEmployees.length > 0 ? (
                          deptEmployees.map(emp => (
                             <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-3">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                         {emp.avatar}
                                      </div>
                                      <span className="font-medium text-slate-800 text-sm">{emp.name}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-3">
                                   <span className="flex items-center gap-1.5 text-slate-600 text-sm">
                                      <Shield size={14} className="text-slate-400"/> {emp.role}
                                   </span>
                                </td>
                                <td className="px-6 py-3 text-sm text-slate-500">{emp.email}</td>
                                <td className="px-6 py-3 text-right">
                                   <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                      emp.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                                   }`}>
                                      {emp.status}
                                   </span>
                                </td>
                             </tr>
                          ))
                       ) : (
                          <tr>
                             <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                No employees found in this department.
                             </td>
                          </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- Main List View ---
  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 rounded-2xl text-white shadow-lg">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider">Total Departments</p>
                  <h3 className="text-3xl font-bold mt-1">{departments.length}</h3>
               </div>
               <div className="p-3 bg-white/10 rounded-xl">
                  <Building2 size={24} />
               </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Headcount</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalEmployees}</h3>
               </div>
               <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Users size={24} />
               </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Budget Alloc.</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">${totalBudget.toLocaleString()}</h3>
               </div>
               <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                  <DollarSign size={24} />
               </div>
            </div>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Departments</h2>
          <p className="text-slate-500">Manage organizational structure and resources.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all font-medium"
        >
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search departments..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm appearance-none cursor-pointer text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                   <option value="name-asc">Name (A-Z)</option>
                   <option value="name-desc">Name (Z-A)</option>
                   <option value="budget-high">Budget (High-Low)</option>
                   <option value="budget-low">Budget (Low-High)</option>
                </select>
             </div>
             <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-sm appearance-none cursor-pointer text-slate-700 font-medium hover:bg-slate-50 transition-colors"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                   <option value="all">All Status</option>
                   <option value="active">Active</option>
                   <option value="inactive">Inactive</option>
                </select>
             </div>
          </div>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Department Name</th>
                <th className="px-6 py-4">Head of Dept</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Annual Budget</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDepartments.map((dept) => (
                <tr key={dept.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 flex-shrink-0 flex items-center justify-center text-indigo-600 shadow-sm overflow-hidden border border-indigo-100">
                        {dept.logo ? (
                           <img src={dept.logo} alt={dept.name} className="w-full h-full object-cover" />
                        ) : (
                           <Building2 size={20} />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{dept.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin size={10} /> {dept.location || 'Main Office'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {dept.head.charAt(0)}
                       </div>
                       <div>
                          <div className="text-sm font-medium text-slate-700">{dept.head}</div>
                          <div className="text-xs text-slate-500">{dept.email}</div>
                          <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                             <Phone size={10} /> {dept.phone}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700">{dept.employeeCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-700">
                    ${dept.budget.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      dept.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {dept.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2 opacity-100">
                      <button 
                        onClick={() => setViewingDept(dept)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(dept)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Department"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(dept.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Department"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDepartments.length === 0 && (
            <div className="text-center py-12 text-slate-400">
               <Briefcase size={48} className="mx-auto mb-3 opacity-20" />
               <p>No departments found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100 h-[90vh] flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-indigo-800 flex justify-between items-center text-white flex-shrink-0">
               <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                     <Building2 className="text-indigo-200" size={28} /> 
                     {editingDept ? 'Edit Department' : 'New Department'}
                  </h3>
                  <p className="text-indigo-100 mt-1 text-sm opacity-90">
                     {editingDept ? 'Update department details and resources' : 'Create a new organizational unit'}
                  </p>
               </div>
               <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
               >
                  <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-6">
               
               {/* Department Logo Section */}
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Identity & Logo</h4>
                  <div className="flex items-start gap-6">
                     <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden relative group">
                        {formData.logo ? (
                           <img src={formData.logo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                           <ImageIcon className="text-slate-300" size={32} />
                        )}
                        {formData.logo && (
                           <button 
                              type="button" 
                              onClick={() => setFormData({...formData, logo: ''})}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                              <X size={12} />
                           </button>
                        )}
                     </div>
                     <div className="flex-1 space-y-3">
                        <label className="block text-sm font-semibold text-slate-700">Upload or Generate Logo</label>
                        <div className="flex gap-3">
                           <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                              <Upload size={16} />
                              Upload Image
                              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                           </label>
                           <button 
                              type="button"
                              onClick={handleGenerateLogo}
                              disabled={!formData.name}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              <RefreshCw size={16} />
                              Generate Logo
                           </button>
                        </div>
                        <p className="text-xs text-slate-500">
                           {!formData.name ? "Enter department name to generate a logo." : "Upload a PNG/JPG or generate a styled SVG."}
                        </p>
                     </div>
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Department Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700">Department Name <span className="text-red-500">*</span></label>
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. Research & Development"
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700">Location</label>
                        <input 
                           type="text" 
                           placeholder="e.g. Floor 4, North Wing"
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                           value={formData.location}
                           onChange={e => setFormData({...formData, location: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Leadership & Contact</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700">Head of Department <span className="text-red-500">*</span></label>
                        <input 
                           required
                           type="text" 
                           placeholder="Full Name"
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                           value={formData.head}
                           onChange={e => setFormData({...formData, head: e.target.value})}
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700">Official Email</label>
                        <input 
                           type="email" 
                           placeholder="dept@rtech.com"
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                           value={formData.email}
                           onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                        <input 
                           type="tel" 
                           placeholder="+1 234 567 890"
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                           value={formData.phone}
                           onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Resources</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700">Annual Budget</label>
                        <div className="relative">
                           <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                           <input 
                              type="number" 
                              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                              value={formData.budget}
                              onChange={e => setFormData({...formData, budget: Number(e.target.value)})}
                           />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700">Employee Count</label>
                        <div className="relative">
                           <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                           <input 
                              type="number" 
                              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                              value={formData.employeeCount}
                              onChange={e => setFormData({...formData, employeeCount: Number(e.target.value)})}
                           />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700">Status</label>
                        <select 
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                           value={formData.status}
                           onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                           <option value="Active">Active</option>
                           <option value="Inactive">Inactive</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                  <button 
                     type="button"
                     onClick={() => setIsModalOpen(false)}
                     className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                     type="submit"
                     className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                  >
                     {editingDept ? 'Update Department' : 'Create Department'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Departments;

import React, { useState } from 'react';
import { Customer, CustomerProject, CustomerPayment, CustomerActivity } from '../types';
import { 
  Search, Plus, Eye, Edit2, Trash2, Phone, Mail, MapPin, 
  Calendar, CreditCard, Briefcase, CheckCircle, Clock, 
  ArrowLeft, MoreVertical, FileText, Activity, DollarSign, X,
  Building2, User
} from 'lucide-react';

// --- Mock Data ---
const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: '1', 
    name: "John Doe", 
    company: "Alpha Corp", 
    email: "john@alpha.com",
    phone: "+1 555-0101",
    status: "Active", 
    revenue: 15000,
    currentProject: "E-commerce Platform Redesign",
    address: "123 Innovation Dr, Tech City",
    nextMeeting: "2023-11-10T14:00:00",
    projects: [
      { id: 'p1', name: 'E-commerce Platform Redesign', status: 'In Progress', dueDate: '2023-12-01', budget: 12000 },
      { id: 'p2', name: 'Logo Design', status: 'Completed', dueDate: '2023-08-15', budget: 3000 }
    ],
    payments: [
      { id: 'inv-001', date: '2023-10-01', amount: 5000, invoiceId: '#INV-2023-001', status: 'Paid' },
      { id: 'inv-002', date: '2023-11-01', amount: 5000, invoiceId: '#INV-2023-005', status: 'Pending' }
    ],
    activities: [
      { id: 'a1', type: 'Meeting', description: 'Weekly sync with design team', date: '2023-10-25' },
      { id: 'a2', type: 'Email', description: 'Sent project proposal v2', date: '2023-10-20' }
    ]
  },
  { 
    id: '2', 
    name: "Jane Smith", 
    company: "Beta Ltd", 
    email: "jane@beta.com",
    phone: "+1 555-0202",
    status: "Lead", 
    revenue: 0,
    currentProject: "Discovery Phase",
    address: "456 Corporate Blvd, Metropolis",
    nextMeeting: "2023-10-30T10:00:00",
    projects: [],
    payments: [],
    activities: [
      { id: 'a3', type: 'Call', description: 'Introductory discovery call', date: '2023-10-24' }
    ]
  },
  { 
    id: '3', 
    name: "Mike Ross", 
    company: "Pearson Hardman", 
    email: "mike@ph.com",
    phone: "+1 555-0303",
    status: "Active", 
    revenue: 50000,
    currentProject: "Legal Case Management System",
    address: "789 Law Ave, New York",
    nextMeeting: "2023-11-05T09:00:00",
    projects: [
      { id: 'p3', name: 'Legal Case Management System', status: 'In Progress', dueDate: '2024-03-01', budget: 50000 }
    ],
    payments: [
      { id: 'inv-003', date: '2023-09-15', amount: 10000, invoiceId: '#INV-2023-010', status: 'Paid' },
      { id: 'inv-004', date: '2023-10-15', amount: 10000, invoiceId: '#INV-2023-015', status: 'Paid' }
    ],
    activities: [
      { id: 'a4', type: 'Meeting', description: 'Stakeholder requirement gathering', date: '2023-10-10' }
    ]
  },
];

// --- Components ---

const AddCustomerModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (customer: Customer) => void 
}> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'Lead',
    currentProject: '',
    revenue: 0
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.company) return;

    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name!,
      company: formData.company!,
      email: formData.email || '',
      phone: formData.phone || '',
      status: formData.status as any,
      revenue: Number(formData.revenue) || 0,
      currentProject: formData.currentProject || 'N/A',
      address: '',
      projects: [],
      payments: [],
      activities: [{ id: Date.now().toString(), type: 'Note', description: 'Customer created manually', date: new Date().toISOString().split('T')[0] }]
    };

    onAdd(newCustomer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center text-white">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Building2 className="text-indigo-200" size={28} /> New Client Onboarding
            </h3>
            <p className="text-indigo-100 mt-1 text-sm opacity-90">Enter client details to start tracking interaction</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Company Details */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Company Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Client Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    required 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="e.g. John Doe"
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Company Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    required 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="e.g. Acme Corp"
                    value={formData.company} 
                    onChange={e => setFormData({...formData, company: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Contact Information</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="email" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="john@company.com"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Project Scope */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">Project Scope & Value</h4>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Current Project Name</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="e.g. Mobile App Development"
                    value={formData.currentProject} 
                    onChange={e => setFormData({...formData, currentProject: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Status</label>
                  <div className="relative">
                    <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <select 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                      value={formData.status} 
                      onChange={e => setFormData({...formData, status: e.target.value as any})}
                    >
                      <option value="Lead">Lead - Potential Client</option>
                      <option value="Active">Active - Ongoing Project</option>
                      <option value="Churned">Churned - Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-slate-700">Est. Annual Revenue</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="number" 
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      placeholder="0.00"
                      value={formData.revenue} 
                      onChange={e => setFormData({...formData, revenue: Number(e.target.value)})} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
          >
            Create Profile
          </button>
        </div>

      </div>
    </div>
  );
};

const CustomerDetailView: React.FC<{ customer: Customer; onBack: () => void }> = ({ customer, onBack }) => {
  // Calculate some derived stats
  const activeProjectsCount = customer.projects?.filter(p => p.status === 'In Progress').length || 0;
  const pendingInvoices = customer.payments?.filter(p => p.status === 'Pending').length || 0;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Navigation */}
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors group">
        <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to CRM
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-slate-100 to-slate-50"></div>
        <div className="relative flex flex-col md:flex-row items-end md:items-center gap-6 mt-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-white">
            {customer.name.charAt(0)}
          </div>
          <div className="flex-1 mb-2">
            <h1 className="text-3xl font-bold text-slate-800">{customer.name}</h1>
            <div className="flex items-center gap-3 text-slate-500 mt-1">
              <span className="flex items-center gap-1 font-medium"><Building2 size={16}/> {customer.company}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                 customer.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 
                 customer.status === 'Lead' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {customer.status}
              </span>
            </div>
          </div>
          <div className="flex gap-3 mb-2">
             <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
               <Mail size={18}/> Message
             </button>
             <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200">
               <Edit2 size={18}/> Edit Profile
             </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-green-50 text-green-600 rounded-lg"><DollarSign size={24}/></div>
           <div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Revenue</p>
             <h3 className="text-xl font-bold text-slate-800">${customer.revenue.toLocaleString()}</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Briefcase size={24}/></div>
           <div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Projects</p>
             <h3 className="text-xl font-bold text-slate-800">{activeProjectsCount}</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><FileText size={24}/></div>
           <div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Invoices</p>
             <h3 className="text-xl font-bold text-slate-800">{pendingInvoices}</h3>
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
           <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Clock size={24}/></div>
           <div>
             <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Next Touchpoint</p>
             <h3 className="text-sm font-bold text-slate-800 truncate">
                {customer.nextMeeting ? new Date(customer.nextMeeting).toLocaleDateString() : 'None Scheduled'}
             </h3>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left) */}
        <div className="lg:col-span-2 space-y-6">
           {/* Active Projects */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                 Active Projects
               </h3>
               <button className="text-sm text-indigo-600 font-medium hover:underline">+ New Project</button>
             </div>
             <div className="p-0">
               {(!customer.projects || customer.projects.length === 0) ? (
                 <div className="p-8 text-center text-slate-400">No projects found.</div>
               ) : (
                 <div className="divide-y divide-slate-100">
                    {customer.projects.map(p => (
                      <div key={p.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="p-2 bg-slate-100 rounded-lg text-slate-500"><Briefcase size={20}/></div>
                           <div>
                             <h4 className="font-semibold text-slate-800">{p.name}</h4>
                             <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                               <span>Due: {p.dueDate}</span>
                               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                               <span>Budget: ${p.budget.toLocaleString()}</span>
                             </div>
                           </div>
                         </div>
                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            p.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                            p.status === 'Completed' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                         }`}>
                           {p.status}
                         </span>
                      </div>
                    ))}
                 </div>
               )}
             </div>
           </div>

           {/* Invoices */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                 Billing & Invoices
               </h3>
               <button className="text-sm text-indigo-600 font-medium hover:underline">Create Invoice</button>
             </div>
             {(!customer.payments || customer.payments.length === 0) ? (
                <div className="p-8 text-center text-slate-400">No payment history.</div>
             ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Invoice ID</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customer.payments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-slate-600">{p.invoiceId}</td>
                        <td className="px-6 py-4 text-slate-500">{p.date}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">${p.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                             p.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             )}
           </div>
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-6">
           
           {/* Contact Card */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wide text-slate-500">Contact Information</h3>
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <Mail className="text-slate-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium text-slate-800 break-all">{customer.email}</p>
                      <p className="text-xs text-slate-400">Primary Email</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <Phone className="text-slate-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{customer.phone}</p>
                      <p className="text-xs text-slate-400">Mobile</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <MapPin className="text-slate-400 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{customer.address || 'No address provided'}</p>
                      <p className="text-xs text-slate-400">Billing Address</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Next Meeting */}
           <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calendar size={100} />
             </div>
             <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-2">Upcoming Meeting</p>
             {customer.nextMeeting ? (
               <>
                 <h3 className="text-2xl font-bold mb-1">{new Date(customer.nextMeeting).toLocaleDateString(undefined, {month:'long', day:'numeric'})}</h3>
                 <p className="text-indigo-100 flex items-center gap-2 mb-6">
                   <Clock size={16}/> {new Date(customer.nextMeeting).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </p>
               </>
             ) : (
                <div className="mb-6">
                  <h3 className="text-xl font-bold">No meetings</h3>
                  <p className="text-indigo-200 text-sm">Schedule one to stay in sync.</p>
                </div>
             )}
             <button className="w-full bg-white text-indigo-700 font-bold py-2.5 rounded-lg hover:bg-indigo-50 transition-colors text-sm shadow-sm">
               Schedule Meeting
             </button>
           </div>

           {/* Activity Feed */}
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
               <span>Activity Feed</span>
               <button className="text-xs text-indigo-600 hover:underline">View All</button>
             </h3>
             <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:h-full before:w-0.5 before:bg-slate-100">
                {customer.activities?.map((act) => (
                  <div key={act.id} className="relative pl-8">
                     <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${
                       act.type === 'Meeting' ? 'bg-purple-500' :
                       act.type === 'Call' ? 'bg-green-500' : 
                       act.type === 'Email' ? 'bg-blue-500' : 'bg-slate-400'
                     }`}></div>
                     <div>
                       <p className="text-sm text-slate-800 font-medium">{act.description}</p>
                       <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                         {act.type} • {act.date}
                       </p>
                     </div>
                  </div>
                ))}
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

const CRM: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers([newCustomer, ...customers]);
  };

  const handleDeleteCustomer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
      if (selectedCustomerId === id) setSelectedCustomerId(null);
    }
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  if (selectedCustomer) {
    return <CustomerDetailView customer={selectedCustomer} onBack={() => setSelectedCustomerId(null)} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Customer Relationship Management</h2>
          <p className="text-slate-500">Track leads, manage projects, and monitor revenue.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-200 transition-colors"
        >
          <Plus size={18} /> Add New Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search clients or companies..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Current Project</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Value (LTV)</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.map((c) => (
              <tr 
                key={c.id} 
                className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                onClick={() => setSelectedCustomerId(c.id)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{c.company}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                   {c.currentProject !== 'N/A' ? (
                     <div className="flex items-center gap-2">
                       <Activity size={14} className="text-indigo-400" />
                       <span className="truncate max-w-[150px]" title={c.currentProject}>{c.currentProject}</span>
                     </div>
                   ) : (
                     <span className="text-slate-400 italic">No active project</span>
                   )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                    c.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                    c.status === 'Lead' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                    'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-700 font-medium">
                  ${c.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 opacity-100 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedCustomerId(c.id); }}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Info"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteCustomer(c.id, e)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Customer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No customers found matching your search.
          </div>
        )}
      </div>

      <AddCustomerModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddCustomer} 
      />
    </div>
  );
};

export default CRM;
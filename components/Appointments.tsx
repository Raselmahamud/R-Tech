
import React, { useState, useEffect, useRef } from 'react';
import { Appointment } from '../types';
import { 
  CalendarCheck, Clock, Plus, MapPin, Video, Phone, MoreVertical, 
  Search, Bell, BellOff, Edit2, Trash2, CheckCircle2, XCircle, 
  User, AlignLeft, Calendar as CalendarIcon, Filter
} from 'lucide-react';

const MOCK_APPOINTMENTS: Appointment[] = [
  { 
    id: '1', 
    title: 'Project Kickoff', 
    clientName: 'Acme Corp', 
    contact: 'john@acme.com', 
    date: new Date().toISOString().split('T')[0], // Today
    time: '14:00', 
    duration: 60, 
    type: 'In-Person', 
    status: 'Scheduled',
    reminderEnabled: true,
    notes: 'Bring project roadmap'
  },
  { 
    id: '2', 
    title: 'Design Review', 
    clientName: 'Beta Inc', 
    contact: '+1 555-0123', 
    date: new Date().toISOString().split('T')[0], // Today
    time: '16:30', 
    duration: 45, 
    type: 'Video Call', 
    status: 'Scheduled',
    reminderEnabled: true,
    notes: 'Review Figma prototypes'
  },
  { 
    id: '3', 
    title: 'Quarterly Sync', 
    clientName: 'Gamma Ltd', 
    contact: 'sarah@gamma.com', 
    date: '2023-12-01', 
    time: '10:00', 
    duration: 90, 
    type: 'In-Person', 
    status: 'Scheduled',
    reminderEnabled: false
  }
];

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [filter, setFilter] = useState<'Upcoming' | 'Past' | 'All'>('Upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reminder Logic
  const notifiedAppointments = useRef(new Set<string>());

  useEffect(() => {
    // Request permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      if (Notification.permission !== 'granted') return;

      const now = new Date();
      
      appointments.forEach(app => {
        if (!app.reminderEnabled || app.status !== 'Scheduled') return;
        if (notifiedAppointments.current.has(app.id)) return;

        const appDate = new Date(`${app.date}T${app.time}`);
        const diffInMinutes = (appDate.getTime() - now.getTime()) / (1000 * 60);

        // Notify if within 15 minutes
        if (diffInMinutes > 0 && diffInMinutes <= 15) {
          new Notification(`Upcoming Appointment: ${app.title}`, {
            body: `With ${app.clientName} in ${Math.round(diffInMinutes)} minutes.`,
            icon: '/favicon.ico'
          });
          notifiedAppointments.current.add(app.id);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [appointments]);

  // Form State
  const [formData, setFormData] = useState<Partial<Appointment>>({
    title: '',
    clientName: '',
    contact: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: 30,
    type: 'Video Call',
    status: 'Scheduled',
    reminderEnabled: true,
    notes: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const appDate = new Date(`${app.date}T${app.time}`);
    const now = new Date();

    if (filter === 'Upcoming') return appDate >= now && app.status !== 'Cancelled';
    if (filter === 'Past') return appDate < now || app.status === 'Completed';
    return true;
  }).sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const handleOpenModal = (app?: Appointment) => {
    if (app) {
      setFormData(app);
      setEditingId(app.id);
    } else {
      setFormData({
        title: '',
        clientName: '',
        contact: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 30,
        type: 'Video Call',
        status: 'Scheduled',
        reminderEnabled: true,
        notes: ''
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.clientName) return;

    if (editingId) {
      setAppointments(prev => prev.map(a => a.id === editingId ? { ...a, ...formData } as Appointment : a));
    } else {
      const newApp: Appointment = {
        id: Date.now().toString(),
        ...formData as Appointment
      };
      setAppointments([...appointments, newApp]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this appointment?')) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  const toggleReminder = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, reminderEnabled: !a.reminderEnabled } : a));
  };

  const updateStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Call': return <Video size={16} className="text-blue-500" />;
      case 'In-Person': return <MapPin size={16} className="text-red-500" />;
      case 'Phone': return <Phone size={16} className="text-green-500" />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
          <p className="text-slate-500">Schedule meetings, track client calls, and set reminders.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all font-medium"
        >
          <Plus size={18} /> Book Appointment
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
          {['Upcoming', 'Past', 'All'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Search client or title..." 
             className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      {/* Appointment List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           {filteredAppointments.length === 0 ? (
             <div className="bg-white rounded-xl p-12 text-center border border-dashed border-slate-300">
                <CalendarCheck className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-medium text-slate-600">No appointments found</h3>
                <p className="text-slate-400 text-sm">Adjust your filters or book a new one.</p>
             </div>
           ) : (
             filteredAppointments.map(app => (
               <div key={app.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-5 group">
                  {/* Time Column */}
                  <div className="sm:w-32 flex-shrink-0 flex flex-col items-center justify-center bg-indigo-50 rounded-lg p-3 text-indigo-700 border border-indigo-100">
                     <span className="text-xs font-bold uppercase tracking-wider">{new Date(app.date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                     <span className="text-2xl font-bold">{new Date(app.date).getDate()}</span>
                     <span className="text-sm font-medium">{app.time}</span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start">
                        <h3 className={`text-lg font-bold text-slate-800 truncate ${app.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                          {app.title}
                        </h3>
                        <div className="flex items-center gap-2">
                           {app.status === 'Scheduled' && (
                             <button 
                               onClick={() => toggleReminder(app.id)}
                               className={`p-1.5 rounded-full transition-colors ${app.reminderEnabled ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-300 hover:text-slate-500'}`}
                               title={app.reminderEnabled ? 'Reminder On' : 'Reminder Off'}
                             >
                               {app.reminderEnabled ? <Bell size={18} className="fill-current"/> : <BellOff size={18}/>}
                             </button>
                           )}
                           
                           {/* Actions Menu (Simple) */}
                           <div className="flex items-center gap-1">
                              <button onClick={() => handleOpenModal(app)} className="p-1.5 text-slate-400 hover:text-indigo-600 rounded">
                                <Edit2 size={16}/>
                              </button>
                              <button onClick={() => handleDelete(app.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded">
                                <Trash2 size={16}/>
                              </button>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4 text-sm text-slate-500 mt-2 mb-3">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                           {getTypeIcon(app.type)} {app.type}
                        </span>
                        <span className="flex items-center gap-1.5">
                           <Clock size={14}/> {app.duration} min
                        </span>
                     </div>

                     <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                              {app.clientName.charAt(0)}
                           </div>
                           <span className="text-sm font-medium text-slate-700">{app.clientName}</span>
                        </div>
                        
                        <div className="flex gap-2">
                           {app.status === 'Scheduled' && (
                              <>
                                <button onClick={() => updateStatus(app.id, 'Completed')} className="text-xs font-semibold text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                                  <CheckCircle2 size={14}/> Complete
                                </button>
                                <button onClick={() => updateStatus(app.id, 'Cancelled')} className="text-xs font-semibold text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1">
                                  <XCircle size={14}/> Cancel
                                </button>
                              </>
                           )}
                           {app.status !== 'Scheduled' && (
                              <span className={`text-xs font-bold px-2 py-1 rounded ${
                                app.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {app.status}
                              </span>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <CalendarCheck size={100} />
              </div>
              <h3 className="text-2xl font-bold mb-1">{appointments.filter(a => a.status === 'Scheduled').length}</h3>
              <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-6">Upcoming Meetings</p>
              
              <div className="space-y-3">
                 <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <span className="text-sm flex items-center gap-2"><Video size={16}/> Virtual</span>
                    <span className="font-bold">{appointments.filter(a => a.status === 'Scheduled' && a.type === 'Video Call').length}</span>
                 </div>
                 <div className="flex items-center justify-between bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                    <span className="text-sm flex items-center gap-2"><MapPin size={16}/> In-Person</span>
                    <span className="font-bold">{appointments.filter(a => a.status === 'Scheduled' && a.type === 'In-Person').length}</span>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Bell size={18} className="text-indigo-500"/> Notification Status
              </h3>
              <div className="text-sm text-slate-600">
                 {Notification.permission === 'granted' ? (
                   <p className="flex items-center gap-2 text-green-600 font-medium">
                     <CheckCircle2 size={16}/> Reminders active
                   </p>
                 ) : (
                   <div className="space-y-2">
                     <p className="flex items-center gap-2 text-amber-600 font-medium">
                       <XCircle size={16}/> Notifications blocked
                     </p>
                     <button 
                       onClick={() => Notification.requestPermission()}
                       className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                     >
                       Enable Permissions
                     </button>
                   </div>
                 )}
                 <p className="mt-2 text-xs text-slate-400">
                    You will receive browser notifications 15 minutes before scheduled appointments.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-slate-800">
                    {editingId ? 'Edit Appointment' : 'New Appointment'}
                 </h3>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <XCircle size={24} />
                 </button>
              </div>
              
              <form onSubmit={handleSave} className="p-6 space-y-4">
                 <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Title / Purpose</label>
                    <input 
                      autoFocus
                      required
                      type="text" 
                      placeholder="e.g. Initial Consultation" 
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-sm font-semibold text-slate-700">Client Name</label>
                       <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            required
                            type="text" 
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={formData.clientName}
                            onChange={e => setFormData({...formData, clientName: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-sm font-semibold text-slate-700">Contact Info</label>
                       <input 
                          type="text" 
                          placeholder="Email or Phone"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          value={formData.contact}
                          onChange={e => setFormData({...formData, contact: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-sm font-semibold text-slate-700">Date</label>
                       <div className="relative">
                          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            required
                            type="date" 
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                          />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-sm font-semibold text-slate-700">Time</label>
                       <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            required
                            type="time" 
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={formData.time}
                            onChange={e => setFormData({...formData, time: e.target.value})}
                          />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-sm font-semibold text-slate-700">Type</label>
                       <select 
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value as any})}
                       >
                          <option value="Video Call">Video Call</option>
                          <option value="In-Person">In-Person</option>
                          <option value="Phone">Phone</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-sm font-semibold text-slate-700">Duration (min)</label>
                       <input 
                          type="number" 
                          step="15"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          value={formData.duration}
                          onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                       />
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700">Notes</label>
                    <div className="relative">
                       <AlignLeft className="absolute left-3 top-3 text-slate-400" size={16} />
                       <textarea 
                         rows={3}
                         className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                         value={formData.notes}
                         onChange={e => setFormData({...formData, notes: e.target.value})}
                         placeholder="Add agenda or details..."
                       />
                    </div>
                 </div>

                 <div className="flex items-center gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="reminder"
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                      checked={formData.reminderEnabled}
                      onChange={e => setFormData({...formData, reminderEnabled: e.target.checked})}
                    />
                    <label htmlFor="reminder" className="text-sm text-slate-600">Enable 15-minute reminder</label>
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                    <button 
                       type="button" 
                       onClick={() => setIsModalOpen(false)}
                       className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
                    >
                       Cancel
                    </button>
                    <button 
                       type="submit"
                       className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                       {editingId ? 'Update' : 'Schedule'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;

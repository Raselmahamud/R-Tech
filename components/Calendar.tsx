
import React, { useState, useEffect, useRef } from 'react';
import { CalendarEventType, CalendarEvent } from '../types';
import { 
  ChevronLeft, ChevronRight, Plus, X, Clock, 
  CheckSquare, Video, StickyNote, Bell, Calendar as CalendarIcon,
  Trash2, CheckCircle2, Circle, MapPin, AlignLeft, User
} from 'lucide-react';

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Team Standup', date: '2023-11-04', type: 'Meeting', time: '10:00', description: 'Daily sync with engineering team.', attendees: 'Dev Team' },
  { id: '2', title: 'Submit Report', date: '2023-11-04', type: 'Task', isCompleted: false, description: 'Monthly financial report.' },
  { id: '3', title: 'Client Call: Acme', date: '2023-11-12', type: 'Meeting', time: '14:00', description: 'Discuss Q4 roadmap.', attendees: 'John Doe, Alice' },
  { id: '4', title: 'Dentist Appointment', date: '2023-11-15', type: 'Reminder', time: '16:30' },
  { id: '5', title: 'Design Idea', date: '2023-11-08', type: 'Note', description: 'Use neubrutalism for the new campaign landing page.' },
];

const EventTypeIcon = ({ type, size = 16 }: { type: CalendarEventType; size?: number }) => {
  switch (type) {
    case 'Task': return <CheckSquare size={size} className="text-blue-500" />;
    case 'Meeting': return <Video size={size} className="text-purple-500" />;
    case 'Note': return <StickyNote size={size} className="text-yellow-500" />;
    case 'Reminder': return <Bell size={size} className="text-orange-500" />;
    default: return <CalendarIcon size={size} />;
  }
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 10, 1)); // Nov 2023
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // YYYY-MM-DD
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Notification State
  const notifiedEvents = useRef(new Set<string>());

  // Request Notification Permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Check for upcoming events
  useEffect(() => {
    const checkNotifications = () => {
      // Check permission
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      // Format current time as HH:MM (24-hour format)
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      events.forEach(event => {
        // Condition: Same Date + Same Time + Not yet notified
        if (
          event.date === dateStr && 
          event.time === timeStr && 
          !notifiedEvents.current.has(event.id)
        ) {
          // Trigger Notification
          new Notification(`Reminder: ${event.title}`, {
             body: `${event.type} is starting now.\n${event.description || ''}`,
             icon: '/favicon.ico' // Uses default or site favicon
          });

          // Mark as notified to prevent duplicate alerts
          notifiedEvents.current.add(event.id);
        }
      });
    };

    // Check every 20 seconds
    const intervalId = setInterval(checkNotifications, 20000);
    
    return () => clearInterval(intervalId);
  }, [events]);
  
  // Form State
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'Meeting',
    title: '',
    time: '',
    description: '',
    attendees: ''
  });

  // Calendar Grid Generation Logic
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayIndex = firstDay.getDay(); // 0 = Sun
    
    const days = [];
    
    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayIndex - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const m = month === 0 ? 11 : month - 1;
      const y = month === 0 ? year - 1 : year;
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ day: d, dateString: dateStr, isCurrentMonth: false });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, dateString: dateStr, isCurrentMonth: true });
    }
    
    // Next month padding (to fill 42 cells - 6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const m = month === 11 ? 0 : month + 1;
      const y = month === 11 ? year + 1 : year;
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, dateString: dateStr, isCurrentMonth: false });
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const openDayModal = (dateStr: string) => {
    setSelectedDate(dateStr);
    setNewEvent({ type: 'Meeting', title: '', time: '', description: '', attendees: '' });
    setIsModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !selectedDate) return;
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEvent.title || 'Untitled',
      type: newEvent.type as CalendarEventType,
      time: newEvent.time,
      description: newEvent.description,
      attendees: newEvent.attendees,
      isCompleted: false
    };

    setEvents([...events, event]);
    // Don't close modal, just clear form to allow adding another
    setNewEvent({ type: 'Meeting', title: '', time: '', description: '', attendees: '' });
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setEvents(events.map(e => e.id === id ? { ...e, isCompleted: !e.isCompleted } : e));
  };

  const getEventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr);

  return (
    <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-slate-500 text-sm">Manage your schedule, tasks, and notes.</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-md text-slate-600"><ChevronLeft size={20}/></button>
          <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-medium hover:bg-slate-100 rounded-md text-slate-600">Today</button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-md text-slate-600"><ChevronRight size={20}/></button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Days */}
        <div className="flex-1 grid grid-cols-7 grid-rows-6">
          {days.map((d, i) => {
            const dayEvents = getEventsForDate(d.dateString);
            const isToday = new Date().toISOString().split('T')[0] === d.dateString;
            
            return (
              <div 
                key={i} 
                onClick={() => openDayModal(d.dateString)}
                className={`border-b border-r border-slate-100 p-2 relative transition-colors cursor-pointer group hover:bg-indigo-50/30 ${!d.isCurrentMonth ? 'bg-slate-50/50' : ''}`}
              >
                <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday ? 'bg-indigo-600 text-white' : 
                  !d.isCurrentMonth ? 'text-slate-400' : 'text-slate-700'
                }`}>
                  {d.day}
                </span>

                {/* Event Indicators */}
                <div className="mt-1 space-y-1 overflow-hidden max-h-[80px]">
                  {dayEvents.slice(0, 3).map(ev => (
                    <div key={ev.id} className={`text-[10px] px-1.5 py-0.5 rounded border truncate flex items-center gap-1 ${
                      ev.type === 'Meeting' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      ev.type === 'Task' ? (ev.isCompleted ? 'bg-slate-100 text-slate-400 line-through' : 'bg-blue-50 text-blue-700 border-blue-100') :
                      ev.type === 'Reminder' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                      'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        ev.type === 'Meeting' ? 'bg-purple-500' :
                        ev.type === 'Task' ? 'bg-blue-500' :
                        ev.type === 'Reminder' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}></div>
                      {ev.time && <span className="opacity-75">{ev.time}</span>}
                      <span>{ev.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-slate-400 pl-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>

                {/* Add Button on Hover */}
                <button className="absolute bottom-2 right-2 p-1 bg-indigo-100 text-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Detail & Add Event Modal */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[650px] flex overflow-hidden ring-1 ring-slate-900/5">
            
            {/* Left: Event List */}
            <div className="w-2/5 bg-slate-50/50 border-r border-slate-200 flex flex-col">
              <div className="p-6 border-b border-slate-200 bg-white/50 backdrop-blur flex justify-between items-center">
                <div>
                   <h3 className="text-lg font-bold text-slate-800">
                     {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                   </h3>
                   <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mt-1">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                </div>
                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                    {getEventsForDate(selectedDate).length} Events
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {getEventsForDate(selectedDate).length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <CalendarIcon size={48} className="mb-4 opacity-20" />
                      <p>No events for this day.</p>
                      <p className="text-sm">Create one using the form.</p>
                   </div>
                ) : (
                  getEventsForDate(selectedDate).map(ev => (
                    <div key={ev.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group hover:shadow-md transition-shadow relative">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <EventTypeIcon type={ev.type} />
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                             ev.type === 'Meeting' ? 'bg-purple-100 text-purple-700' :
                             ev.type === 'Task' ? 'bg-blue-100 text-blue-700' :
                             ev.type === 'Reminder' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>{ev.type}</span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 bg-white pl-2">
                          {ev.type === 'Task' && (
                             <button onClick={() => toggleTaskCompletion(ev.id)} className={`p-1.5 rounded-md transition-colors ${ev.isCompleted ? 'text-green-600 bg-green-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'}`}>
                               {ev.isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                             </button>
                          )}
                          <button onClick={() => handleDeleteEvent(ev.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <h4 className={`font-bold text-slate-800 ${ev.isCompleted ? 'line-through text-slate-400' : ''}`}>{ev.title}</h4>
                      {ev.time && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
                          <Clock size={14} /> {ev.time}
                        </div>
                      )}
                      {ev.description && <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg">{ev.description}</p>}
                      {ev.attendees && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                           <div className="text-xs text-slate-500 font-medium">Attendees:</div>
                           <div className="text-xs text-slate-700 truncate">{ev.attendees}</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Right: Add Form - Modern Redesign */}
            <div className="w-3/5 flex flex-col bg-white relative">
               {/* Header */}
               <div className="px-8 py-6 flex justify-between items-start border-b border-slate-50">
                 <div>
                    <h3 className="text-2xl font-bold text-slate-800">Add New Event</h3>
                    <p className="text-slate-500 text-sm mt-1">Create a task, meeting or reminder for <span className="font-medium text-slate-700">{new Date(selectedDate).toLocaleDateString()}</span>.</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors">
                   <X size={24} />
                 </button>
               </div>
               
               <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar">
                 <div className="space-y-6">
                    {/* Event Type Grid */}
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Event Type</label>
                      <div className="grid grid-cols-4 gap-3">
                        {['Meeting', 'Task', 'Note', 'Reminder'].map(type => (
                          <button
                            key={type}
                            onClick={() => setNewEvent({...newEvent, type: type as CalendarEventType})}
                            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
                              newEvent.type === type 
                                ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm ring-1 ring-indigo-600 scale-[1.02]' 
                                : 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`p-2 rounded-full transition-colors ${
                                newEvent.type === type ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:bg-white'
                            }`}>
                                <EventTypeIcon type={type as CalendarEventType} size={18} />
                            </div>
                            <span className="text-xs font-semibold">{type}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-5">
                       {/* Title Input */}
                       <div className="space-y-1.5">
                         <label className="block text-sm font-semibold text-slate-700">Title <span className="text-red-500">*</span></label>
                         <input 
                           autoFocus
                           type="text" 
                           placeholder={newEvent.type === 'Note' ? 'e.g. Brainstorming ideas' : 'e.g. Q4 Strategy Review'}
                           className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-800"
                           value={newEvent.title}
                           onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                         />
                       </div>

                       {/* Time & Attendees Row */}
                       {(newEvent.type === 'Meeting' || newEvent.type === 'Reminder') && (
                        <div className="grid grid-cols-2 gap-5">
                             <div className="space-y-1.5">
                               <label className="block text-sm font-semibold text-slate-700">Time</label>
                               <div className="relative">
                                 <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                                 <input 
                                   type="time" 
                                   className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium"
                                   value={newEvent.time}
                                   onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                                 />
                               </div>
                             </div>
                             
                             {newEvent.type === 'Meeting' && (
                                 <div className="space-y-1.5">
                                   <label className="block text-sm font-semibold text-slate-700">Participants</label>
                                   <div className="relative">
                                     <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                                     <input 
                                       type="text" 
                                       placeholder="Add people..."
                                       className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                       value={newEvent.attendees}
                                       onChange={(e) => setNewEvent({...newEvent, attendees: e.target.value})}
                                     />
                                   </div>
                                 </div>
                             )}
                        </div>
                       )}

                       {/* Description */}
                       <div className="space-y-1.5">
                         <label className="block text-sm font-semibold text-slate-700">Description / Agenda</label>
                         <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 text-slate-400" size={16}/>
                            <textarea 
                              rows={5}
                              placeholder="Add details, links, or notes..."
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-slate-700"
                              value={newEvent.description}
                              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                            />
                         </div>
                       </div>
                    </div>
                 </div>
               </div>
               
               <div className="px-8 py-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
                 <button 
                   onClick={() => setIsModalOpen(false)} 
                   className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={handleSaveEvent}
                   disabled={!newEvent.title}
                   className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform active:scale-95"
                 >
                   <Plus size={18} />
                   Add {newEvent.type}
                 </button>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

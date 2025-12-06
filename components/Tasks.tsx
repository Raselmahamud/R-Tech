import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { 
  Plus, MoreHorizontal, Clock, AlertCircle, X, ChevronDown, Trash2, 
  CheckCircle2, ArrowRight, ArrowLeft, LayoutList, Type, Flag, User, Calendar,
  AlertTriangle
} from 'lucide-react';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Design Homepage UI', assigneeId: '3', status: TaskStatus.IN_PROGRESS, priority: 'High', dueDate: '2023-11-01' },
  { id: '2', title: 'Setup Database Schema', assigneeId: '2', status: TaskStatus.DONE, priority: 'High', dueDate: '2023-10-25' },
  { id: '3', title: 'Write API Documentation', assigneeId: '2', status: TaskStatus.TODO, priority: 'Medium', dueDate: '2023-11-05' },
  { id: '4', title: 'Client Meeting Preparation', assigneeId: '1', status: TaskStatus.TODO, priority: 'Low', dueDate: '2023-11-02' },
  { id: '5', title: 'Fix Login Bug', assigneeId: '5', status: TaskStatus.REVIEW, priority: 'High', dueDate: '2023-10-30' },
];

const TaskCard: React.FC<{ 
  task: Task; 
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}> = ({ task, onStatusChange, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  const priorityColor = {
    'High': 'bg-red-100 text-red-700',
    'Medium': 'bg-orange-100 text-orange-700',
    'Low': 'bg-blue-100 text-blue-700'
  }[task.priority];

  // Helper to determine due date status
  const getDueDateStatus = (dateStr: string) => {
    if (task.status === TaskStatus.DONE) return 'completed';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Difference in days

    if (diffDays < 0) return 'overdue';
    if (diffDays >= 0 && diffDays <= 2) return 'soon'; // Due today, tomorrow, or day after
    return 'normal';
  };

  const dateStatus = getDueDateStatus(task.dueDate);

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all relative group animate-fade-in ${
      dateStatus === 'overdue' ? 'border-red-200 bg-red-50/10' : 
      dateStatus === 'soon' ? 'border-orange-200 bg-orange-50/10' : 'border-slate-200'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColor}`}>
          {task.priority}
        </span>
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
              <div className="absolute right-0 top-6 z-20 bg-white shadow-xl border border-slate-200 rounded-lg p-1 w-48 min-w-max animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">Move to</div>
                {Object.values(TaskStatus).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      onStatusChange(task.id, status);
                      setShowMenu(false);
                    }}
                    disabled={task.status === status}
                    className={`w-full text-left text-xs px-2 py-2 rounded flex items-center justify-between ${
                      task.status === status 
                        ? 'bg-indigo-50 text-indigo-600 font-medium' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                    {task.status === status && <CheckCircle2 size={12} />}
                  </button>
                ))}
                <div className="h-px bg-slate-100 my-1"></div>
                <button 
                  onClick={() => { onDelete(task.id); setShowMenu(false); }}
                  className="w-full text-left text-xs px-2 py-2 rounded text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 size={12} /> Delete Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      
      <h4 className="font-medium text-slate-800 mb-2 leading-tight">{task.title}</h4>
      
      <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-50/50">
        <div className={`flex items-center gap-1.5 ${
          dateStatus === 'overdue' ? 'text-red-600 font-semibold' :
          dateStatus === 'soon' ? 'text-orange-600 font-semibold' : ''
        }`}>
          {dateStatus === 'overdue' ? <AlertCircle size={14} /> :
           dateStatus === 'soon' ? <AlertTriangle size={14} /> : 
           <Calendar size={14} />}
          
          <span>
            {task.dueDate}
            {dateStatus === 'overdue' && ' (Overdue)'}
            {dateStatus === 'soon' && ' (Due Soon)'}
          </span>
        </div>
        <div className="flex -space-x-2">
           <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-600" title={`Assignee ID: ${task.assigneeId}`}>
              {task.assigneeId}
           </div>
        </div>
      </div>
    </div>
  );
};

const TaskColumn: React.FC<{ 
  title: string; 
  tasks: Task[]; 
  status: TaskStatus;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onAddTask: (status: TaskStatus) => void;
}> = ({ title, tasks, status, onStatusChange, onDelete, onAddTask }) => {
  const columnTasks = tasks.filter(t => t.status === status);
  
  return (
    <div className="flex-1 min-w-[280px] bg-slate-100/80 rounded-xl flex flex-col h-full border border-slate-200/50">
      <div className="p-3 flex justify-between items-center border-b border-slate-200/50">
        <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
          {title} 
          <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">{columnTasks.length}</span>
        </h3>
        <button 
          onClick={() => onAddTask(status)}
          className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>
      <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3 pb-20">
        {columnTasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        ))}
        {columnTasks.length === 0 && (
          <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm flex flex-col items-center">
             <AlertCircle className="mb-2 opacity-50" size={24}/>
             <p>No tasks in {title}</p>
             <button onClick={() => onAddTask(status)} className="text-indigo-500 font-medium mt-2 text-xs hover:underline">
               + Create one
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Modern Modal for Adding Tasks
const AddTaskModal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  initialStatus 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (task: Omit<Task, 'id'>) => void;
  initialStatus: TaskStatus;
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'Low'|'Medium'|'High'>('Medium');
  const [assigneeId, setAssigneeId] = useState('1');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onAdd({
      title,
      priority,
      status: initialStatus,
      assigneeId,
      dueDate: dueDate || new Date().toISOString().split('T')[0]
    });
    onClose();
    setTitle('');
    setPriority('Medium');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-blue-600 flex justify-between items-center text-white">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <LayoutList className="text-indigo-200" size={28} /> Create New Task
            </h3>
            <p className="text-indigo-100 mt-1 text-sm opacity-90">Assign responsibilities and set deadlines</p>
          </div>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Task Title <span className="text-red-500">*</span></label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input 
                autoFocus
                type="text" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="e.g. Redesign Homepage Hero Section"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
             {/* Priority */}
             <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Priority Level</label>
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <select 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                </div>
             </div>

             {/* Assignee */}
             <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700">Assignee ID</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    placeholder="ID"
                  />
                </div>
             </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">Due Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">Task will be created in <span className="font-semibold text-indigo-600">{initialStatus}</span> column.</p>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-8 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<TaskStatus>(TaskStatus.TODO);

  const handleStatusChange = (id: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: (Math.max(...tasks.map(t => parseInt(t.id) || 0), 0) + 1).toString()
    };
    setTasks([...tasks, task]);
  };

  const openAddModal = (status: TaskStatus = TaskStatus.TODO) => {
    setModalDefaultStatus(status);
    setIsModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Task Tracker</h2>
          <p className="text-slate-500">Manage project deliverables and track progress.</p>
        </div>
        <button 
          onClick={() => openAddModal(TaskStatus.TODO)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={18} /> New Task
        </button>
      </div>
      
      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start h-full">
        <TaskColumn 
          title="To Do" 
          status={TaskStatus.TODO} 
          tasks={tasks} 
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onAddTask={openAddModal}
        />
        <TaskColumn 
          title="In Progress" 
          status={TaskStatus.IN_PROGRESS} 
          tasks={tasks} 
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onAddTask={openAddModal}
        />
        <TaskColumn 
          title="In Review" 
          status={TaskStatus.REVIEW} 
          tasks={tasks} 
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onAddTask={openAddModal}
        />
        <TaskColumn 
          title="Done" 
          status={TaskStatus.DONE} 
          tasks={tasks} 
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onAddTask={openAddModal}
        />
      </div>

      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTask}
        initialStatus={modalDefaultStatus}
      />
    </div>
  );
};

export default Tasks;
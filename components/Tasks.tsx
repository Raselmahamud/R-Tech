import React from 'react';
import { Task, TaskStatus } from '../types';
import { Plus, MoreHorizontal, Clock, AlertCircle } from 'lucide-react';

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Design Homepage UI', assigneeId: '3', status: TaskStatus.IN_PROGRESS, priority: 'High', dueDate: '2023-11-01' },
  { id: '2', title: 'Setup Database Schema', assigneeId: '2', status: TaskStatus.DONE, priority: 'High', dueDate: '2023-10-25' },
  { id: '3', title: 'Write API Documentation', assigneeId: '2', status: TaskStatus.TODO, priority: 'Medium', dueDate: '2023-11-05' },
  { id: '4', title: 'Client Meeting Preparation', assigneeId: '1', status: TaskStatus.TODO, priority: 'Low', dueDate: '2023-11-02' },
  { id: '5', title: 'Fix Login Bug', assigneeId: '5', status: TaskStatus.REVIEW, priority: 'High', dueDate: '2023-10-30' },
];

const TaskCard: React.FC<{ task: Task }> = ({ task }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
    <div className="flex justify-between items-start mb-2">
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
        task.priority === 'High' ? 'bg-red-100 text-red-700' :
        task.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
        'bg-blue-100 text-blue-700'
      }`}>
        {task.priority}
      </span>
      <button className="text-slate-400 hover:text-slate-600">
        <MoreHorizontal size={16} />
      </button>
    </div>
    <h4 className="font-medium text-slate-800 mb-2">{task.title}</h4>
    <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
      <div className="flex items-center gap-1">
        <Clock size={14} />
        {task.dueDate}
      </div>
      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
        {task.assigneeId}
      </div>
    </div>
  </div>
);

const TaskColumn: React.FC<{ title: string; tasks: Task[]; status: TaskStatus }> = ({ title, tasks, status }) => {
  const columnTasks = tasks.filter(t => t.status === status);
  
  return (
    <div className="flex-1 min-w-[280px] bg-slate-100 rounded-xl p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          {title} 
          <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{columnTasks.length}</span>
        </h3>
        <button className="text-slate-500 hover:bg-slate-200 p-1 rounded">
          <Plus size={16} />
        </button>
      </div>
      <div className="flex flex-col gap-3 h-full overflow-y-auto custom-scrollbar">
        {columnTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        {columnTasks.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

const Tasks: React.FC = () => {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Task Tracker</h2>
          <p className="text-slate-500">Manage project deliverables and track progress.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={18} /> New Task
        </button>
      </div>
      
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        <TaskColumn title="To Do" status={TaskStatus.TODO} tasks={MOCK_TASKS} />
        <TaskColumn title="In Progress" status={TaskStatus.IN_PROGRESS} tasks={MOCK_TASKS} />
        <TaskColumn title="In Review" status={TaskStatus.REVIEW} tasks={MOCK_TASKS} />
        <TaskColumn title="Done" status={TaskStatus.DONE} tasks={MOCK_TASKS} />
      </div>
    </div>
  );
};

export default Tasks;
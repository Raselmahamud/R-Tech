export enum EmployeeRole {
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  DEVELOPER = 'Developer',
  DESIGNER = 'Designer',
  HR = 'HR'
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  email: string;
  phone?: string;
  joinDate?: string;
  salary: number; // Monthly salary
  status: 'Active' | 'On Leave' | 'Terminated';
  department: string;
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done'
}

export interface Task {
  id: string;
  title: string;
  assigneeId: string; // Links to Employee
  status: TaskStatus;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'Lead' | 'Active' | 'Churned';
  revenue: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
}

export type View = 'DASHBOARD' | 'EMPLOYEES' | 'TASKS' | 'CRM' | 'CALENDAR' | 'IDEAS';
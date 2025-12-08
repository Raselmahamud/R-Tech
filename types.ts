
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

// --- CRM TYPES ---
export interface CustomerProject {
  id: string;
  name: string;
  status: 'In Progress' | 'Completed' | 'On Hold';
  dueDate: string;
  budget: number;
}

export interface CustomerPayment {
  id: string;
  date: string;
  amount: number;
  invoiceId: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface CustomerActivity {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note';
  description: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Lead' | 'Active' | 'Churned';
  revenue: number; // Total Lifetime Value
  currentProject: string; // For the main table view
  
  // Detailed Data
  projects?: CustomerProject[];
  payments?: CustomerPayment[];
  activities?: CustomerActivity[];
  nextMeeting?: string; // ISO Date string
  address?: string;
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
  color?: string; // Hex code or tailwind class prefix
}

export interface Department {
  id: string;
  name: string;
  head: string;
  email: string;
  phone: string;
  employeeCount: number;
  budget: number;
  status: 'Active' | 'Inactive';
  location: string;
  logo?: string;
}

// --- PAYROLL TYPES ---
export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  department: string;
  month: string; // YYYY-MM
  basicSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Pending' | 'Processing';
  paymentDate?: string;
}

// --- APPOINTMENT TYPES ---
export interface Appointment {
  id: string;
  title: string;
  clientName: string;
  contact: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  type: 'In-Person' | 'Video Call' | 'Phone';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
  reminderEnabled: boolean;
}

export type View = 'DASHBOARD' | 'EMPLOYEES' | 'DEPARTMENTS' | 'TASKS' | 'CRM' | 'CALENDAR' | 'IDEAS' | 'ATTENDANCE' | 'PAYROLL' | 'PROFILE' | 'APPOINTMENTS';

// --- ATTENDANCE TYPES ---
export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  date: string; // YYYY-MM-DD
  checkIn: string | null; // HH:MM AM/PM
  checkOut: string | null; // HH:MM AM/PM
  status: 'Present' | 'Late' | 'Absent' | 'Half Day' | 'On Leave';
  workHours: number;
}

// --- CALENDAR TYPES ---
export type CalendarEventType = 'Task' | 'Meeting' | 'Note' | 'Reminder';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: CalendarEventType;
  time?: string;
  description?: string;
  attendees?: string;
  isCompleted?: boolean;
}

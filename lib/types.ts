export type UserRole = "hr" | "employee"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  department: string
  avatar?: string
  status: "active" | "on-leave"
  joinDate: string
}

export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  assignedBy: string
  dueDate: string
  status: "pending" | "in-progress" | "completed"
  createdAt: string
}

export interface LeaveRequest {
  id: string
  employeeId: string
  employeeName: string
  leaveType: "sick" | "vacation" | "personal" | "other"
  fromDate: string
  toDate: string
  reason: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  status: "present" | "absent" | "on-leave"
  checkIn?: string
  checkOut?: string
}

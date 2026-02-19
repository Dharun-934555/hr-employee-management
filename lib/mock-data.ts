import { User, Task, LeaveRequest, AttendanceRecord } from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@nexushr.com",
    name: "Sarah Mitchell",
    role: "hr",
    department: "Human Resources",
    status: "active",
    joinDate: "2022-01-15",
  },
]

export const mockTasks: Task[] = []

export const mockLeaveRequests: LeaveRequest[] = []

export const mockAttendance: AttendanceRecord[] = []

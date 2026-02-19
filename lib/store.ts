"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User, Task, LeaveRequest } from "./types"
import { mockUsers, mockTasks, mockLeaveRequests } from "./mock-data"

interface AuthStore {
  currentUser: User | null
  users: User[]
  tasks: Task[]
  leaveRequests: LeaveRequest[]
  isHydrated: boolean
  login: (email: string, password: string) => User | null
  signup: (email: string, password: string, name: string, role: "hr" | "employee", department: string) => User
  logout: () => void
  addTask: (task: Omit<Task, "id" | "createdAt">) => void
  updateTaskStatus: (taskId: string, status: Task["status"]) => void
  addLeaveRequest: (request: Omit<LeaveRequest, "id" | "createdAt" | "status">) => void
  updateLeaveStatus: (requestId: string, status: LeaveRequest["status"]) => void
  setHydrated: () => void
  resetStore: () => void
}

export const useStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: mockUsers,
      tasks: mockTasks,
      leaveRequests: mockLeaveRequests,
      isHydrated: false,
  
      login: (email: string, _password: string) => {
        const user = get().users.find(u => u.email.toLowerCase() === email.toLowerCase())
        if (user) {
          set({ currentUser: user })
          return user
        }
        return null
      },
  
      signup: (email: string, _password: string, name: string, role: "hr" | "employee", department: string) => {
        const newUser: User = {
          id: String(get().users.length + 1),
          email,
          name,
          role,
          department,
          status: "active",
          joinDate: new Date().toISOString().split("T")[0],
        }
        set(state => ({ users: [...state.users, newUser], currentUser: newUser }))
        return newUser
      },
  
      logout: () => {
        set({ currentUser: null })
      },
  
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: `t${get().tasks.length + 1}`,
          createdAt: new Date().toISOString().split("T")[0],
        }
        set(state => ({ tasks: [...state.tasks, newTask] }))
      },
  
      updateTaskStatus: (taskId: string, status: Task["status"]) => {
        set(state => ({
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
        }))
      },
  
      addLeaveRequest: (request) => {
        const newRequest: LeaveRequest = {
          ...request,
          id: `l${get().leaveRequests.length + 1}`,
          status: "pending",
          createdAt: new Date().toISOString().split("T")[0],
        }
        set(state => ({ leaveRequests: [...state.leaveRequests, newRequest] }))
      },
  
      updateLeaveStatus: (requestId: string, status: LeaveRequest["status"]) => {
        set(state => ({
          leaveRequests: state.leaveRequests.map(r => r.id === requestId ? { ...r, status } : r)
        }))
      },
  
      setHydrated: () => {
        set({ isHydrated: true })
      },

      resetStore: () => {
        set({
          currentUser: null,
          users: mockUsers,
          tasks: mockTasks,
          leaveRequests: mockLeaveRequests,
        })
      }
    }),
    { name: "auth-store" }
  )
)

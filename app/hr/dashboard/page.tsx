"use client"

import { useStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { mockAttendance } from "@/lib/mock-data"
import { Users, UserCheck, UserX, CalendarDays, Clock, TrendingUp } from "lucide-react"

export default function HRDashboard() {
  const { users, leaveRequests, tasks } = useStore()
  
  const employees = users.filter(u => u.role === "employee")
  const todayAttendance = mockAttendance
  const presentToday = todayAttendance.filter(a => a.status === "present").length
  const absentToday = todayAttendance.filter(a => a.status === "absent").length
  const onLeaveToday = todayAttendance.filter(a => a.status === "on-leave").length
  const pendingLeaves = leaveRequests.filter(l => l.status === "pending").length
  const pendingTasks = tasks.filter(t => t.status === "pending").length

  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      icon: <Users className="w-5 h-5" />,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Present Today",
      value: presentToday,
      icon: <UserCheck className="w-5 h-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Absent Today",
      value: absentToday + onLeaveToday,
      icon: <UserX className="w-5 h-5" />,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      title: "Pending Leaves",
      value: pendingLeaves,
      icon: <CalendarDays className="w-5 h-5" />,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const recentLeaves = leaveRequests.slice(0, 4)
  const recentEmployees = employees.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">Welcome back! Here is what is happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/50 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Employees */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Recent Employees
              </CardTitle>
              <CardDescription>Latest employees in the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">{employee.department}</p>
                      </div>
                    </div>
                    <Badge
                      variant={employee.status === "active" ? "default" : "secondary"}
                      className={
                        employee.status === "active"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-chart-3/10 text-chart-3 border-chart-3/20"
                      }
                    >
                      {employee.status === "active" ? "Active" : "On Leave"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Leave Requests */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Leave Requests
              </CardTitle>
              <CardDescription>Recent leave applications from employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeaves.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No leave requests yet</p>
                  </div>
                ) : (
                  recentLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{leave.employeeName}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {leave.leaveType} Leave
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {leave.fromDate} - {leave.toDate}
                        </p>
                      </div>
                      <Badge
                        className={
                          leave.status === "pending"
                            ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                            : leave.status === "approved"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {leave.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{pendingTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-2/10">
                  <TrendingUp className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Attendance Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round((presentToday / employees.length) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-chart-4/10">
                  <CalendarDays className="w-5 h-5 text-chart-4" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">On Leave Today</p>
                  <p className="text-2xl font-bold text-foreground">{onLeaveToday}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

"use client"

import { useStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ClipboardList, CalendarDays, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function EmployeeDashboard() {
  const { currentUser, users, tasks, leaveRequests } = useStore()
  
  if (!currentUser) return null

  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id)
  const myLeaves = leaveRequests.filter(l => l.employeeId === currentUser.id)
  const colleagues = users.filter(u => u.role === "employee" && u.id !== currentUser.id)

  const pendingTasks = myTasks.filter(t => t.status === "pending").length
  const completedTasks = myTasks.filter(t => t.status === "completed").length
  const pendingLeaves = myLeaves.filter(l => l.status === "pending").length

  const stats = [
    {
      title: "My Tasks",
      value: myTasks.length,
      icon: <ClipboardList className="w-5 h-5" />,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Pending Tasks",
      value: pendingTasks,
      icon: <Clock className="w-5 h-5" />,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Completed Tasks",
      value: completedTasks,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Team Members",
      value: colleagues.length,
      icon: <Users className="w-5 h-5" />,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-primary/10 text-primary border-primary/20"
      case "in-progress":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20"
      default:
        return "bg-chart-3/10 text-chart-3 border-chart-3/20"
    }
  }

  const recentTasks = myTasks.slice(0, 4)
  const teamMembers = colleagues.slice(0, 5)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {currentUser.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">Here is an overview of your work and team.</p>
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
          {/* Recent Tasks */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-primary" />
                My Recent Tasks
              </CardTitle>
              <CardDescription>Your latest assigned tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No tasks assigned yet</p>
                  </div>
                ) : (
                  recentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(task.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card className="border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team Members
              </CardTitle>
              <CardDescription>Your colleagues at the company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground">No team members yet</p>
                  </div>
                ) : (
                  teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border border-border">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.department}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          member.status === "active"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-chart-3/10 text-chart-3 border-chart-3/20"
                        }
                      >
                        {member.status === "active" ? "Active" : "On Leave"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Status */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              My Leave Requests
            </CardTitle>
            <CardDescription>Track your leave application status</CardDescription>
          </CardHeader>
          <CardContent>
            {myLeaves.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No leave requests submitted</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        className={
                          leave.leaveType === "sick"
                            ? "bg-chart-4/10 text-chart-4 border-chart-4/20"
                            : leave.leaveType === "vacation"
                            ? "bg-chart-2/10 text-chart-2 border-chart-2/20"
                            : "bg-chart-5/10 text-chart-5 border-chart-5/20"
                        }
                      >
                        {leave.leaveType}
                      </Badge>
                      <Badge
                        className={
                          leave.status === "pending"
                            ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                            : leave.status === "approved"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }
                      >
                        {leave.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {leave.status === "approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {leave.status === "rejected" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {leave.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(leave.fromDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(leave.toDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-sm text-foreground mt-2 line-clamp-2">{leave.reason}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

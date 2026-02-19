"use client"

import { useStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, Calendar, CheckCircle2, Clock, ArrowRight } from "lucide-react"

export default function EmployeeTasksPage() {
  const { currentUser, tasks, updateTaskStatus } = useStore()
  
  if (!currentUser) return null

  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id)
  const pendingTasks = myTasks.filter(t => t.status === "pending")
  const inProgressTasks = myTasks.filter(t => t.status === "in-progress")
  const completedTasks = myTasks.filter(t => t.status === "completed")

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

  const handleStatusUpdate = (taskId: string, currentStatus: string) => {
    if (currentStatus === "pending") {
      updateTaskStatus(taskId, "in-progress")
    } else if (currentStatus === "in-progress") {
      updateTaskStatus(taskId, "completed")
    }
  }

  const TaskCard = ({ task }: { task: typeof myTasks[0] }) => (
    <Card className="border-border/50 bg-card">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground">{task.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Due:{" "}
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
            {task.status !== "completed" && (
              <Button
                size="sm"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                onClick={() => handleStatusUpdate(task.id, task.status)}
              >
                {task.status === "pending" ? (
                  <>
                    Start Task
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Complete
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground">Manage and track your assigned tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border/50 bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-chart-3/10">
                <Clock className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-foreground">{pendingTasks.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-chart-2/10">
                <ClipboardList className="w-5 h-5 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">{inProgressTasks.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">{completedTasks.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-chart-3" />
              Pending Tasks
            </h2>
            <div className="grid gap-4">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* In Progress Tasks */}
        {inProgressTasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-chart-2" />
              In Progress
            </h2>
            <div className="grid gap-4">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Completed
            </h2>
            <div className="grid gap-4">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {myTasks.length === 0 && (
          <Card className="border-border/50 bg-card">
            <CardContent className="py-12">
              <div className="text-center">
                <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-1">No tasks assigned</h3>
                <p className="text-muted-foreground">
                  You do not have any tasks assigned yet. Check back later!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

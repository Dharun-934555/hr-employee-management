"use client"

import React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarDays, Plus, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react"

export default function EmployeeLeavesPage() {
  const { currentUser, leaveRequests, addLeaveRequest } = useStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    leaveType: "" as "sick" | "vacation" | "personal" | "other" | "",
    fromDate: "",
    toDate: "",
    reason: "",
  })

  if (!currentUser) return null

  const myLeaves = leaveRequests.filter(l => l.employeeId === currentUser.id)
  const pendingLeaves = myLeaves.filter(l => l.status === "pending")
  const approvedLeaves = myLeaves.filter(l => l.status === "approved")
  const rejectedLeaves = myLeaves.filter(l => l.status === "rejected")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.leaveType || !formData.fromDate || !formData.toDate || !formData.reason) return

    addLeaveRequest({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      leaveType: formData.leaveType as "sick" | "vacation" | "personal" | "other",
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      reason: formData.reason,
    })

    setFormData({ leaveType: "", fromDate: "", toDate: "", reason: "" })
    setIsDialogOpen(false)
  }

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "sick":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20"
      case "vacation":
        return "bg-chart-2/10 text-chart-2 border-chart-2/20"
      case "personal":
        return "bg-chart-5/10 text-chart-5 border-chart-5/20"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-primary/10 text-primary border-primary/20"
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-chart-3/10 text-chart-3 border-chart-3/20"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leave Requests</h1>
            <p className="text-muted-foreground">Apply for leave and track your requests</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Apply for Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Apply for Leave</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Submit a new leave request for approval
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="leaveType" className="text-foreground">Leave Type</Label>
                  <Select
                    value={formData.leaveType}
                    onValueChange={(value) => setFormData({ ...formData, leaveType: value as "sick" | "vacation" | "personal" | "other" })}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromDate" className="text-foreground">From Date</Label>
                    <Input
                      id="fromDate"
                      type="date"
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      className="bg-input border-border text-foreground"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="toDate" className="text-foreground">To Date</Label>
                    <Input
                      id="toDate"
                      type="date"
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      className="bg-input border-border text-foreground"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-foreground">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Please provide a reason for your leave request"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="bg-input border-border text-foreground min-h-[100px]"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                <p className="text-2xl font-bold text-foreground">{pendingLeaves.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-foreground">{approvedLeaves.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-foreground">{rejectedLeaves.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              My Leave Requests
            </CardTitle>
            <CardDescription>{myLeaves.length} total requests</CardDescription>
          </CardHeader>
          <CardContent>
            {myLeaves.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-foreground mb-1">No leave requests</h3>
                <p className="text-muted-foreground mb-4">
                  You have not submitted any leave requests yet
                </p>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Apply for Leave
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={getLeaveTypeColor(leave.leaveType)}>
                        {leave.leaveType}
                      </Badge>
                      <Badge className={getStatusColor(leave.status)}>
                        {leave.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {leave.status === "approved" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {leave.status === "rejected" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {leave.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>
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
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2">{leave.reason}</p>
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

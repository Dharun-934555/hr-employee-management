"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Search, Building, Mail } from "lucide-react"

export default function TeamPage() {
  const { currentUser, users } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  if (!currentUser) return null

  const colleagues = users.filter(u => u.role === "employee")
  
  const filteredColleagues = colleagues.filter(
    (colleague) =>
      colleague.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      colleague.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const departments = Array.from(new Set(colleagues.map(c => c.department)))

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
            <p className="text-muted-foreground">Connect with your colleagues across the organization</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">{colleagues.length} Colleagues</span>
          </div>
        </div>

        {/* Search */}
        <Card className="border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>

        {/* Department Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {departments.map((dept) => {
            const count = colleagues.filter(c => c.department === dept).length
            return (
              <Card key={dept} className="border-border/50 bg-card">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground mt-1">{dept}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Team Grid */}
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              All Team Members
            </CardTitle>
            <CardDescription>
              {filteredColleagues.length} colleague{filteredColleagues.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredColleagues.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No team members found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredColleagues.map((colleague) => (
                  <div
                    key={colleague.id}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(colleague.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium text-foreground truncate">{colleague.name}</h3>
                          <Badge
                            className={
                              colleague.status === "active"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-chart-3/10 text-chart-3 border-chart-3/20"
                            }
                          >
                            {colleague.status === "active" ? "Active" : "On Leave"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Building className="w-3 h-3" />
                          <span>{colleague.department}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{colleague.email}</span>
                        </div>
                      </div>
                    </div>
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

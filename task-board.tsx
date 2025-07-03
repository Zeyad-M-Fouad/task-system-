"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Filter, Users, Trash2, ChevronLeft, ChevronRight } from "lucide-react"

type TaskStatus = "TO DO" | "IN PROGRESS" | "COMPLETE"

interface Task {
  id: string
  title: string
  assignee: string
  status: TaskStatus
  image?: string // Add optional image field
}

interface User {
  id: string
  name: string
  email: string
  password: string
}

export default function Component() {
  // Mock data
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Alice Johnson", email: "alice@company.com", password: "user123" },
    { id: "2", name: "Bob Smith", email: "bob@company.com", password: "user123" },
    { id: "3", name: "Carol Davis", email: "carol@company.com", password: "user123" },
    { id: "4", name: "David Wilson", email: "david@company.com", password: "user123" },
    { id: "admin", name: "Zeyad (Admin)", email: "zeyad@company.com", password: "Asrasr123" },
  ])

  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Design homepage", assignee: "Alice Johnson", status: "TO DO" },
    { id: "2", title: "Implement user authentication", assignee: "Bob Smith", status: "IN PROGRESS" },
    { id: "3", title: "Write API documentation", assignee: "Carol Davis", status: "TO DO" },
    { id: "4", title: "Set up CI/CD pipeline", assignee: "Alice Johnson", status: "COMPLETE" },
    { id: "5", title: "Create mobile responsive design", assignee: "Bob Smith", status: "IN PROGRESS" },
    { id: "6", title: "Database optimization", assignee: "Carol Davis", status: "COMPLETE" },
  ])

  // Current user state (you can change this to test different user perspectives)
  const [currentUser, setCurrentUser] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState("")

  // Filter states
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "ALL">("ALL")
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL")

  // Dialog states
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [isUserManagementOpen, setIsUserManagementOpen] = useState(false)

  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskAssignee, setNewTaskAssignee] = useState("")
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserPassword, setNewUserPassword] = useState("")
  const [newTaskImage, setNewTaskImage] = useState<string>("")

  const statuses: TaskStatus[] = ["TO DO", "IN PROGRESS", "COMPLETE"]

  // Filter tasks based on user permissions and filters
  const getFilteredTasks = () => {
    let filteredTasks = tasks

    // Apply user permissions
    if (!isAdmin) {
      filteredTasks = filteredTasks.filter((task) => task.assignee === currentUser)
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      filteredTasks = filteredTasks.filter((task) => task.status === statusFilter)
    }

    // Apply assignee filter
    if (assigneeFilter !== "ALL") {
      filteredTasks = filteredTasks.filter((task) => task.assignee === assigneeFilter)
    }

    return filteredTasks
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return getFilteredTasks().filter((task) => task.status === status)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setNewTaskImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeTaskImage = () => {
    setNewTaskImage("")
  }

  const addTask = () => {
    if (newTaskTitle && newTaskAssignee) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        assignee: newTaskAssignee,
        status: "TO DO",
        image: newTaskImage || undefined,
      }
      setTasks([...tasks, newTask])
      setNewTaskTitle("")
      setNewTaskAssignee("")
      setNewTaskImage("")
      setIsAddTaskOpen(false)
    }
  }

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const canMoveTask = (task: Task) => {
    return isAdmin || task.assignee === currentUser
  }

  const addUser = () => {
    if (newUserName && newUserEmail && newUserPassword) {
      const newUser: User = {
        id: Date.now().toString(),
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
      }
      setUsers([...users, newUser])
      setNewUserName("")
      setNewUserEmail("")
      setNewUserPassword("")
      setIsUserManagementOpen(false)
    }
  }

  const deleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
    // Remove tasks assigned to deleted user
    setTasks(tasks.filter((task) => task.assignee !== users.find((u) => u.id === userId)?.name))
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "TO DO":
        return "bg-slate-600"
      case "IN PROGRESS":
        return "bg-blue-600"
      case "COMPLETE":
        return "bg-green-600"
    }
  }

  const getNextStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    const statusIndex = statuses.indexOf(currentStatus)
    return statusIndex < statuses.length - 1 ? statuses[statusIndex + 1] : null
  }

  const getPrevStatus = (currentStatus: TaskStatus): TaskStatus | null => {
    const statusIndex = statuses.indexOf(currentStatus)
    return statusIndex > 0 ? statuses[statusIndex - 1] : null
  }

  const handleLogin = () => {
    // Admin credentials
    if (loginUsername === "zeyad" && loginPassword === "Asrasr123") {
      setIsLoggedIn(true)
      setIsAdmin(true)
      setCurrentUser("Zeyad (Admin)")
      setLoginError("")
      setLoginUsername("")
      setLoginPassword("")
    } else {
      // Check if it's a regular user with stored password
      const user = users.find((u) => u.name.toLowerCase() === loginUsername.toLowerCase() && u.id !== "admin")
      if (user && loginPassword === user.password) {
        setIsLoggedIn(true)
        setIsAdmin(false)
        setCurrentUser(user.name)
        setLoginError("")
        setLoginUsername("")
        setLoginPassword("")
      } else {
        setLoginError("Invalid username or password")
      }
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsAdmin(false)
    setCurrentUser("")
    setLoginUsername("")
    setLoginPassword("")
    setLoginError("")
  }

  // Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-slate-800 border-slate-700">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Task Board</h1>
              <p className="text-slate-400">Sign in to access your tasks</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-slate-700 border-slate-600"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-slate-700 border-slate-600"
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              {loginError && (
                <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">{loginError}</div>
              )}

              <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>

              <div className="mt-6 p-4 bg-slate-700 rounded-lg text-sm">
                <h3 className="font-semibold mb-2">Demo Credentials:</h3>
                <div className="space-y-1 text-slate-300">
                  <p>
                    <strong>Admin:</strong> zeyad / Asrasr123
                  </p>
                  <p>
                    <strong>Users:</strong> alice johnson / user123
                  </p>
                  <p className="text-xs text-slate-400 mt-2">(Default password for existing users is "user123")</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Task Board</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>
                Current User: <span className="text-white font-medium">{currentUser}</span>
              </span>
              <Badge variant={isAdmin ? "default" : "secondary"}>{isAdmin ? "Admin" : "User"}</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-xs border-red-600 text-red-400 hover:bg-red-900/20 bg-transparent"
              >
                Logout
              </Button>
            </div>
          </div>

          {isAdmin && (
            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title"
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-assignee">Assign To</Label>
                    <Select value={newTaskAssignee} onValueChange={setNewTaskAssignee}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        {users
                          .filter((u) => u.id !== "admin")
                          .map((user) => (
                            <SelectItem key={user.id} value={user.name}>
                              {user.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="task-image">Attach Image (Optional)</Label>
                    <Input
                      id="task-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-slate-700 border-slate-600"
                    />
                    {newTaskImage && (
                      <div className="mt-2 relative">
                        <img
                          src={newTaskImage || "/placeholder.svg"}
                          alt="Task preview"
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={removeTaskImage}
                          className="absolute top-1 right-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <Button onClick={addTask} className="w-full bg-blue-600 hover:bg-blue-700">
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-800 rounded-lg">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <Label className="text-sm text-slate-400">Status:</Label>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TaskStatus | "ALL")}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <Label className="text-sm text-slate-400">Assignee:</Label>
              <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Users</SelectItem>
                  {users
                    .filter((u) => u.id !== "admin")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statuses.map((status) => (
            <div key={status} className="bg-slate-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                <h2 className="font-semibold text-lg">{status}</h2>
                <Badge variant="secondary" className="ml-auto">
                  {getTasksByStatus(status).length}
                </Badge>
              </div>

              <div className="space-y-3">
                {getTasksByStatus(status).map((task) => (
                  <Card key={task.id} className="bg-slate-700 border-slate-600 hover:bg-slate-650 transition-colors">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-2">{task.title}</h3>

                      {task.image && (
                        <div className="mb-3">
                          <img
                            src={task.image || "/placeholder.svg"}
                            alt={task.title}
                            className="w-full h-24 object-cover rounded-md"
                          />
                        </div>
                      )}

                      <p className="text-sm text-slate-400 mb-3">
                        Assigned to: <span className="text-white">{task.assignee}</span>
                      </p>

                      {canMoveTask(task) && (
                        <div className="flex gap-2">
                          {getPrevStatus(task.status) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveTask(task.id, getPrevStatus(task.status)!)}
                              className="flex-1 text-xs border-slate-600 hover:bg-slate-600"
                            >
                              <ChevronLeft className="w-3 h-3 mr-1" />
                              {getPrevStatus(task.status)}
                            </Button>
                          )}
                          {getNextStatus(task.status) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => moveTask(task.id, getNextStatus(task.status)!)}
                              className="flex-1 text-xs border-slate-600 hover:bg-slate-600"
                            >
                              {getNextStatus(task.status)}
                              <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {getTasksByStatus(status).length === 0 && (
                  <div className="text-center py-8 text-slate-500">No tasks in {status.toLowerCase()}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* User Management (Admin Only) */}
        {isAdmin && (
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h2 className="text-xl font-semibold">User Management</h2>
              </div>

              <Dialog open={isUserManagementOpen} onOpenChange={setIsUserManagementOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-slate-600 bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-800 border-slate-700">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="user-name">Name</Label>
                      <Input
                        id="user-name"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="Enter user name"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-email">Email</Label>
                      <Input
                        id="user-email"
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="Enter user email"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="user-password">Password</Label>
                      <Input
                        id="user-password"
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Enter user password"
                        className="bg-slate-700 border-slate-600"
                      />
                    </div>
                    <Button onClick={addUser} className="w-full bg-blue-600 hover:bg-blue-700">
                      Add User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users
                .filter((u) => u.id !== "admin")
                .map((user) => (
                  <Card key={user.id} className="bg-slate-700 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-slate-400">{user.email}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {tasks.filter((t) => t.assignee === user.name).length} tasks assigned
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

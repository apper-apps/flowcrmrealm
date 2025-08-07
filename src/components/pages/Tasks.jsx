import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import SearchBar from "@/components/molecules/SearchBar"
import TaskList from "@/components/organisms/TaskList"
import TaskModal from "@/components/organisms/TaskModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import taskService from "@/services/api/taskService"
import contactService from "@/services/api/contactService"
import dealService from "@/services/api/dealService"
import { toast } from "react-toastify"
import { isToday, isTomorrow, isPast } from "date-fns"

const Tasks = () => {
  const [tasks, setTasks] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [tasksData, contactsData, dealsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      
      // Sort tasks by due date
      const sortedTasks = tasksData.sort((a, b) => 
        new Date(a.dueDate) - new Date(b.dueDate)
      )
      
      setTasks(sortedTasks)
      setFilteredTasks(sortedTasks)
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (err) {
      setError("Failed to load tasks data")
      toast.error("Failed to load tasks data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = tasks

    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      filtered = filtered.filter(task => task.status === statusFilter)
    }

    if (priorityFilter) {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, searchTerm, statusFilter, priorityFilter])

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await taskService.update(selectedTask.Id, taskData)
        toast.success("Task updated successfully")
      } else {
        await taskService.create(taskData)
        toast.success("Task created successfully")
      }
      loadData()
    } catch (err) {
      toast.error("Failed to save task")
    }
  }

  const handleCompleteTask = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId)
      if (task) {
        const newStatus = task.status === "completed" ? "pending" : "completed"
        await taskService.update(taskId, { ...task, status: newStatus })
        toast.success(`Task ${newStatus === "completed" ? "completed" : "reopened"}`)
        loadData()
      }
    } catch (err) {
      toast.error("Failed to update task")
    }
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId)
        toast.success("Task deleted successfully")
        loadData()
      } catch (err) {
        toast.error("Failed to delete task")
      }
    }
  }

  const openCreateModal = () => {
    setSelectedTask(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedTask(null)
    setIsModalOpen(false)
  }

  // Calculate task statistics
  const pendingTasks = tasks.filter(task => task.status === "pending")
  const completedTasks = tasks.filter(task => task.status === "completed")
  const overdueTasks = pendingTasks.filter(task => isPast(new Date(task.dueDate)))
  const todayTasks = pendingTasks.filter(task => isToday(new Date(task.dueDate)))

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Tasks
          </h1>
          <p className="text-gray-600 mt-1">Manage your to-do list and stay organized</p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks by title..."
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="sm:w-40"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="sm:w-40"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <ApperIcon name="Clock" className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-blue-700">{pendingTasks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center">
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-700">{completedTasks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center">
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm text-red-600 font-medium">Overdue</p>
              <p className="text-2xl font-bold text-red-700">{overdueTasks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center">
            <ApperIcon name="Calendar" className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Due Today</p>
              <p className="text-2xl font-bold text-purple-700">{todayTasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length > 0 ? (
        <TaskList
          tasks={filteredTasks}
          onComplete={handleCompleteTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      ) : tasks.length > 0 ? (
        <Empty
          icon="Search"
          title="No tasks found"
          description="Try adjusting your search criteria or filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm("")
            setStatusFilter("")
            setPriorityFilter("")
          }}
        />
      ) : (
        <Empty
          icon="CheckSquare"
          title="No tasks yet"
          description="Stay organized by creating your first task."
          actionLabel="Create First Task"
          onAction={openCreateModal}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        contacts={contacts}
        deals={deals}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
      />
    </motion.div>
  )
}

export default Tasks
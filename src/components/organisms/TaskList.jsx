import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import { format, isToday, isTomorrow, isPast } from "date-fns"

const TaskList = ({ tasks, onComplete, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "danger"
      case "medium": return "warning"
      case "low": return "success"
      default: return "default"
    }
  }

  const getDateDisplay = (date) => {
    const taskDate = new Date(date)
    if (isToday(taskDate)) return "Today"
    if (isTomorrow(taskDate)) return "Tomorrow"
    if (isPast(taskDate)) return `Overdue (${format(taskDate, "MMM dd")})`
    return format(taskDate, "MMM dd, yyyy")
  }

  const getDateColor = (date) => {
    const taskDate = new Date(date)
    if (isPast(taskDate)) return "text-red-600"
    if (isToday(taskDate)) return "text-accent-600"
    return "text-gray-600"
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <motion.div
          key={task.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className={`bg-gradient-to-r from-white to-gray-50 border border-gray-200 ${
            task.status === "completed" ? "opacity-60" : ""
          }`}>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onComplete(task.Id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                  task.status === "completed"
                    ? "bg-gradient-to-r from-accent-500 to-accent-600 border-accent-500"
                    : "border-gray-300 hover:border-accent-500"
                }`}
              >
                {task.status === "completed" && (
                  <ApperIcon name="Check" className="w-4 h-4 text-white" />
                )}
              </button>
              
              <div className="flex-1">
                <h4 className={`font-medium ${
                  task.status === "completed" 
                    ? "text-gray-500 line-through" 
                    : "text-gray-900"
                }`}>
                  {task.title}
                </h4>
                
                <div className="flex items-center space-x-3 mt-2">
                  <Badge variant={getPriorityColor(task.priority)} className="text-xs capitalize">
                    {task.priority} priority
                  </Badge>
                  
                  <div className={`flex items-center text-sm ${getDateColor(task.dueDate)}`}>
                    <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                    {getDateDisplay(task.dueDate)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onEdit(task)}
                  className="p-2 hover:bg-blue-50 text-blue-600"
                >
                  <ApperIcon name="Edit" className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onDelete(task.Id)}
                  className="p-2 hover:bg-red-50 text-red-600"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default TaskList
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import { format } from "date-fns"

const TaskModal = ({ task, contacts, deals, isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    title_c: "",
    contact_id_c: "",
    deal_id_c: "",
    due_date_c: "",
    status_c: "pending",
    priority_c: "medium"
  })

  useEffect(() => {
    if (task) {
setFormData({
        title_c: task.title_c || "",
        contact_id_c: task.contact_id_c?.Id || task.contact_id_c?.toString() || "",
        deal_id_c: task.deal_id_c?.Id || task.deal_id_c?.toString() || "",
        due_date_c: task.due_date_c ? format(new Date(task.due_date_c), "yyyy-MM-dd") : "",
        status_c: task.status_c || "pending",
        priority_c: task.priority_c || "medium"
      })
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
setFormData({
        title_c: "",
        contact_id_c: "",
        deal_id_c: "",
        due_date_c: format(tomorrow, "yyyy-MM-dd"),
        status_c: "pending",
        priority_c: "medium"
      })
    }
  }, [task])

  const handleSubmit = (e) => {
    e.preventDefault()
const taskData = {
      title_c: formData.title_c,
      contact_id_c: parseInt(formData.contact_id_c) || null,
      deal_id_c: parseInt(formData.deal_id_c) || null,
      due_date_c: new Date(formData.due_date_c).toISOString(),
      status_c: formData.status_c,
      priority_c: formData.priority_c
    }
    onSave(taskData)
    onClose()
  }

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ]

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" }
  ]

  const contactOptions = [
    { value: "", label: "No specific contact" },
    ...contacts.map(contact => ({
      value: contact.Id.toString(),
label: `${contact.Name} (${contact.company_c})`
    }))
  ]

  const dealOptions = [
    { value: "", label: "No specific deal" },
    ...deals.map(deal => ({
      value: deal.Id.toString(),
label: deal.title_c
    }))
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <form onSubmit={handleSubmit}>
            <div className="bg-gradient-to-r from-white to-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {task ? "Edit Task" : "Create New Task"}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  onClick={onClose}
                  className="p-2"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="px-6 py-6 space-y-4">
              <FormField
                label="Task Title"
                type="text"
value={formData.title_c}
                onChange={(e) => setFormData({ ...formData, title_c: e.target.value })}
                placeholder="What needs to be done?"
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Priority"
                  type="select"
value={formData.priority_c}
                  onChange={(e) => setFormData({ ...formData, priority_c: e.target.value })}
                  options={priorityOptions}
                />
                
                <FormField
                  label="Status"
                  type="select"
value={formData.status_c}
                  onChange={(e) => setFormData({ ...formData, status_c: e.target.value })}
                  options={statusOptions}
                />
              </div>
              
              <FormField
                label="Due Date"
                type="date"
value={formData.due_date_c}
                onChange={(e) => setFormData({ ...formData, due_date_c: e.target.value })}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Related Contact"
                  type="select"
value={formData.contact_id_c}
                  onChange={(e) => setFormData({ ...formData, contact_id_c: e.target.value })}
                  options={contactOptions}
                />
                
                <FormField
                  label="Related Deal"
                  type="select"
value={formData.deal_id_c}
                  onChange={(e) => setFormData({ ...formData, deal_id_c: e.target.value })}
                  options={dealOptions}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                {task ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default TaskModal
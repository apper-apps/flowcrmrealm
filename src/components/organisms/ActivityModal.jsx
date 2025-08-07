import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import { format } from "date-fns"

const ActivityModal = ({ activity, contacts, deals, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: "call",
    contactId: "",
    dealId: "",
    subject: "",
    notes: "",
    date: "",
    duration: ""
  })

  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type || "call",
        contactId: activity.contactId?.toString() || "",
        dealId: activity.dealId?.toString() || "",
        subject: activity.subject || "",
        notes: activity.notes || "",
        date: activity.date ? format(new Date(activity.date), "yyyy-MM-dd'T'HH:mm") : "",
        duration: activity.duration?.toString() || ""
      })
    } else {
      const now = new Date()
      setFormData({
        type: "call",
        contactId: "",
        dealId: "",
        subject: "",
        notes: "",
        date: format(now, "yyyy-MM-dd'T'HH:mm"),
        duration: ""
      })
    }
  }, [activity])

  const handleSubmit = (e) => {
    e.preventDefault()
    const activityData = {
      ...formData,
      contactId: parseInt(formData.contactId) || null,
      dealId: parseInt(formData.dealId) || null,
      date: new Date(formData.date).toISOString(),
      duration: parseInt(formData.duration) || null
    }
    onSave(activityData)
    onClose()
  }

  const typeOptions = [
    { value: "call", label: "Phone Call" },
    { value: "meeting", label: "Meeting" },
    { value: "email", label: "Email" },
    { value: "note", label: "Note" }
  ]

  const contactOptions = [
    { value: "", label: "Select a contact (optional)" },
    ...contacts.map(contact => ({
      value: contact.Id.toString(),
      label: `${contact.name} (${contact.company})`
    }))
  ]

  const dealOptions = [
    { value: "", label: "Select a deal (optional)" },
    ...deals.map(deal => ({
      value: deal.Id.toString(),
      label: deal.title
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
                  {activity ? "Edit Activity" : "Log New Activity"}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Activity Type"
                  type="select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  options={typeOptions}
                />
                
                <FormField
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="30"
                  min="1"
                />
              </div>
              
              <FormField
                label="Subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of the activity"
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Contact"
                  type="select"
                  value={formData.contactId}
                  onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
                  options={contactOptions}
                />
                
                <FormField
                  label="Related Deal"
                  type="select"
                  value={formData.dealId}
                  onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
                  options={dealOptions}
                />
              </div>
              
              <FormField
                label="Date & Time"
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              
              <FormField
                label="Notes"
                type="textarea"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add detailed notes about this activity..."
              />
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
                {activity ? "Update Activity" : "Log Activity"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ActivityModal
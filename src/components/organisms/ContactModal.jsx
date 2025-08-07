import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"

const ContactModal = ({ contact, isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    Name: "",
    company_c: "",
    email_c: "",
    phone_c: "",
    industry_c: "technology",
    notes_c: ""
  })

  useEffect(() => {
    if (contact) {
setFormData({
        Name: contact.Name || "",
        company_c: contact.company_c || "",
        email_c: contact.email_c || "",
        phone_c: contact.phone_c || "",
        industry_c: contact.industry_c || "technology",
        notes_c: contact.notes_c || ""
      })
    } else {
setFormData({
        Name: "",
        company_c: "",
        email_c: "",
        phone_c: "",
        industry_c: "technology",
        notes_c: ""
      })
    }
  }, [contact])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  const industryOptions = [
    { value: "technology", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" }
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
                  {contact ? "Edit Contact" : "Add New Contact"}
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
                label="Full Name"
                type="text"
value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                placeholder="Enter full name"
                required
              />
              
              <FormField
                label="Company"
                type="text"
value={formData.company_c}
                onChange={(e) => setFormData({ ...formData, company_c: e.target.value })}
                placeholder="Enter company name"
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Email"
                  type="email"
value={formData.email_c}
                  onChange={(e) => setFormData({ ...formData, email_c: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
                
                <FormField
                  label="Phone"
                  type="tel"
value={formData.phone_c}
                  onChange={(e) => setFormData({ ...formData, phone_c: e.target.value })}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              
              <FormField
                label="Industry"
                type="select"
value={formData.industry_c}
                onChange={(e) => setFormData({ ...formData, industry_c: e.target.value })}
                options={industryOptions}
              />
              
              <FormField
                label="Notes"
                type="textarea"
value={formData.notes_c}
                onChange={(e) => setFormData({ ...formData, notes_c: e.target.value })}
                placeholder="Add any additional notes..."
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
                {contact ? "Update Contact" : "Create Contact"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ContactModal
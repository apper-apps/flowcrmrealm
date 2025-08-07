import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";

const DealModal = ({ deal, contacts, isOpen, onClose, onSave }) => {
const [formData, setFormData] = useState({
    title_c: "",
    contact_id_c: "",
    value_c: "",
    stage_c: "lead",
    probability_c: "10",
    expected_close_date_c: ""
  })

  useEffect(() => {
    if (deal) {
setFormData({
        title_c: deal.title_c || "",
        contact_id_c: deal.contact_id_c?.Id || deal.contact_id_c || "",
        value_c: deal.value_c?.toString() || "",
        stage_c: deal.stage_c || "lead",
        probability_c: deal.probability_c?.toString() || "10",
        expected_close_date_c: deal.expected_close_date_c ? format(new Date(deal.expected_close_date_c), "yyyy-MM-dd") : ""
      })
    } else {
setFormData({
        title_c: "",
        contact_id_c: "",
        value_c: "",
        stage_c: "lead",
        probability_c: "10",
        expected_close_date_c: ""
      })
    }
  }, [deal])

const handleSubmit = (e) => {
    e.preventDefault()
    const dealData = {
      title_c: formData.title_c,
      contact_id_c: parseInt(formData.contact_id_c) || null,
      value_c: parseFloat(formData.value_c),
      stage_c: formData.stage_c,
      probability_c: parseInt(formData.probability_c),
      expected_close_date_c: new Date(formData.expected_close_date_c).toISOString()
    }
    onSave(dealData)
    onClose()
  }

  const stageOptions = [
    { value: "lead", label: "Lead" },
    { value: "qualified", label: "Qualified" },
    { value: "proposal", label: "Proposal" },
    { value: "negotiation", label: "Negotiation" },
    { value: "closed-won", label: "Closed Won" },
    { value: "closed-lost", label: "Closed Lost" }
  ]

  const contactOptions = [
    { value: "", label: "Select a contact" },
...contacts.map(contact => ({
      value: contact.Id.toString(),
      label: `${contact.Name} (${contact.company_c})`
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
                  {deal ? "Edit Deal" : "Add New Deal"}
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
                label="Deal Title"
                type="text"
value={formData.title_c}
                onChange={(e) => setFormData({ ...formData, title_c: e.target.value })}
                placeholder="Enter deal title"
                required
              />
              
              <FormField
                label="Contact"
                type="select"
value={formData.contact_id_c}
                onChange={(e) => setFormData({ ...formData, contact_id_c: e.target.value })}
                options={contactOptions}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Deal Value ($)"
                  type="number"
value={formData.value_c}
                  onChange={(e) => setFormData({ ...formData, value_c: e.target.value })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
                
                <FormField
                  label="Probability (%)"
                  type="number"
value={formData.probability_c}
                  onChange={(e) => setFormData({ ...formData, probability_c: e.target.value })}
                  min="0"
                  max="100"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Stage"
                  type="select"
value={formData.stage_c}
                  onChange={(e) => setFormData({ ...formData, stage_c: e.target.value })}
                  options={stageOptions}
                />
                
                <FormField
                  label="Expected Close Date"
                  type="date"
value={formData.expected_close_date_c}
                  onChange={(e) => setFormData({ ...formData, expected_close_date_c: e.target.value })}
                  required
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
                {deal ? "Update Deal" : "Create Deal"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default DealModal
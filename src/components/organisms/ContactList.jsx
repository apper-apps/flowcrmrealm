import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"

const ContactList = ({ contacts, onEdit, onDelete, onView }) => {
  return (
    <div className="space-y-4">
      {contacts.map((contact, index) => (
        <motion.div
          key={contact.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card hover={false} className="bg-gradient-to-r from-white to-gray-50 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
{contact.Name?.charAt(0).toUpperCase() || 'C'}
                  </span>
                </div>
                
                <div className="flex-1">
<h3 className="text-lg font-semibold text-gray-900">{contact.Name}</h3>
                  <p className="text-sm text-gray-600">{contact.company_c}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <ApperIcon name="Mail" className="w-4 h-4 mr-1" />
{contact.email_c}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ApperIcon name="Phone" className="w-4 h-4 mr-1" />
{contact.phone_c}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="primary" className="capitalize">
{contact.industry_c}
                </Badge>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => onView(contact)}
                    className="p-2 hover:bg-primary-50 text-primary-600"
                  >
                    <ApperIcon name="Eye" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => onEdit(contact)}
                    className="p-2 hover:bg-blue-50 text-blue-600"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => onDelete(contact.Id)}
                    className="p-2 hover:bg-red-50 text-red-600"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default ContactList
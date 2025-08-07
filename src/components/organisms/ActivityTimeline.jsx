import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"
import { format } from "date-fns"

const ActivityTimeline = ({ activities, onEdit, onDelete }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "call": return "Phone"
      case "meeting": return "Calendar"
      case "email": return "Mail"
      case "note": return "FileText"
      default: return "Activity"
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case "call": return "text-blue-500"
      case "meeting": return "text-green-500"
      case "email": return "text-purple-500"
      case "note": return "text-orange-500"
      default: return "text-gray-500"
    }
  }

  const getBadgeVariant = (type) => {
    switch (type) {
      case "call": return "primary"
      case "meeting": return "success"
      case "email": return "primary"
      case "note": return "warning"
      default: return "default"
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.Id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="bg-gradient-to-r from-white to-gray-50 border border-gray-200">
            <div className="flex items-start space-x-4">
<div className={`w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.type_c)}`}>
                <ApperIcon 
name={getActivityIcon(activity.type_c)}
                  className="w-5 h-5" 
                />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
<h4 className="font-medium text-gray-900">{activity.subject_c}</h4>
                    <div className="flex items-center space-x-3 mt-1">
<Badge variant={getBadgeVariant(activity.type_c)} className="capitalize text-xs">
                        {activity.type_c}
                      </Badge>
                      <span className="text-sm text-gray-500">
{format(new Date(activity.date_c), "MMM dd, yyyy 'at' h:mm a")}
                      </span>
{activity.duration_c && (
                        <span className="text-sm text-gray-500">
                          ({activity.duration_c} min)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onEdit(activity)}
                      className="p-1 hover:bg-blue-50 text-blue-600"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onDelete(activity.Id)}
                      className="p-1 hover:bg-red-50 text-red-600"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
{activity.notes_c && (
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {activity.notes_c}
                  </p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default ActivityTimeline
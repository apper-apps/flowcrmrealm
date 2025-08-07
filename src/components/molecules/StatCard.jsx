import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend,
  trendValue,
  className = "" 
}) => {
  const isPositive = trend === "up"
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`bg-gradient-to-br from-white to-gray-50 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && trendValue && (
              <div className="flex items-center mt-2">
                <ApperIcon 
                  name={isPositive ? "TrendingUp" : "TrendingDown"} 
                  className={`w-4 h-4 mr-1 ${
                    isPositive ? "text-accent-500" : "text-red-500"
                  }`} 
                />
                <span className={`text-sm font-medium ${
                  isPositive ? "text-accent-600" : "text-red-600"
                }`}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default StatCard
import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Card from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import Badge from "@/components/atoms/Badge"

const DealPipeline = ({ deals, onUpdateStage, onEdit, onDelete }) => {
  const stages = [
    { id: "lead", name: "Lead", color: "bg-gray-100 text-gray-800" },
    { id: "qualified", name: "Qualified", color: "bg-blue-100 text-blue-800" },
    { id: "proposal", name: "Proposal", color: "bg-yellow-100 text-yellow-800" },
    { id: "negotiation", name: "Negotiation", color: "bg-orange-100 text-orange-800" },
    { id: "closed-won", name: "Closed Won", color: "bg-green-100 text-green-800" },
    { id: "closed-lost", name: "Closed Lost", color: "bg-red-100 text-red-800" }
  ]

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-6 pb-4" style={{ minWidth: "1200px" }}>
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id)
          const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
          
          return (
            <div key={stage.id} className="flex-1 min-w-[280px]">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                  <Badge className={stage.color}>
                    {stageDeals.length}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(stageValue)}
                </p>
              </div>
              
              <div className="space-y-3">
                {stageDeals.map((deal, index) => (
                  <motion.div
                    key={deal.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card 
                      className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 cursor-pointer"
                      hover={true}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900 text-sm leading-tight">
                            {deal.title}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => onEdit(deal)}
                              className="p-1 hover:bg-blue-50 text-blue-600"
                            >
                              <ApperIcon name="Edit" className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => onDelete(deal.Id)}
                              className="p-1 hover:bg-red-50 text-red-600"
                            >
                              <ApperIcon name="Trash2" className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                              {formatCurrency(deal.value)}
                            </span>
                            <Badge variant="primary" className="text-xs">
                              {deal.probability}%
                            </Badge>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                            {new Date(deal.expectedCloseDate).toLocaleDateString()}
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <select
                            value={deal.stage}
                            onChange={(e) => onUpdateStage(deal.Id, e.target.value)}
                            className="text-xs bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary-500"
                          >
                            {stages.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DealPipeline
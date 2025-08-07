import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import contactService from "@/services/api/contactService";
import taskService from "@/services/api/taskService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";
import ApperIcon from "@/components/ApperIcon";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Activities from "@/components/pages/Activities";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Dashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [contacts, deals, activities, tasks] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll(),
        taskService.getAll()
      ])

      // Calculate metrics
const totalDeals = deals.length
      const totalValue = deals.reduce((sum, deal) => sum + (deal.value_c || 0), 0)
const wonDeals = deals.filter(deal => deal.stage_c === "closed-won")
      const pipelineValue = deals.filter(deal => !["closed-won", "closed-lost"].includes(deal.stage_c))
        .reduce((sum, deal) => sum + (deal.value_c || 0), 0)
      
const recentActivities = activities
        .sort((a, b) => new Date(b.date_c) - new Date(a.date_c))
        .slice(0, 5)
      
const pendingTasks = tasks.filter(task => task.status_c === "pending").length
      
      setDashboardData({
        contacts: contacts.length,
        totalDeals,
        totalValue,
        wonDeals: wonDeals.length,
        pipelineValue,
        recentActivities,
        pendingTasks,
        deals: deals.slice(0, 5) // Recent deals
      })
    } catch (err) {
      setError("Failed to load dashboard data")
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(value)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadDashboardData} />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <Button
          onClick={() => navigate("/deals")}
          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={dashboardData.contacts || 0}
          icon="Users"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Active Deals"
          value={dashboardData.totalDeals || 0}
          icon="Target"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Pipeline Value"
          value={formatCurrency(dashboardData.pipelineValue || 0)}
          icon="TrendingUp"
          trend="up"
          trendValue="+23%"
        />
        <StatCard
          title="Pending Tasks"
          value={dashboardData.pendingTasks || 0}
          icon="CheckSquare"
          trend="down"
          trendValue="-5%"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate("/activities")}
              className="text-primary-600 hover:text-primary-700"
            >
              View All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {dashboardData.recentActivities?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.Id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <ApperIcon 
name={activity.type_c === "call" ? "Phone" : activity.type_c === "meeting" ? "Calendar" : "Mail"} 
                      className="w-4 h-4 text-primary-600" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
<p className="text-sm font-medium text-gray-900 truncate">
                      {activity.subject_c}
                    </p>
                    <p className="text-sm text-gray-500">
{new Date(activity.date_c).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
) : (
            <Empty
              icon="Calendar"
              title="No Activities Yet"
              description="Start logging activities to track your interactions."
              actionLabel="Log Activity"
              onAction={() => navigate("/activities")}
            />
          )}
        </Card>

        {/* Pipeline Overview */}
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Pipeline Overview</h2>
            <Button
              variant="ghost"
              size="small"
              onClick={() => navigate("/deals")}
              className="text-primary-600 hover:text-primary-700"
            >
              View Pipeline
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {dashboardData.deals?.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.deals.map((deal) => (
                <div key={deal.Id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
<div className="flex-1">
                    <h4 className="font-medium text-gray-900">{deal.title_c}</h4>
                    <p className="text-sm text-gray-600 capitalize">{deal.stage_c?.replace("-", " ")}</p>
                  </div>
                  <div className="text-right">
<p className="font-semibold text-gray-900">{formatCurrency(deal.value_c)}</p>
                    <p className="text-sm text-gray-500">{deal.probability_c}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              icon="Target"
              title="No Deals Yet"
              description="Create your first deal to start tracking opportunities."
              actionLabel="Create Deal"
              onAction={() => navigate("/deals")}
            />
          )}
        </Card>
      </div>
    </motion.div>
  )
}

export default Dashboard
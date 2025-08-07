import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import SearchBar from "@/components/molecules/SearchBar"
import ActivityTimeline from "@/components/organisms/ActivityTimeline"
import ActivityModal from "@/components/organisms/ActivityModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import activityService from "@/services/api/activityService"
import contactService from "@/services/api/contactService"
import dealService from "@/services/api/dealService"
import { toast } from "react-toastify"

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      
      // Sort activities by date (newest first)
      const sortedActivities = activitiesData.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      )
      
      setActivities(sortedActivities)
      setFilteredActivities(sortedActivities)
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (err) {
      setError("Failed to load activities data")
      toast.error("Failed to load activities data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = activities

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter) {
      filtered = filtered.filter(activity => activity.type === typeFilter)
    }

    setFilteredActivities(filtered)
  }, [activities, searchTerm, typeFilter])

  const handleSaveActivity = async (activityData) => {
    try {
      if (selectedActivity) {
        await activityService.update(selectedActivity.Id, activityData)
        toast.success("Activity updated successfully")
      } else {
        await activityService.create(activityData)
        toast.success("Activity logged successfully")
      }
      loadData()
    } catch (err) {
      toast.error("Failed to save activity")
    }
  }

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await activityService.delete(activityId)
        toast.success("Activity deleted successfully")
        loadData()
      } catch (err) {
        toast.error("Failed to delete activity")
      }
    }
  }

  const openCreateModal = () => {
    setSelectedActivity(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedActivity(null)
    setIsModalOpen(false)
  }

  const activityTypes = ["call", "meeting", "email", "note"]

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadData} />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            Activities
          </h1>
          <p className="text-gray-600 mt-1">Track all customer interactions and communications</p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Log Activity
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities by subject or notes..."
          />
        </div>
        <div className="sm:w-48">
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {activityTypes.map(type => (
              <option key={type} value={type} className="capitalize">
                {type}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <ApperIcon name="Phone" className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Calls</p>
              <p className="text-2xl font-bold text-blue-700">
                {activities.filter(a => a.type === "call").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center">
            <ApperIcon name="Calendar" className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Meetings</p>
              <p className="text-2xl font-bold text-green-700">
                {activities.filter(a => a.type === "meeting").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center">
            <ApperIcon name="Mail" className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Emails</p>
              <p className="text-2xl font-bold text-purple-700">
                {activities.filter(a => a.type === "email").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center">
            <ApperIcon name="FileText" className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-orange-600 font-medium">Notes</p>
              <p className="text-2xl font-bold text-orange-700">
                {activities.filter(a => a.type === "note").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {filteredActivities.length > 0 ? (
        <ActivityTimeline
          activities={filteredActivities}
          onEdit={handleEditActivity}
          onDelete={handleDeleteActivity}
        />
      ) : activities.length > 0 ? (
        <Empty
          icon="Search"
          title="No activities found"
          description="Try adjusting your search criteria or filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm("")
            setTypeFilter("")
          }}
        />
      ) : (
        <Empty
          icon="Calendar"
          title="No activities logged"
          description="Start tracking your customer interactions by logging your first activity."
          actionLabel="Log First Activity"
          onAction={openCreateModal}
        />
      )}

      {/* Activity Modal */}
      <ActivityModal
        activity={selectedActivity}
        contacts={contacts}
        deals={deals}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveActivity}
      />
    </motion.div>
  )
}

export default Activities
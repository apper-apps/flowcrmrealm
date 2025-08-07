import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import DealPipeline from "@/components/organisms/DealPipeline"
import DealModal from "@/components/organisms/DealModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import dealService from "@/services/api/dealService"
import contactService from "@/services/api/contactService"
import { toast } from "react-toastify"

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError("")
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError("Failed to load deals data")
      toast.error("Failed to load deals data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
        await dealService.update(selectedDeal.Id, dealData)
        toast.success("Deal updated successfully")
      } else {
        await dealService.create(dealData)
        toast.success("Deal created successfully")
      }
      loadData()
    } catch (err) {
      toast.error("Failed to save deal")
    }
  }

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal)
    setIsModalOpen(true)
  }

  const handleDeleteDeal = async (dealId) => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      try {
        await dealService.delete(dealId)
        toast.success("Deal deleted successfully")
        loadData()
      } catch (err) {
        toast.error("Failed to delete deal")
      }
    }
  }

  const handleUpdateStage = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.Id === dealId)
      if (deal) {
await dealService.update(dealId, { stage_c: newStage })
        toast.success("Deal stage updated")
        loadData()
      }
    } catch (err) {
      toast.error("Failed to update deal stage")
    }
  }

  const openCreateModal = () => {
    setSelectedDeal(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedDeal(null)
    setIsModalOpen(false)
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(value)
  }

const totalValue = deals.reduce((sum, deal) => sum + (deal.value_c || 0), 0)
const wonDeals = deals.filter(deal => deal.stage_c === "closed-won")
const wonValue = wonDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0)

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
            Sales Pipeline
          </h1>
          <p className="text-gray-600 mt-1">Track and manage your sales opportunities</p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <ApperIcon name="Target" className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Deals</p>
              <p className="text-2xl font-bold text-blue-700">{deals.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center">
            <ApperIcon name="DollarSign" className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Value</p>
              <p className="text-2xl font-bold text-purple-700">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center">
            <ApperIcon name="TrendingUp" className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Won Deals</p>
              <p className="text-2xl font-bold text-green-700">{wonDeals.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center">
            <ApperIcon name="Award" className="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <p className="text-sm text-emerald-600 font-medium">Won Value</p>
              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(wonValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      {deals.length > 0 ? (
        <DealPipeline
          deals={deals}
          onUpdateStage={handleUpdateStage}
          onEdit={handleEditDeal}
          onDelete={handleDeleteDeal}
        />
      ) : (
        <Empty
          icon="Target"
          title="No deals in pipeline"
          description="Create your first deal to start tracking sales opportunities."
          actionLabel="Create First Deal"
          onAction={openCreateModal}
        />
      )}

      {/* Deal Modal */}
      <DealModal
        deal={selectedDeal}
        contacts={contacts}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveDeal}
      />
    </motion.div>
  )
}

export default Deals
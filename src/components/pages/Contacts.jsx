import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Select from "@/components/atoms/Select"
import SearchBar from "@/components/molecules/SearchBar"
import ContactList from "@/components/organisms/ContactList"
import ContactModal from "@/components/organisms/ContactModal"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import contactService from "@/services/api/contactService"
import { toast } from "react-toastify"

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await contactService.getAll()
      setContacts(data)
      setFilteredContacts(data)
    } catch (err) {
      setError("Failed to load contacts")
      toast.error("Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    let filtered = contacts

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (industryFilter) {
      filtered = filtered.filter(contact => contact.industry === industryFilter)
    }

    setFilteredContacts(filtered)
  }, [contacts, searchTerm, industryFilter])

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.Id, contactData)
        toast.success("Contact updated successfully")
      } else {
        await contactService.create(contactData)
        toast.success("Contact created successfully")
      }
      loadContacts()
    } catch (err) {
      toast.error("Failed to save contact")
    }
  }

  const handleEditContact = (contact) => {
    setSelectedContact(contact)
    setIsModalOpen(true)
  }

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactService.delete(contactId)
        toast.success("Contact deleted successfully")
        loadContacts()
      } catch (err) {
        toast.error("Failed to delete contact")
      }
    }
  }

  const handleViewContact = (contact) => {
    // Could implement a detailed view modal here
    toast.info(`Viewing ${contact.name}`)
  }

  const openCreateModal = () => {
    setSelectedContact(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedContact(null)
    setIsModalOpen(false)
  }

  const industries = [...new Set(contacts.map(contact => contact.industry))].sort()

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={loadContacts} />

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
            Contacts
          </h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts by name, company, or email..."
          />
        </div>
        <div className="sm:w-48">
          <Select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry} className="capitalize">
                {industry}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <ApperIcon name="Users" className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Contacts</p>
              <p className="text-2xl font-bold text-blue-700">{contacts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <div className="flex items-center">
            <ApperIcon name="Building" className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-green-600 font-medium">Companies</p>
              <p className="text-2xl font-bold text-green-700">
                {new Set(contacts.map(c => c.company)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center">
            <ApperIcon name="Filter" className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600 font-medium">Filtered Results</p>
              <p className="text-2xl font-bold text-purple-700">{filteredContacts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact List */}
      {filteredContacts.length > 0 ? (
        <ContactList
          contacts={filteredContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onView={handleViewContact}
        />
      ) : contacts.length > 0 ? (
        <Empty
          icon="Search"
          title="No contacts found"
          description="Try adjusting your search criteria or filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm("")
            setIndustryFilter("")
          }}
        />
      ) : (
        <Empty
          icon="Users"
          title="No contacts yet"
          description="Start building your contact database by adding your first contact."
          actionLabel="Add First Contact"
          onAction={openCreateModal}
        />
      )}

      {/* Contact Modal */}
      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveContact}
      />
    </motion.div>
  )
}

export default Contacts
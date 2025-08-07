import { toast } from "react-toastify"

class ContactService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })
    this.tableName = 'contact_c'
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "company_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      if (!response.data || response.data.length === 0) {
        return []
      }

      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching contacts:", error?.response?.data?.message)
        toast.error(error.response.data.message)
      } else {
        console.error(error.message)
        toast.error("Failed to load contacts")
      }
      return []
    }
  }

  async getById(recordId) {
    try {
      const tableFields = [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "company_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "industry_c" } },
        { field: { Name: "notes_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } }
      ]
      
      const params = {
        fields: tableFields
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, recordId, params)
      
      if (!response || !response.data) {
        return null
      }
      
      return response.data
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching contact with ID ${recordId}:`, error?.response?.data?.message)
        toast.error(error.response.data.message)
      } else {
        console.error(error.message)
        toast.error("Failed to load contact")
      }
      return null
    }
  }

  async create(contactData) {
    try {
      const params = {
        records: [
          {
            Name: contactData.Name,
            Tags: contactData.Tags || "",
            company_c: contactData.company_c,
            email_c: contactData.email_c,
            phone_c: contactData.phone_c,
            industry_c: contactData.industry_c,
            notes_c: contactData.notes_c || "",
            created_at_c: new Date().toISOString(),
            updated_at_c: new Date().toISOString()
          }
        ]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create contact ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulRecords.map(result => result.data)
      }
      
      return []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating contact:", error?.response?.data?.message)
        toast.error(error.response.data.message)
      } else {
        console.error(error.message)
        toast.error("Failed to create contact")
      }
      return []
    }
  }

  async update(id, contactData) {
    try {
      const params = {
        records: [
          {
            Id: id,
            Name: contactData.Name,
            Tags: contactData.Tags || "",
            company_c: contactData.company_c,
            email_c: contactData.email_c,
            phone_c: contactData.phone_c,
            industry_c: contactData.industry_c,
            notes_c: contactData.notes_c || "",
            updated_at_c: new Date().toISOString()
          }
        ]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update contact ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulUpdates.map(result => result.data)
      }
      
      return []
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating contact:", error?.response?.data?.message)
        toast.error(error.response.data.message)
      } else {
        console.error(error.message)
        toast.error("Failed to update contact")
      }
      return []
    }
  }

  async delete(recordIds) {
    try {
      const idsArray = Array.isArray(recordIds) ? recordIds : [recordIds]
      
      const params = {
        RecordIds: idsArray
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete contact ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length === idsArray.length
      }
      
      return false
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting contact:", error?.response?.data?.message)
        toast.error(error.response.data.message)
      } else {
        console.error(error.message)
        toast.error("Failed to delete contact")
      }
      return false
    }
  }
}

export default new ContactService()
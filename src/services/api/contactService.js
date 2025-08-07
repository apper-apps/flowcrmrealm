import contactsData from "@/services/mockData/contacts.json"

class ContactService {
  constructor() {
    this.contacts = [...contactsData]
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.contacts])
      }, 300)
    })
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const contact = this.contacts.find(c => c.Id === id)
        if (contact) {
          resolve({ ...contact })
        } else {
          reject(new Error("Contact not found"))
        }
      }, 200)
    })
  }

  async create(contactData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.contacts.map(c => c.Id), 0) + 1
        const newContact = {
          Id: newId,
          ...contactData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.contacts.push(newContact)
        resolve({ ...newContact })
      }, 400)
    })
  }

  async update(id, contactData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.contacts.findIndex(c => c.Id === id)
        if (index !== -1) {
          this.contacts[index] = {
            ...this.contacts[index],
            ...contactData,
            Id: id,
            updatedAt: new Date().toISOString()
          }
          resolve({ ...this.contacts[index] })
        } else {
          reject(new Error("Contact not found"))
        }
      }, 350)
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.contacts.findIndex(c => c.Id === id)
        if (index !== -1) {
          this.contacts.splice(index, 1)
          resolve({ message: "Contact deleted successfully" })
        } else {
          reject(new Error("Contact not found"))
        }
      }, 250)
    })
  }
}

export default new ContactService()
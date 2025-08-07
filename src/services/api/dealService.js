import dealsData from "@/services/mockData/deals.json"

class DealService {
  constructor() {
    this.deals = [...dealsData]
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.deals])
      }, 350)
    })
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const deal = this.deals.find(d => d.Id === id)
        if (deal) {
          resolve({ ...deal })
        } else {
          reject(new Error("Deal not found"))
        }
      }, 200)
    })
  }

  async create(dealData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.deals.map(d => d.Id), 0) + 1
        const newDeal = {
          Id: newId,
          ...dealData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        this.deals.push(newDeal)
        resolve({ ...newDeal })
      }, 450)
    })
  }

  async update(id, dealData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.deals.findIndex(d => d.Id === id)
        if (index !== -1) {
          this.deals[index] = {
            ...this.deals[index],
            ...dealData,
            Id: id,
            updatedAt: new Date().toISOString()
          }
          resolve({ ...this.deals[index] })
        } else {
          reject(new Error("Deal not found"))
        }
      }, 400)
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.deals.findIndex(d => d.Id === id)
        if (index !== -1) {
          this.deals.splice(index, 1)
          resolve({ message: "Deal deleted successfully" })
        } else {
          reject(new Error("Deal not found"))
        }
      }, 300)
    })
  }
}

export default new DealService()
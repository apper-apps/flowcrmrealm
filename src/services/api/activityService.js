import activitiesData from "@/services/mockData/activities.json"

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.activities])
      }, 300)
    })
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const activity = this.activities.find(a => a.Id === id)
        if (activity) {
          resolve({ ...activity })
        } else {
          reject(new Error("Activity not found"))
        }
      }, 200)
    })
  }

  async create(activityData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.activities.map(a => a.Id), 0) + 1
        const newActivity = {
          Id: newId,
          ...activityData
        }
        this.activities.push(newActivity)
        resolve({ ...newActivity })
      }, 400)
    })
  }

  async update(id, activityData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.activities.findIndex(a => a.Id === id)
        if (index !== -1) {
          this.activities[index] = {
            ...this.activities[index],
            ...activityData,
            Id: id
          }
          resolve({ ...this.activities[index] })
        } else {
          reject(new Error("Activity not found"))
        }
      }, 350)
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.activities.findIndex(a => a.Id === id)
        if (index !== -1) {
          this.activities.splice(index, 1)
          resolve({ message: "Activity deleted successfully" })
        } else {
          reject(new Error("Activity not found"))
        }
      }, 250)
    })
  }
}

export default new ActivityService()
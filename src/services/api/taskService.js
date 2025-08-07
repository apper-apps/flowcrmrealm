import tasksData from "@/services/mockData/tasks.json"

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.tasks])
      }, 250)
    })
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const task = this.tasks.find(t => t.Id === id)
        if (task) {
          resolve({ ...task })
        } else {
          reject(new Error("Task not found"))
        }
      }, 200)
    })
  }

  async create(taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = Math.max(...this.tasks.map(t => t.Id), 0) + 1
        const newTask = {
          Id: newId,
          ...taskData
        }
        this.tasks.push(newTask)
        resolve({ ...newTask })
      }, 350)
    })
  }

  async update(id, taskData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(t => t.Id === id)
        if (index !== -1) {
          this.tasks[index] = {
            ...this.tasks[index],
            ...taskData,
            Id: id
          }
          resolve({ ...this.tasks[index] })
        } else {
          reject(new Error("Task not found"))
        }
      }, 300)
    })
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.tasks.findIndex(t => t.Id === id)
        if (index !== -1) {
          this.tasks.splice(index, 1)
          resolve({ message: "Task deleted successfully" })
        } else {
          reject(new Error("Task not found"))
        }
      }, 200)
    })
  }
}

export default new TaskService()
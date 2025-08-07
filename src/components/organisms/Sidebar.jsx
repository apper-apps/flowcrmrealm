import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Deals", href: "/deals", icon: "Target" },
    { name: "Activities", href: "/activities", icon: "Calendar" },
    { name: "Tasks", href: "/tasks", icon: "CheckSquare" }
  ]

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div 
          className="absolute inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm"
          onClick={onClose}
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-gradient-to-b from-primary-900 via-primary-800 to-purple-900 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Zap" className="w-6 h-6 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-white">FlowCRM</h1>
            </div>
          </div>
          <nav className="mt-2 flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg"
                      : "text-primary-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ApperIcon
                    name={item.icon}
                    className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
                      isActive ? "text-white" : "text-primary-200 group-hover:text-white"
                    }`}
                  />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "tween", duration: 0.3 }}
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary-900 via-primary-800 to-purple-900 overflow-y-auto"
      >
        <div className="flex items-center justify-between flex-shrink-0 px-6 py-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="Zap" className="w-6 h-6 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">FlowCRM</h1>
          </div>
          <button
            onClick={onClose}
            className="text-primary-100 hover:text-white transition-colors"
          >
            <ApperIcon name="X" className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-2 flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-white/20 to-white/10 text-white shadow-lg"
                    : "text-primary-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <ApperIcon
                  name={item.icon}
                  className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${
                    isActive ? "text-white" : "text-primary-200 group-hover:text-white"
                  }`}
                />
                {item.name}
              </NavLink>
            )
          })}
        </nav>
      </motion.div>
    </>
  )
}

export default Sidebar
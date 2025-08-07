import React from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"

const Header = ({ 
  onMenuToggle, 
  title = "Dashboard",
  showSearch = true,
  searchValue = "",
  onSearchChange = () => {},
  children 
}) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-6 py-4 lg:ml-64"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="small"
            onClick={onMenuToggle}
            className="lg:hidden mr-3 p-2"
          >
            <ApperIcon name="Menu" className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 flex-1 max-w-2xl ml-8">
          {showSearch && (
            <div className="flex-1 max-w-md">
              <SearchBar
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Search contacts, deals, activities..."
              />
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            {children}
            
            <Button variant="ghost" size="small" className="p-2 relative">
              <ApperIcon name="Bell" className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></span>
            </Button>
            
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
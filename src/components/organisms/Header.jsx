import React, { useContext } from "react"
import { motion } from "framer-motion"
import { useSelector } from 'react-redux'
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import SearchBar from "@/components/molecules/SearchBar"
import { AuthContext } from '@/App'
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
            
            <UserProfileSection />
          </div>
        </div>
      </div>
    </motion.header>
  )
}

const UserProfileSection = () => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
  const [showDropdown, setShowDropdown] = React.useState(false)

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    }
    return user?.emailAddress?.charAt(0)?.toUpperCase() || 'U'
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="small"
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-1"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
          {getUserInitials()}
        </div>
      </Button>
      
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {user?.emailAddress}
            </div>
          </div>
          <div className="p-1">
            <Button
              variant="ghost"
              size="small"
              onClick={() => {
                logout()
                setShowDropdown(false)
              }}
              className="w-full justify-start text-left p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
      
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  )
}

export default Header
import { motion } from "framer-motion"

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48"></div>
          <div className="h-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-32"></div>
        </div>
        
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-6 space-y-4"
            >
              <div className="h-4 bg-gradient-to-r from-slate-300 to-slate-400 rounded w-3/4"></div>
              <div className="h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-slate-300 to-slate-400 rounded"></div>
                <div className="h-3 bg-gradient-to-r from-slate-300 to-slate-400 rounded w-2/3"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* List skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg"
            >
              <div className="h-12 w-12 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-300 to-slate-400 rounded w-1/3"></div>
                <div className="h-3 bg-gradient-to-r from-slate-300 to-slate-400 rounded w-1/2"></div>
              </div>
              <div className="h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded w-20"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading
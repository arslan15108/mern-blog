import React from 'react';
import Orb from '../Shapes/Orb';
import { motion } from 'motion/react';
import { Users,FileText,Eye,TrendingUp, MessageSquareText, Bookmark } from 'lucide-react';
const StatCard = ({stats,data}) => {
  const colorPalette = ["bg-amber-500/50", "bg-violet-500/50", "bg-teal-500/50", "bg-indigo-500/50"]
  const icons = [FileText, Eye, MessageSquareText, Bookmark];
  
  return (
     <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map((s,i) => {
               const Icon = icons[i % icons.length]; // 🔥 safe indexing
               return (
                  <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{scale:1.05, translateY: -10}}
                  transition={{duration: 0.6}}
                  key={s.label} 
                  className="bg-gray-400/40 dark:bg-black/40 backdrop-blur-sm shadow-gray-400/40 shadow-lg rounded-xl  p-4 relative overflow-hidden p-3">
                    <Orb width="120px" height="120px" bg={colorPalette[i]}  className="-top-10 -right-10 blur-sm/40" />
                     <div className="mb-2">
                      <Icon size={20} className="text-stone-600 dark:text-white" />
                    </div>
                    <p className="text-sm text-stone-500 mb-1 dark:text-white">{s.label}</p>
                    <p className="text-2xl font-semibold text-stone-900 dark:text-amber-400">{s.value}</p>
                    <p className={`text-xs mt-1 ${
                      s.up === true ? "text-emerald-600" :
                      s.up === false ? "text-amber-600" :
                      "text-stone-400"
                    }`}>
                      {s.delta}
                    </p>
                  </motion.div>
               )
          }
            
          )}
        </div>
  )
}

export default StatCard
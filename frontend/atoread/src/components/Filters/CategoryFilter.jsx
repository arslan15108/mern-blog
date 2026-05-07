import React from 'react'
import { Heart, Clock, ChevronDown, ChevronLeft, ChevronRight, Plus, Flame, Folder } from "lucide-react";
const CategoryFilter = React.memo(({categories,activeCategory ,setActiveCategory,setCurrentPage,sortOpen, setSortOpen,sortBy, setSortBy}) => {
  return (
    <div className="flex items-center gap-2 mt-6 flex-wrap">
          <button onClick={() => {setActiveCategory("All");setCurrentPage(1);}}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors 
            ${activeCategory === "All" ? "bg-orange-500 text-white"
                  : "bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] border border-white/5"
            }`}>
                All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat?.name}
              onClick={() => { setActiveCategory(cat?.name.trim()); setCurrentPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat?.name?.trim()
                  ? "bg-orange-500 text-white"
                  : "bg-[#1e1e1e] text-gray-400 hover:bg-[#2a2a2a] border border-white/5"
              }`}
            >
              {cat?.name}
            </button>
          ))}

          {/* Sort */}
          <div className="relative ml-auto">
            <button
              onClick={() => setSortOpen((p) => !p)}
              className="flex items-center gap-2 text-sm text-gray-300 bg-[#1e1e1e] border border-white/5 px-4 py-1.5 rounded-full hover:bg-[#2a2a2a] transition-colors"
            >
              Sort by: <span className="text-white font-medium">{sortBy}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-9 w-40 bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl">
                {["Latest", "Oldest", "Most liked"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setSortOpen(false); setCurrentPage(1); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${sortBy === opt ? "text-orange-400" : "text-gray-300"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
  )
})

export default CategoryFilter
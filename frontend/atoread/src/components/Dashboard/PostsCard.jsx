import React from 'react'
import {motion} from "motion/react";
import { formatDate } from '../../services/dateFormatter';
const PostsCard = React.memo(({filteredPosts,postFilter,setPostFilter}) => {
    
  return (
      <motion.div 
      initial={{opacity: 0, y: 100}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.5, delay: 0.1}}
      className="col-span-2 bg-gray-300/40 rounded-xl border border-stone-100 p-5 dark:bg-black/30 backdrop-blur-sm min-h-[300px] " >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold dark:text-white">My Posts</h2>
              {
                filteredPosts && filteredPosts.length > 0 ? 
                <div className="flex gap-2">
                  {["all", "published", "draft"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setPostFilter(f)}
                      className={`text-sm font-bold tracking-wider px-3 py-1 rounded-lg transition-all capitalize ${
                        postFilter === f
                          ? "bg-stone-900 text-white"
                          : "text-stone-500 hover:bg-stone-100"
                      }`}
                    >
                      {f}
                    </button>
                  )) }
                </div>
                 : <></>
              }
            </div>
              {
                filteredPosts && filteredPosts.length > 0 ? 
                  <div className="divide-y divide-stone-50">
                      {filteredPosts && filteredPosts?.map((post) => (
                        <div key={post._id} className="flex items-center gap-3 py-3 group">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            post.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}>
                            {post.status}
                          </span>
                          <p className="flex-1 text-sm text-stone-800 truncate dark:text-white">{post.title}</p>
                          <span className="text-xs text-stone-400 w-auto text-right shrink-0">{formatDate(post.createdAt)}</span>
                          <span className="text-[11px] text-stone-400 bg-stone-50 px-2 py-0.5 rounded-md shrink-0">{post.category}</span>
                          {/* <span className="text-xs text-stone-400 w-16 text-right shrink-0">{post.views} views</span> */}
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-xs text-stone-500 hover:text-stone-900 px-2 py-1 rounded hover:bg-stone-100">Edit</button>
                            <button className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Delete</button>
                          </div>
                        </div>
                      ))}
                  </div>
                :<h1 className='dark:text-white text-center py-5 mt-12'>No Post Available Right Now!</h1>
              }

      </motion.div>
  )
})

export default PostsCard
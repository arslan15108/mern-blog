import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {StatsData,posts} from "../constant/index";
import { Orb, PostsCard, StatCard } from '../components';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { useDashboardApi } from '../hooks/useDashboardApi';
const Dashboard = () => {
    const {user} = useAuth(); 
    const {data,error,dashboardLoading,getDashboardResponse} = useDashboardApi();
    const [postFilter, setPostFilter] = useState("all");
 
    const filteredPosts =
      postFilter === "all"
        ? data?.posts
        : data?.posts.filter((p) => p.status === postFilter);

  useEffect(()=>{
    getDashboardResponse();
  },[])
  

  return (
    <div className='max-w-[80%] mx-auto px-5 pb-5 pt-8 relative z-10'>
      <motion.div 
      initial={{opacity:0, x: -100}}
      animate={{opacity:1, x: 0}}
      transition={{duration: 0.3}}
      className="flex items-center justify-between mb-8">
          <div>
           <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-1">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
            <h1 className="text-3xl font-bold text-slate-900 mb-1.5 dark:text-amber-400">Good morning, {user?.data?.username} 👋</h1>
            <p className="text-gray-500 text-sm mt-0.5 dark:text-white">Here's what's happening with your blog</p>
          </div>
          <Link
          to={"/new-post"} 
          className="bg-amber-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors flex items-center gap-2">
            <span className="text-base leading-none">
              <Plus size="14" />
              </span> New post
          </Link>
      </motion.div>
      <StatCard stats={StatsData} data={data} />
        <PostsCard postFilter={postFilter} setPostFilter={setPostFilter} filteredPosts={filteredPosts} />
    </div>
  )
}

export default Dashboard
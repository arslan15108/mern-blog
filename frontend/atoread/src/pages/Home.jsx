import React, { useEffect } from 'react';
import { GridPostCard, Hero, Loader } from '../components';
// import {blogs} from "../constant";
import { motion } from 'motion/react';
import { useBlog } from '../hooks/useBlog';
import { Link } from 'react-router';
const Home = () => {
  const {blogs,postLoading,error,getRecentPosts} = useBlog();
  useEffect(()=>{
    getRecentPosts();
  },[])
  
  
    return (
      <>
        {
          postLoading ? Array.from({length:3}).map((_,index)=> <Loader key={index + 1} />) :
          <div className='pb-5 px-5 dark:bg-[#0a0a0a] light:bg-white dark:text-white'>
              <Hero />
              <section id="recent-posts" className="max-w-7xl mx-auto px-6 py-12">
                  <div className="flex items-end justify-between mb-12">
                    <div>
                      <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-muted mb-2">The Latest</h3>
                      <h4 className="text-4xl font-serif">Recent Perspectives</h4>
                    </div>
                    <a href="#archive" className="text-xs uppercase tracking-widest font-bold underline underline-offset-8 hover:decoration-brand-black transition-all">
                      View All Posts
                    </a>
                  </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {
                    blogs?.data?.length > 0 ? (
                      blogs?.data?.map((post, index) => (
                        <motion.article
                              key={post?._id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: index * 0.1 }}
                              className="flex flex-col gap-4 group cursor-pointer dark:bg-black/30 bg-gray-400/30 backdrop-blur-md dark:shadow-amber-300 shadow-sm rounded-md border border-gray-300/20 p-4"
                          >
                            <Link
                              to={`post/${post?.slug}`}
                            >
                              <GridPostCard post={post} />
                            </Link>
                          </motion.article>
                      ))
                      
                    ) : 
                      <h1>No Post Available Right Now!</h1>
                    }
                </div>

        
              </section>
              <section id="newsletter" className="max-w-7xl mx-auto bg-[#0a0a0a] text-white rounded-lg py-24 mb-20">
                <div className="max-w-3xl mx-auto px-6 text-center flex flex-col gap-8">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-60">Stay Informed</h3>
                  <h4 className="text-3xl md:text-4xl font-serif italic leading-tight">
                    Delivering refined perspectives on design and culture to your inbox.
                  </h4>
                  <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto w-full mt-4">
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="flex-grow bg-white/10 border border-white/20 px-6 py-4 rounded-full text-sm placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
                    />
                    <button className="bg-white text-black px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95 whitespace-nowrap">
                      Join Us
                    </button>
                  </div>
                  <p className="text-[11px] opacity-40 italic">
                    Respecting your inbox since 2024. Unsubscribe anytime.
                  </p>
                </div>
              </section>
          </div>
        }
      </>
    )
}

export default Home;
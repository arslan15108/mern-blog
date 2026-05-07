import React from 'react'
import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react';
const Hero = () => {
    const FEATURED_ARTICLE = {
        id: 1,
        title: "The Architecture of Silence: Finding Stillness in Urban Complexity",
        excerpt: "Exploring the intersection of modern minimalist design and the psychological need for sensory reduction in our densest cities.",
        author: "Elena Rossi",
        date: "May 12, 2024",
        category: "Architecture",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    };

  return (
      <section id="featured" className="max-w-7xl mx-auto px-6 py-12 md:py-12 dark:text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="order-2 lg:order-1 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-muted px-2 py-1 bg-brand-gray inline-block">
                  Featured Article
                </span>
                <span className="text-[11px] font-medium text-brand-muted italic md:not-italic underline underline-offset-4 decoration-brand-gray">
                  {FEATURED_ARTICLE.category}
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif leading-[1.1] tracking-tight">
                {FEATURED_ARTICLE.title}
              </h2>
              <p className="text-lg text-brand-muted leading-relaxed max-w-xl">
                {FEATURED_ARTICLE.excerpt}
              </p>
              <div className="flex items-center gap-6 mt-4">
                <button className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:gap-4 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </button>
                <div className="h-px w-12 bg-brand-gray"></div>
                <div className="text-[11px] text-brand-muted">
                  By <span className="text-brand-black font-semibold">{FEATURED_ARTICLE.author}</span> • {FEATURED_ARTICLE.date}
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/3] group overflow-hidden bg-brand-gray">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src={FEATURED_ARTICLE.image}
                alt={FEATURED_ARTICLE.title}
                className="w-full h-full object-cover grayscale-[0.2] transition-all group-hover:grayscale-0"
              />
            </div>
          </motion.div>
     </section>
  )
}

export default Hero
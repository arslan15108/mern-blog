import React from 'react';
import { motion } from 'motion/react';
import { formatDate } from '../../services/dateFormatter';
import { getExcerpt } from '../../services/ExcertCreation';
import { Link } from 'react-router';

const GridPostCard = React.memo(({ post }) => {
  return (
    <>
      <div className="relative aspect-[3/2] overflow-hidden bg-brand-gray mb-2">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
        />
        <div className="absolute top-4 left-4">
          <span className="text-[11px] dark:text-amber-500 uppercase tracking-widest font-bold bg-white px-2 py-1">
            {post?.category}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] text-brand-muted uppercase font-bold tracking-tighter">
        <span>{formatDate(post?.createdAt)}</span>
        <span className="w-1 h-1 rounded-full bg-brand-muted" />
        <span className='text-amber-500 font-bold tracking-wider'>{post?.owner?.username}</span>
      </div>

      <div>
        <h5 className="text-xl font-serif font-bold group-hover:underline underline-offset-4 decoration-1">
          {post.title}
        </h5>
        <p className="text-sm text-brand-muted line-clamp-3 leading-relaxed">
          {
            getExcerpt(post?.description,25)
          }
        </p>
      </div>
      <button
        className='text-blue-400 group-hover:underline'
      >
          Read More
      </button>
    </>
  );
});

GridPostCard.displayName = "GridPostCard";
export default GridPostCard;
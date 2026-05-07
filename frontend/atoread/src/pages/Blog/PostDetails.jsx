import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../services/axios";
import { Loader } from "../../components";
import { useBlog } from "../../hooks/useBlog";
import { Heart, HeartIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import { scale, motion } from "motion/react";

import { useAuth } from "../../context/AuthContext";

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const { postLoading, getPostDetails, handleLike } = useBlog();
  const { user } = useAuth(); // ✅ Get the current logged-in user

  const [isLiked, setIsLiked] = useState(false);
  const [postCount,setPostCount] = useState(0)

  // 1. Initialize from server data when post loads
  useEffect(() => {
    const fetchPost = async (slug) => {
      try {
        const res = await getPostDetails(slug);
        if (res?.data) {
          setPost(res.data);
          setPostCount(res?.data?.likesCount)
          // ✅ Since the backend GET route is public, it doesn't know who is requesting.
          // We must check if the current user's ID exists in the returned `likes` array.
          const userHasLiked = res.data.likes?.includes(user?._id) || res.data.likes?.includes(user?.data?._id);
          setIsLiked(userHasLiked);
        }
      } catch (err) {
        console.error("Post not found", err);
      }
    };
    fetchPost(slug);
  }, [slug, user]);

  // 2. Optimistic UI for instant feedback
  const handleLikePost = async (val) => {
    // 1. Instantly toggle UI
    setIsLiked(prev => !prev);
    if (val === "false") {
        setPostCount((postcount)=> postcount - 1);
    }
    else {
      setPostCount((postcount) => postcount + 1);
    }
    // 2. Call API in background
    const response = await handleLike(slug);

    // 3. Revert if failed or sync actual state
    if (response?.isLiked !== undefined) {
      setIsLiked(response.isLiked);
    }
   


  };


  if (!post) return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Post not found.
    </div>
  );

  const readTime = Math.ceil(post.description.split(" ").length / 200);
  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-[500px] pb-8 relative z-10">
      {
        postLoading ? Array.from({ length: 3 }).map((_, index) => <Loader key={index + 1} />) :
          <main className="max-w-5xl mx-auto px-4">

            {/* Category pill */}
            <span className="inline-block text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 mb-5">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="dark:text-amber-400 font-serif text-4xl font-semibold leading-tight text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Author + meta */}
            <div className="flex justify-between items-center gap-3 mb-8 pb-6 border-b border-gray-400/30">
              <div className="flex items-center gap-3">
                <img
                  src={post.owner?.avatar}
                  alt={post.owner?.fullName}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.owner?.fullName}
                  </span>
                  <span className="text-xs text-gray-400">
                    @{post.owner?.username} · {formattedDate}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 items-center">

                {
                  user && (
                    isLiked ?
                      <motion.button
                        onClick={() => handleLikePost("false")}
                        whileHover={{ scale: 1.01, translateY: -3 }}
                        transition={{ type: "spring", duration: 0.7, ease: "easeInOut" }}
                        className="flex items-center gap-2 ml-auto text-sm bg-red-500 text-white shadow-amber-400 shadow-sm px-3 py-1 rounded-md cursor-pointer  group">
                        <ThumbsUp className="w-4 h-4" />
                        Liked
                      </motion.button>
                      :
                      <motion.button
                        onClick={() => handleLikePost("true")}
                        whileHover={{ scale: 1.01, translateY: -3 }}
                        transition={{ type: "spring", duration: 0.7, ease: "easeInOut" }}
                        className="flex items-center gap-2 ml-auto text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-md cursor-pointer  group">
                        <Heart className="w-4 h-4 group-hover:text-red-500" />
                        Like
                      </motion.button>
                  )
                }
                <span className="dark:text-white">{postCount} {postCount === 1 ? "Like" : "Likes"}</span>
              </div>
            </div>

            {/* Hero image */}
            <img
              src={post.image}
              alt={post.title}
              className="w-full aspect-video object-cover rounded-xl mb-8"
            />

            {/* Body */}
            <article className="font-serif text-[1.075rem] leading-[1.85] text-gray-800 dark:text-white/70 space-y-5">
              {post.description.split(". ").reduce((acc, sentence, i, arr) => {
                if (i % 3 === 0) {
                  acc.push(arr.slice(i, i + 3).join(". ") + (i + 3 < arr.length ? "." : ""));
                }
                return acc;
              }, []).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </article>

            {/* Divider */}
            <div className="my-10 border-t border-gray-400/40" />

            {/* Share */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm text-gray-400">Share this article</span>
              <div className="flex gap-2">
                {["Twitter", "LinkedIn", "Copy link"].map((label) => (
                  <button
                    key={label}
                    className="text-xs font-medium px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors dark:text-white"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

          </main>
      }

    </div>
  );
};

export default BlogDetail;
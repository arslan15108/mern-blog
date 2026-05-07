import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useBlog } from "../hooks/useBlog";
import { Heart, Clock, ChevronDown, ChevronLeft, ChevronRight, Plus, Flame, Folder } from "lucide-react";
import { CategoryFilter, GridPostCard } from "../components";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const readTime = (text = "") => Math.ceil(text.split(" ").length / 200);



const categoryIcons = [ "💻","🏠", "✈️","💼","❤️","🎓"];

const Blogs = () => {
  const navigate = useNavigate();
  const { blogs, getBlogs, postLoading, error } = useBlog();

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [email, setEmail] = useState("");

  useEffect(() => {
    getBlogs();
  }, []);

  // normalize posts array from whatever shape useBlog returns
  const allPosts = Array.isArray(blogs)
    ? blogs
    : blogs?.posts ?? blogs?.data?.posts ?? [];

  const categories = Array.isArray(blogs) ? blogs?.categories : blogs?.posts?.categories ?? blogs?.data?.categories ?? [];
  
  
  
  const filtered = allPosts.filter(
    (p) => activeCategory === "All" || p.category?.trim() === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Latest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "Oldest") return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === "Most liked") return (b.likesCount ?? b.likes?.length ?? 0) - (a.likesCount ?? a.likes?.length ?? 0);
    return 0;
  });

  const PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const pagePosts = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // popular posts — top 5 by likes
  const popularPosts = [...allPosts]
    .sort((a, b) => (b.likesCount ?? b.likes?.length ?? 0) - (a.likesCount ?? a.likes?.length ?? 0))
    .slice(0, 5);

  // category counts
  const categoryCounts = categories?.filter((c) => c !== "All")

  

  return (
    <div className="min-h-screen dark:bg-[#111111] dark:text-white -mt-[100px] pt-16 z-[10]">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">All Posts</h1>
            <p className="text-gray-400 mt-1 text-sm">
              Discover stories, insights, and ideas from our community of writers.
            </p>
          </div>
          <button
            onClick={() => navigate("/new-post")}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-medium px-5 py-2.5 rounded-lg text-sm"
          >
            <Plus className="w-4 h-4" />
            Write a Post
          </button>
        </div>

        {/* ── Category Filters ── */}
        <CategoryFilter 
        categories={categories}
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory} 
        setCurrentPage={setCurrentPage}
        setSortOpen={setSortOpen}
        sortOpen={sortOpen}
        setSortBy={setSortBy}
        sortBy={sortBy}
        />
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 pb-16 grid lg:grid-cols-[1fr_320px] gap-8">

        {/* ── Blog List ── */}
        <div>
          {postLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-36 rounded-2xl bg-[#1a1a1a] animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="text-red-400 text-center py-16">{String(error)}</div>
          )}

          {!postLoading && pagePosts.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No posts found in this category.
            </div>
          )}

          <div className="space-y-4 grid grid-cols-2 gap-4">
            {pagePosts?.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(`/post/${post.slug}`)}
                className="group cursor-pointer dark:bg-black/30 bg-gray-400/30 backdrop-blur-md dark:shadow-amber-300 shadow-sm rounded-md border border-gray-300/20 p-4"
              >
                <GridPostCard post={post} />
              </motion.article>
            ))}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1e1e1e] border border-white/5 text-gray-400 hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-orange-500 text-white"
                      : "bg-[#1e1e1e] border border-white/5 text-gray-400 hover:bg-[#2a2a2a]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#1e1e1e] border border-white/5 text-gray-400 hover:bg-[#2a2a2a] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-6">

          {/* Popular Posts */}
          <div className="dark:bg-[#1a1a1a] bg-linear-to-tr from-amber-400/20 to-indigo-400/20 border border-white/5 rounded-2xl p-5 ackdrop-blur-md shadow-indigo-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-orange-500" />
              <h4 className="font-bold dark:text-white text-sm">Popular Posts</h4>
            </div>
            <div className="space-y-4">
              {popularPosts.map((post) => (
                <div
                  key={post._id}
                  onClick={() => navigate(`/post/${post.slug}`)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-14 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm dark:text-white font-medium leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                      <Heart className="w-3 h-3" />
                      {post.likesCount ?? post.likes?.length ?? 0} likes
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="dark:bg-[#1a1a1a] bg-linear-to-tr from-amber-400/20 to-indigo-400/20 border border-white/5 rounded-2xl p-5 ackdrop-blur-md shadow-indigo-400/20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Folder className="w-4 h-4 dark:text-orange-500" />
              <h4 className="font-bold dark:text-amber-400 text-sm">Categories</h4>
            </div>
            <div className="space-y-1">
              {categoryCounts?.map((cat,i) => (
                <button
                  key={cat?.name}
                  onClick={() => { setActiveCategory(cat?.name); setCurrentPage(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-indigo-500 transition-colors capitalize">
                    <span>{categoryIcons[i]}</span>
                    {cat?.name}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {String(cat?.count).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Stay Updated */}
          <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-5">
            <h4 className="font-bold text-white text-sm mb-1">Stay Updated</h4>
            <p className="text-gray-500 text-xs mb-4 leading-relaxed">
              Subscribe to our newsletter for the latest blogs and updates.
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-[#111111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 outline-none focus:border-orange-500/50 transition-colors mb-3"
            />
            <button className="w-full bg-orange-500 hover:bg-orange-600 transition-colors text-white text-sm font-medium py-2 rounded-lg">
              Subscribe
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
};

export default Blogs;
// pages/NotFound.jsx
import { useNavigate } from "react-router";
import { motion } from "motion/react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative px-4 -mt-[100px]">

      {/* background orbs */}
      <div className="absolute w-80 h-80 rounded-full bg-emerald-400 opacity-5 -top-20 -left-16 animate-[orb1_8s_ease-in-out_infinite]" />
      <div className="absolute w-60 h-60 rounded-full bg-amber-400 opacity-5 -bottom-10 -right-10 animate-[orb2_10s_ease-in-out_infinite]" />

      <div className="text-center relative z-10">

        {/* tag */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-block text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10 text-gray-400 mb-6"
        >
          error · page not found
        </motion.span>

        {/* 404 */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
          className="text-[9rem] font-serif font-medium leading-none tracking-tighter text-gray-900 dark:text-white animate-[float_4s_ease-in-out_infinite]"
        >
          404
        </motion.h1>

        {/* message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-lg text-gray-400 mt-2 mb-8 leading-relaxed"
        >
          Looks like this page took a wrong turn
          <br />
          somewhere in the codebase.
        </motion.p>

        {/* buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Go home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/60 text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Go back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
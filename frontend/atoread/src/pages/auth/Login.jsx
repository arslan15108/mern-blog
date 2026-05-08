import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { Input, Orb } from "../../components";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data) => {
    const isEmail = data.identifier.includes("@");

    const payload = {
      ...(isEmail
        ? { email: data.identifier }
        : { username: data.identifier }),
      password: data.password,
    };

    if (!data.identifier || !data.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await login(payload);
      if (res) {
        toast.success(res?.data?.message || "Login successful");
        navigate("/dashboard");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-5 relative overflow-hidden">

      {/* ── Background Glow Orbs ── */}
      {/* <Orb width="500px" height="500px" bg="bg-amber-500/10"  className="-top-40 -left-40" />
      <Orb width="400px" height="400px" bg="bg-amber-700/10"  className="-bottom-20 -right-20" />
      <Orb width="600px" height="300px" bg="bg-orange-900/10" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* ── Left Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex flex-col gap-10 pr-10"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 font-bold text-lg">
              B
            </div>
            <span className="text-white/40 text-xs tracking-widest uppercase">
              Blogfolio
            </span>
          </div>

          {/* Hero Text */}
          <div className="flex flex-col gap-4">
            <p className="text-amber-400 text-xs tracking-[0.15em] uppercase">
              Welcome back
            </p>
            <h1 className="text-5xl font-bold text-white/90 leading-tight">
              Where ideas <br />
              <span className="text-amber-400 italic font-normal">
                find their voice.
              </span>
            </h1>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Sign in to manage your stories, track your readers, and publish what matters most.
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6">
            {[
              { value: "12K+", label: "Writers" },
              { value: "98K+", label: "Articles" },
              { value: "4.9★", label: "Rating" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-0.5">
                <span className="text-amber-400 text-lg font-semibold">{value}</span>
                <span className="text-white/25 text-xs tracking-wide">{label}</span>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="border-l-2 border-amber-500/30 pl-4">
            <p className="text-white/25 text-sm italic leading-relaxed">
              "The scariest moment is always just before you start."
            </p>
            <p className="text-white/15 text-xs mt-2 tracking-wide">— Stephen King</p>
          </div>

          {/* Decorative dots */}
          <div className="flex gap-1.5">
            <div className="w-8 h-0.5 bg-amber-400 rounded-full" />
            <div className="w-4 h-0.5 bg-amber-400/40 rounded-full" />
            <div className="w-2 h-0.5 bg-amber-400/20 rounded-full" />
          </div>
        </motion.div>

        {/* ── Right Panel (Form) ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="w-full bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl p-8 md:p-10"
        >
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white/90 mb-1.5">
              Sign in
            </h2>
            <p className="text-white/35 text-sm">
              Access your dashboard and writing tools
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 text-red-400 text-sm rounded-xl px-4 py-3"
            >
              <span className="text-base">⚠</span>
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            <Input
              label="Email or Username"
              name="identifier"
              register={register}
              error={errors.identifier}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              register={register}
              error={errors.password}
              placeholder="••••••••"
            />

            {/* Forgot Password */}
            <div className="flex justify-end -mt-2">
              <Link
              to={"/"}
                className="text-amber-400/80 text-xs hover:text-amber-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-[#1a1108] font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in →"
              )}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.07]" />
            <span className="text-white/20 text-xs tracking-widest uppercase">or</span>
            <div className="flex-1 h-px bg-white/[0.07]" />
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-white/30">
            Don't have an account?{" "}
            <Link
            to={"/signup"}
              href="/register"
              className="text-amber-400 font-medium hover:text-amber-300 transition-colors"
            >
              Create one free
            </Link>
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default Login;
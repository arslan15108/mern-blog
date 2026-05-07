import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Lock,
  Camera,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import api from '../../services/axios';
import { Input, Orb } from '../../components';
import { Link, useNavigate } from 'react-router';
import { toast } from 'react-toastify';

export default function Register() {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      avatar: null,
      coverImage: null
    }
  });

  React.useEffect(() => {
    register('avatar', { required: 'Please upload a profile avatar' });
    register('coverImage');
  }, [register]);

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === 'avatar') {
          setAvatarPreview(reader.result);
          setValue('avatar', file, { shouldValidate: true });
        } else {
          setCoverPreview(reader.result);
          setValue('coverImage', file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('username', data.username);
    formData.append('email', data.email);
    formData.append('password', data.password);
    if (data.avatar)     formData.append('avatar', data.avatar);
    if (data.coverImage) formData.append('coverImage', data.coverImage);

    try {
      await api.post('users/register', formData);
      setIsSuccess(true);
      navigate("/login");
    } catch (error) {
      toast.error(error);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-18 w-full min-h-screen relative overflow-hidden bg-[#0a0a0a] flex items-center justify-center px-4 py-12">

      {/* ── Orbs ── */}
      <Orb width="500px" height="500px" bg="bg-amber-500/10"  className="-top-40 -left-40" />
      <Orb width="400px" height="400px" bg="bg-amber-700/10"  className="-bottom-20 -right-20" />
      <Orb width="600px" height="300px" bg="bg-orange-900/10" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl"
      >

        {/* ── Cover Image ── */}
        <div
          className="relative h-44 bg-gradient-to-br from-amber-400/20 to-purple-600/20 cursor-pointer group"
          onClick={() => coverInputRef.current?.click()}
        >
          {coverPreview ? (
            <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/30 group-hover:text-white/50 transition-colors gap-2">
              <ImageIcon className="w-7 h-7" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Add Cover Image (Optional)
              </span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="text-white w-6 h-6" />
          </div>
          <input
            type="file"
            ref={coverInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'cover')}
          />
        </div>

        {/* ── Body ── */}
        <div className="px-8 pb-8 -mt-14 relative">

          {/* ── Avatar ── */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-28 h-28 cursor-pointer mb-5"
            onClick={() => avatarInputRef.current?.click()}
          >
            <div className="w-28 h-28 rounded-full border-4 border-[#0a0a0a] bg-zinc-900 overflow-hidden shadow-xl ring-2 ring-white/10">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            <div className="absolute bottom-1 right-1 bg-amber-500 p-1.5 rounded-full shadow-lg border-2 border-[#0a0a0a]">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
            <input
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'avatar')}
            />
          </motion.div>

          {/* Avatar error */}
          {errors.avatar && (
            <p className="text-red-400 text-[10px] font-semibold uppercase tracking-wide mb-4 -mt-3">
              {errors.avatar.message}
            </p>
          )}

          {/* ── Heading ── */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-amber-400 mb-1">Create Account</h1>
            <p className="text-white/35 text-sm">Join our community and start your journey</p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Row: Full Name + Username */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Full Name"
                name="fullName"
                register={register}
                validation={{ required: 'Full name is required' }}
                error={errors.fullName}
                placeholder="John Doe"
                icon={<User className="w-4 h-4" />}
              />
              <Input
                label="Username"
                name="username"
                register={register}
                validation={{ required: 'Username is required' }}
                error={errors.username}
                placeholder="johndoe"
                icon={<span className="text-sm font-bold">@</span>}
              />
            </div>

            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              register={register}
              validation={{ required: 'Email is required' }}
              error={errors.email}
              placeholder="johndoe@gmail.com"
              icon={<Mail className="w-4 h-4" />}
            />

            {/* Password */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              register={register}
              validation={{
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
              }}
              error={errors.password}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* ── Submit ── */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide
                flex items-center justify-center gap-2 transition-all duration-200
                disabled:opacity-40 disabled:cursor-not-allowed shadow-lg
                ${isSuccess
                  ? 'bg-green-500 hover:bg-green-400 text-white shadow-green-600/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-[#1a1108] shadow-amber-600/20'
                }
              `}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Account Created!</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>

          </form>

          {/* ── Footer ── */}
          <p className="mt-6 text-center text-white/30 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 font-medium hover:text-amber-300 transition-colors">
              Sign in
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
}
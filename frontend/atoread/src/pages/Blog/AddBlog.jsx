import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { Image as ImageIcon, PenLine, Tag, FileText, Upload, X, Save } from "lucide-react";
import { Input, Textarea, Orb } from "../../components";
import { useBlog } from "../../hooks/useBlog";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const AddBlog = () => {
  const { createBlog, loading,error } = useBlog();
  console.log(error,"error");
  
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", e.target.files, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e) => {
    e.stopPropagation();
    setImagePreview(null);
    setValue("image", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

const onSubmit = async (data) => {
  const formData = new FormData();
  formData.append("title",       data.title);
  formData.append("description", data.description);
  formData.append("category",    data.category);
  formData.append("image",       data.image[0]);
  formData.append("status",      data.status);

  const res = await createBlog(formData);

  const status = res?.data?.data?.status; // ✅ one consistent path

  if (status === "draft") {
    toast.success("Post saved as a draft!");
    reset();
    setImagePreview(null);
  } else if (status === "published") {
    toast.success(res?.data?.message || "Post Added Successfully!");
    reset();
    setImagePreview(null);
  } else {
    toast.error(error || "Something went wrong while creating the post");
  }
};

  return (
    <div className="w-full min-h-screen  -mt-24 relative overflow-hidden flex items-center justify-center px-4 pb-16 pt-[120px]">

      {/* ── Orbs ── */}
      <Orb width="500px" height="500px" bg="bg-amber-500/10"  className="-top-40 -left-40" />
      <Orb width="400px" height="400px" bg="bg-amber-700/10"  className="-bottom-20 -right-20" />
      <Orb width="600px" height="300px" bg="bg-orange-900/10" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl dark:bg-white/[0.03] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl"
      >

        {/* ── Card Header ── */}
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
              <PenLine className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-400">New Post</h1>
              <p className="text-white/30 text-sm">
                Fill in the details below to publish your story
              </p>
            </div>
          </div>
        </div>

        {/* ── Form Body ── */}
        <form className="px-8 py-7 space-y-6">

          {/* Title */}
          <Input
            label="Title"
            name="title"
            register={register}
            validation={{ required: "Title is required" }}
            error={errors.title}
            placeholder="Give your post a compelling title..."
            icon={<PenLine className="w-4 h-4" />}
          />

          {/* Category */}
          <Input
            label="Category"
            name="category"
            register={register}
            validation={{ required: "Category is required" }}
            error={errors.category}
            placeholder="e.g. Tech, Life, Travel"
            icon={<Tag className="w-4 h-4" />}
          />

          {/* Description */}
          <Textarea
            label="Description"
            name="description"
            id="blogDesc"
            register={register}
            validation={{ required: "Description is required" }}
            error={errors.description}
            placeholder="Write your story here..."
            icon={<FileText className="w-4 h-4" />}
            rows={5}
          />

          {/* Cover Image */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">
              Cover Image
            </p>

            {/* Drop Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative w-full rounded-xl border border-dashed cursor-pointer
                transition-all duration-200 overflow-hidden group
                ${imagePreview
                  ? "border-amber-500/30 h-52"
                  : "border-white/10 hover:border-amber-500/30 h-36"
                }
              `}
            >
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <span className="text-white/70 text-xs font-medium uppercase tracking-wider">
                      Change image
                    </span>
                  </div>
                  {/* Clear button */}
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-3 right-3 w-7 h-7 bg-black/60 hover:bg-red-500/80 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-white/25 group-hover:text-white/50 transition-colors">
                  <ImageIcon className="w-7 h-7" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Click to upload cover image
                  </span>
                  <span className="text-[10px] text-white/20">
                    PNG, JPG, WEBP up to 10MB
                  </span>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            {/* hidden status input */}
            <input 
            type="text"
            name="status"
            className="hidden"
            register={register} 
            />
            {errors.image && (
              <p className="text-red-400 text-[10px] font-semibold uppercase tracking-wide px-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* ── Submit ── */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#1a1108] font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-600/20"
            onClick={handleSubmit((data) => onSubmit({ ...data, status: "published" }))}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#1a1108]/30 border-t-[#1a1108] rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Publish Post
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#1a1108] font-semibold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-600/20"
            type="button"
            onClick={handleSubmit((data) => onSubmit({ ...data, status: "draft" }))}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#1a1108]/30 border-t-[#1a1108] rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Post Draft
              </>
            )}
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
};

export default AddBlog;
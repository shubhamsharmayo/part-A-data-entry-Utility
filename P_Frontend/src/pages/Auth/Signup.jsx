import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaUserShield,
  FaCheckCircle,
  FaEye, FaEyeSlash
} from "react-icons/fa";
import { toast } from "react-toastify";

const apiurl = import.meta.env.VITE_URL

export default function SignUp() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: "Operator",
      permissions: {
        dataEntry: false,
        comparecsv: false,
        csvuploader: false,
        createTemplate: false,
        resultGenerator: false,
      },
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    const response = await axios.post(`${apiurl}/signup`, data)

    if (response.status === 200) {
      toast.success("User Created")
      reset()
    }
  };
const[showPassword,setShowPassword] = useState(false)
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 flex items-center justify-center px-3 mt-[80px]">

      {/* Background Blobs */}
      <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl animate-pulse" />

      <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden h-full max-h-screen flex flex-col">

        <div className="flex flex-col h-full p-.5 md:p-6 overflow-hidden">

          {/* Header - Compact */}
          <div className="text-center mb-4 flex-shrink-0">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
              <FaUserPlus className="text-3xl text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Create User
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              Add a new user to the system
            </p>
          </div>

          {/* Form - Scroll only if absolutely needed, but designed to fit */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto space-y-3.5 pr-1" noValidate>

            {/* Row 1: Username & Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-white">
                  <FaUser className="text-cyan-400" size={16} />
                  Username <span className="text-cyan-400">*</span>
                </label>
                <input
                  {...register("username", { required: "Username is required" })}
                  placeholder="Enter username"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-gray-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  aria-invalid={errors.username ? "true" : "false"}
                />
                {errors.username && <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>}
              </div>

              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-white">
                  <FaPhone className="text-cyan-400" size={16} />
                  Mobile
                </label>
                <input
                  {...register("mobile")}
                  placeholder="Enter mobile number"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-gray-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            {/* Row 2: Email & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-white">
                  <FaEnvelope className="text-cyan-400" size={16} />
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Enter email"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-gray-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div className="relative">
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-white">
                  <FaLock className="text-cyan-400" size={16} />
                  Password <span className="text-cyan-400">*</span>
                </label>
                <input
                  type={showPassword?"text":"password"}
                  {...register("password", { required: "Password is required" })}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder-gray-400 outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  aria-invalid={errors.password ? "true" : "false"}
                />
              <div className="absolute right-4 top-10">
                  {showPassword? <FaEyeSlash onClick={()=>setShowPassword(false)}/>:<FaEye   onClick={()=>setShowPassword(true)}/>}
              </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
              </div>
            </div>

            {/* Row 3: Role */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-white">
                <FaUserShield className="text-cyan-400" size={16} />
                Role
              </label>
              <select
                {...register("role")}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              >
                <option className="text-slate-900" value="Admin">Admin</option>
                <option className="text-slate-900" value="Operator">Operator</option>
              </select>
            </div>

            {/* Permissions - Compact grid */}
            <div>
              <label className="mb-2 text-sm font-semibold text-white flex items-center gap-1.5">
                <FaCheckCircle className="text-cyan-400" size={16} />
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["dataEntry", "Data Entry"],
                  ["comparecsv", "Compare CSV"],
                  ["csvuploader", "CSV Uploader"],
                  ["createTemplate", "Create Template"],
                  ["resultGenerator", "Result Generator"],
                ].map(([value, label]) => (
                  <label key={value} className="group flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 transition hover:bg-white/15">
                    <input type="checkbox" {...register(`permissions.${value}`)} className="h-4 w-4 accent-cyan-500" />
                    <FaCheckCircle className="text-cyan-400 transition group-hover:rotate-12" size={14} />
                    <span className="text-sm text-white">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group relative mt-2 w-full overflow-hidden rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-cyan-500/40 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
              disabled={false}
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center gap-2">
                <FaUserPlus size={18} />
                Create User
              </span>
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}
import React,{useState} from 'react'
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { userData} from '../../context/userData'
import { FaUserCircle, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { toast } from 'react-toastify';



const Login = () => {
    const navigate = useNavigate()
    const {setUser} = userData()
    const [showPassword, setShowPassword] = useState(false);

    const apiurl = import.meta.env.VITE_URL

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
    try {
        const response = await axios.post(`${apiurl}/login`, data)
        console.log(response)

        localStorage.setItem('userdata', JSON.stringify(response.data))
        setUser(JSON.parse(localStorage.getItem('userdata')))
    } catch (error) {
        const errorMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Something went wrong, please try again";

        toast.error(errorMessage);
    }
}

    // console.log(watch("example"))
return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700">

    {/* Animated Background */}
    <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl animate-pulse"></div>

    <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl animate-pulse"></div>

    <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl animate-pulse"></div>

    {/* Login Card */}
    <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-8 shadow-2xl">

      {/* Shine Animation */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shine_6s_linear_infinite]"></div>

      <div className="relative z-10">

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl transition duration-300 hover:scale-110 hover:rotate-6">
            <FaUserCircle className="text-6xl text-white" />
          </div>
        </div>

        {/* <h1 className="text-center text-4xl font-bold text-white">
          Welcome Back
        </h1> */}

        <p className="mb-8 mt-2 text-center text-gray-200">
          Sign in to continue
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          {/* Email */}

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email",
                },
              })}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-gray-300 outline-none transition-all duration-300 focus:scale-[1.02] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-300">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters",
                  },
                })}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 pr-12 text-white placeholder-gray-300 outline-none transition-all duration-300 focus:scale-[1.02] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 transition hover:text-white"
              >
                {showPassword ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>

            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-300">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}

          <button
            type="submit"
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-cyan-500/40 active:scale-95"
          >

            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>

            <span className="relative flex items-center justify-center gap-2">
              <FaSignInAlt />
              Login
            </span>

          </button>

        </form>

      </div>
    </div>
</div>
);
}

export default Login

import React from 'react'
import { useNavigate } from "react-router-dom";
import { useTemplate } from '../../context/templateData';

const CreateTemplate = () => {
  const navigate = useNavigate();
  const { setImage } = useTemplate()


  const handleUpload = (e) => {
    const file = e.target.files[0];
    console.log(file)
    // let form = new FormData()


    if (!file) return;

    const image = URL.createObjectURL(file);
    console.log(image)
    // form.append("image",file)
    // setImage(form)    
    // console.log(form)
    navigate("/imagemapping", {
      state: {
        image,
        file
      },
    });
  };

  return (
    <div className="h-screen pt-[70px] flex items-center justify-center  bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="flex justify-center">
  <label
    htmlFor="imageUpload"
    className="
      group relative overflow-hidden
      flex items-center gap-3
      cursor-pointer
      rounded-xl
      bg-gradient-to-r from-blue-600 to-indigo-600
      px-6 py-3
      font-semibold text-white
      shadow-lg
      transition-all duration-300
      hover:scale-105
      hover:shadow-2xl
      active:scale-95
    "
  >
    {/* Animated shine effect */}
    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>

    {/* Animated icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16V4m0 0l-4 4m4-4l4 4M5 20h14"
      />
    </svg>

    <span className="relative z-10">Upload Image</span>
  </label>

  <input
    id="imageUpload"
    type="file"
    accept="image/*"
    onChange={handleUpload}
    className="hidden"
  />
</div>
    </div>
  );
}

export default CreateTemplate

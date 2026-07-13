import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { userData } from "../../context/userData";
import { useEffectEvent } from "react";


const apiurl = import.meta.env.VITE_URL
const menuItems = [
  {
    name: "Create Template",
    href: "createtemplate",
    permission: "createTemplate",
  },
  {
    name: "CSV Uploader",
    href: "csvuploader",
    permission: "csvuploader",
  },
  {
    name: "Data Entry",
    permission: "dataEntry",
    href: "datamatching",
  },
  // {
  //   name: "CSV Compare",
  //   href: "comparecsv",
  //   permission: "comparecsv",
  // },

  // {
  //   name: "Result Generator",
  //   permission: "resultGenerator",
  //   href: "resultGeneration",
  // },
  // // {
  // //   name: "Part A",
  // //   permission: "resultGenerator",

  // //   href: "PartA",
  // // },

  // //   href: "partA",
  // // },
  // {
  //   name: "Duplicate Check",
  //   permission: "resultGenerator",
  //   href: "merge",
  // },

];

export default function Navbar() {

  const { userDetail, setUser } = userData()
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const mainUrl = location.pathname?.slice(1)?.split("/");
  const [userDatas, setuserDatas] = useState(null);
  // console.log("Context userDetail:", userDetail);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('userdata')))


  }, [])





  useEffect(() => {
    if (userDetail?.user) {
      setuserDatas(userDetail.user);

    }
  }, [userDetail]);

  console.log(userDatas)


  useEffect(() => {
    if (userDatas && Object.keys(userDatas).length !== 0) {
      // if (userDatas.role === "Admin") {
      //   const currentPath =
      //     localStorage.getItem("currentPath") === "/"
      //       ? "imageuploader"
      //       : localStorage.getItem("currentPath");
      //   navigate(currentPath);
      // } else {
      const firstAllowedLink = menuItems.find(
        (item) => userDatas.permissions[item.permission]
      );
      console.log(firstAllowedLink)
      if (firstAllowedLink) {
        const currentPath =
          localStorage.getItem("currentPath") === "/"
            ? firstAllowedLink.href
            : localStorage.getItem("currentPath");

        navigate(currentPath);
      }
    }
    // }
  }, [userDatas]);

  useEffect(() => {
    localStorage.setItem("currentPath", location.pathname);
  }, [location.pathname]);

  const userMenuItems = [
    // {
    //   name: "Profile",
    //   onClick: () => {
    //     navigate("/profile");
    //     setIsUserMenuOpen(false);
    //   },
    // },
    {
      name: "Create User",
      onClick: () => {
        navigate("/signup");
        setIsUserMenuOpen(false);
      },
    },
    // {
    //   name: "All Users",
    //   onClick: () => {
    //     navigate("/all-user");
    //     setIsUserMenuOpen(false);
    //   },
    // },
    // {
    //   name: "Settings",
    //   onClick: () => {
    //     navigate("/settings");
    //     setIsUserMenuOpen(false);
    //   },
    // },
    // {
    //   name: "Logout",
    //   onClick: async () => {
    //     try {
    //       await axios.post(`${apiurl}/users/logout`, {
    //         userId: userDatas.id,
    //       });
    //       localStorage.clear();
    //       setuserDatas({});
    //       // datactx.modifyIslogin(false);
    //       navigate("/");
    //       setIsUserMenuOpen(false);
    //     } catch (error) {
    //       localStorage.clear();
    //       navigate("/");
    //       console.log(error);
    //     }
    //   },
    // },
    {
      name: "Logout",
      onClick: () => {
        localStorage.clear();
        setuserDatas({});
        // datactx.modifyIslogin(false);
        setUser(null)
        navigate("/");
        setIsUserMenuOpen(false);
      },
    },
  ];


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = (event) => {
    event.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isUserMenuOpen && event.target.closest(".user-menu") === null) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isUserMenuOpen]);

  const filteredMenuItems =
    userDatas &&
    menuItems?.filter((item) => {
      if (Object.keys(userDatas).length !== 0) {
        return userDatas?.permissions[item?.permission];
      }
    });

  // console.log(filteredMenuItems)


  return (
    <>
      <div className={`fixed w-full z-10 bg-white backdrop-blur-sm text-black`}>
        <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:px-6 lg:px-8 ${isMenuOpen ? "hidden" : ""}`}>
          <div className="inline-flex items-center space-x-2">
            {/* <img className="h-10 w-auto" src={} alt="Your Company" />  */}
          </div>
          <div className="hidden lg:flex justify-center">
            <ul className="flex items-center gap-3 rounded-full bg-white/70 backdrop-blur-lg px-3 py-2 shadow-xl border border-gray-200">
              {filteredMenuItems?.map((item) => {
                const isActive = mainUrl[0] === item.href;

                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      onClick={() => setIsUserMenuOpen(false)}
                      className={`
              group relative overflow-hidden
              flex items-center justify-center
              rounded-full
              px-5 py-2.5
              font-semibold
              transition-all duration-300 ease-out
              transform
              ${isActive
                          ? "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-lg scale-105"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:-translate-y-1 hover:shadow-md"
                        }
            `}
                    >
                      {/* Shine Effect */}
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"></span>

                      {/* Animated Glow */}
                      <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-blue-500/10"></span>

                      {/* Text */}
                      <span className="relative z-10">{item.name}</span>

                      {/* Bottom Indicator */}
                      {!isActive && (
                        <span className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-3/4"></span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="relative">
            {/* User Card */}
            <button
              onClick={toggleUserMenu}
              className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-md px-4 py-2 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Avatar */}
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-bold text-white">
                {userDatas?.username?.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="text-left">
                <h4 className="font-semibold text-gray-800">
                  {userDatas?.username}
                </h4>
                <p className="text-sm text-gray-500">
                  {userDatas?.role}
                </p>
              </div>

              {/* Dropdown Arrow */}
              <svg
                className={`ml-2 h-5 w-5 text-gray-500 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""
                  }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>

              {/* Shine Effect */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full rounded-2xl"></span>
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-3 w-60 origin-top-right overflow-hidden rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-lg shadow-2xl transition-all duration-300 ${isUserMenuOpen
                  ? "visible translate-y-0 opacity-100 scale-100"
                  : "invisible -translate-y-2 opacity-0 scale-95"
                }`}
            >
              <div className="py-2">
                {userMenuItems
                  .filter((item) =>
                    userDatas?.role === "Admin"
                      ? true
                      : userDatas?.role === "Moderator"
                        ? item.name !== "Create User"
                        : item.name === "Profile" || item.name === "Logout"
                  )
                  .map((item) => (
                    <button
                      key={item.name}
                      onClick={item.onClick}
                      className="
              group flex w-full items-center justify-between
              px-5 py-3
              text-left
              text-gray-700
              transition-all duration-300
              hover:bg-blue-50
              hover:text-blue-700
              hover:pl-7
            "
                    >
                      <span>{item.name}</span>

                      <span className="opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
          <div className="lg:hidden order-first">
            {/* <TiThMenu
              onClick={toggleMenu}
              className="h-6 w-6 cursor-pointer text-blue-700"
            /> */}
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 w-[40vw] h-[100vh] bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="">
                    {/* <img className="h-10 w-auto" src={logo} alt="Your Company" /> */}
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-full"
                      onClick={toggleUserMenu}
                    >
                      <FaCircleUser className="w-7 h-7 text- mt-1 text-indigo-700" />
                    </button>
                    {userDatas?.role === "Admin"
                      ? isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 user-menu">
                          <div className="py-1">
                            {userMenuItems?.map((item) => (
                              <button
                                key={item.name}
                                onClick={() => {
                                  item.onClick();
                                  setIsMenuOpen(!isMenuOpen);
                                }}
                                className="block px-4 py-2 text-md font-medium text-gray-600 hover:bg-gray-300 w-full text-left"
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                      : isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 user-menu">
                          <div className="py-1">
                            {userMenuItems
                              .filter((item) => item.name === "Logout" || item.name === "Profile")
                              .map((item) => (
                                <button
                                  key={item.name}
                                  onClick={() => {
                                    item.onClick();
                                    setIsMenuOpen(!isMenuOpen);
                                  }}
                                  className="block px-4 py-2 text-md font-medium text-gray-600 hover:bg-gray-300 w-full text-left"
                                >
                                  {item.name}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                  </div>
                  <div className="order-first">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <span className="sr-only">Close menu</span>
                      <RxCross2 className="h-8 w-8 text-gray-700" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-10 flex">
                  <nav className="grid gap-y-4">
                    <ul className="mx-2">
                      {userDatas?.role === "Admin"
                        ? menuItems?.map((item) => {
                          const active = mainUrl[0] === item.href
                            ? "bg-gray-200 text-teal-500 duration-1000 transition-colors ease-in-out"
                            : "";
                          return (
                            <li key={item.name} className="my-3">
                              <Link
                                to={item.href}
                                onClick={() => {
                                  setIsUserMenuOpen(false);
                                  setIsMenuOpen(!isMenuOpen);
                                }}
                                className={`text-lg px-2 rounded-md py-1 font-semibold text-gray-700 no-underline hover:text-teal-500 ${active}`}
                              >
                                {item.name}
                              </Link>
                            </li>
                          );
                        })
                        : filteredMenuItems?.map((item) => {
                          const active = mainUrl[0] === item.href
                            ? "bg-gray-200 text-teal-500 duration-1000 transition-colors ease-in-out"
                            : "";
                          return (
                            <li key={item.name} className="my-3">
                              <NavLink
                                to={item.href}
                                className={`text-lg px-2 rounded-md py-1 font-semibold text-gray-700 no-underline hover:text-teal-500 ${active}`}
                                onClick={() => {
                                  setIsUserMenuOpen(false);
                                  setIsMenuOpen(!isMenuOpen);
                                }}
                              >
                                {item.name}
                              </NavLink>
                            </li>
                          );
                        })}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>

  );
}

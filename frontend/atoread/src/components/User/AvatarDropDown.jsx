import React,{useState,useRef,useEffect} from "react";
import { useNavigate } from "react-router";

const AvatarDropdown = React.memo(({align = "center",user,handleLogout}) => {

  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
 
  

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
 
  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpen((v) => !v)}
        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ring-2 ring-offset-2 ${
          open
            ? "ring-violet-500 bg-violet-500 text-white"
            : "ring-transparent bg-violet-100 text-violet-700 hover:ring-violet-300"
        }`}
      >
        {
          user?.avatar || user?.data?.avatar ? (
            <img className="w-full h-full rounded-full object-cover" src={user?.avatar || user?.data?.avatar} />
          ) : user.username || user?.data?.name
        }
      </div>
 
      {open && (
        <div
          className={`absolute top-full mt-2 w-52 bg-white border border-stone-100 rounded-xl shadow-lg shadow-stone-200/60 z-50 overflow-hidden ${
            align === "right"  ? "right-0" :
            align === "center" ? "left-1/2 -translate-x-1/2" :
            "left-0"
          }`}
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-stone-50">
            <p className="text-sm font-medium text-stone-900">{user.fullName || user?.data?.fullName}</p>
            <p className="text-xs text-stone-400 mt-0.5">{user.username || user?.data?.username}</p>
          </div>
 
          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => {setOpen(false); navigate("/profile")}}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors text-left"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
                <path d="M2 13c0-3.04 2.462-5.5 5.5-5.5S13 9.96 13 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Profile
            </button>
 
            <div className="mx-3 my-1 border-t border-stone-50" />
 
            <button
              onClick={() => {setOpen(false); handleLogout();}}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M5 2H2.5A1.5 1.5 0 001 3.5v8A1.5 1.5 0 002.5 13H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M10 10l3-2.5L10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 7.5h7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
)
export default AvatarDropdown;
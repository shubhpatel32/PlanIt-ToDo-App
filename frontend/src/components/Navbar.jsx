import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { Link } from "react-router-dom";
import { User } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-800 text-white p-4 md:px-8 flex justify-between fixed w-full">
      <Link to="/" className="flex items-center space-x-0 text-xl font-bold">
        <img src="/logo.svg" alt="PlanIt Logo" className="w-8 h-8" />
        <span>PlanIt</span>
      </Link>

      <div className="flex justify-center">
        {user ? (
          <>
            <Link to="/profile" className="mr-2 px-2 py-1 ">
              <User />
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

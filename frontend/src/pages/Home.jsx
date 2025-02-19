import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Home = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center pt-28 min-h-screen bg-gray-100">
      <h1 className="text-2xl md:text-4xl text-center font-bold mb-4">
        PlanIt: Plan Smart, Get Things Done!
      </h1>
      <p className="text-lg mb-6">Manage your tasks efficiently.</p>

      {user ? (
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-semibold">Hi, {user?.username}</h2>
          <Link
            to="/dashboard"
            className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-500  hover:bg-blue-600 text-white rounded"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;

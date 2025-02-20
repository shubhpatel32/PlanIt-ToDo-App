import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos } from "../redux/slices/todoSlice";
import TodoList from "../components/TodoList";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items = [], loading } = useSelector((state) => state.todos);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const filteredTodos = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();

    const results = items.filter((item) => {
      const title = item.title.toLowerCase();
      const description = item.description.toLowerCase();
      const matchesSearchTerm =
        title.includes(lowerSearchTerm) ||
        description.includes(lowerSearchTerm);
      const matchesStatus = statusFilter
        ? item.status.toLowerCase() === statusFilter.toLowerCase()
        : true;
      return matchesSearchTerm && matchesStatus;
    });

    return results;
  }, [items, searchTerm, statusFilter]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen pt-24 md:px-20 lg:px-30">
      <h2 className="text-3xl font-bold mb-4 text-center">Your Tasks</h2>
      <div className="flex flex-col md:flex-row justify-center md:justify-between mt-8 gap-4 md:gap-0">
        <button
          onClick={() => navigate("/todo/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Add Task
        </button>
        <input
          type="search"
          placeholder="Search by title or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full md:w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETE">Complete</option>
          <option value="EXPIRED">Expired</option>
          <option value="IN_PROGRESS">In Progress</option>
        </select>
      </div>

      {loading ? (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4 pt-8">
          {[...Array(4)].map((_, index) => (
            <li
              key={index}
              className="flex flex-col bg-white p-4 mb-2 shadow-md rounded-lg"
            >
              <Skeleton height={20} width="60%" />
              <Skeleton count={2} height={15} className="mt-2" />
              <Skeleton height={15} width="40%" className="mt-2" />
              <div className="flex gap-2 mt-4">
                <Skeleton height={30} width={60} />
                <Skeleton height={30} width={60} />
              </div>
            </li>
          ))}
        </ul>
      ) : filteredTodos.length > 0 ? (
        <TodoList todos={filteredTodos} />
      ) : searchTerm || statusFilter ? (
        <p className="text-center text-xl text-gray-600 mt-6">No match found</p>
      ) : items.length === 0 ? (
        <p className="text-center text-xl text-gray-600 mt-6">
          No tasks available
        </p>
      ) : (
        <TodoList todos={items} />
      )}
    </div>
  );
};

export default Dashboard;

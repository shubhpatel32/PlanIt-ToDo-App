import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo, fetchTodos } from "../redux/slices/todoSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function TodoAdd({ refreshTodos }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(addTodo(task));
      await dispatch(fetchTodos());
      toast.success("Task added successfully!");
      setTask({ title: "", description: "", deadline: "" });
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to add task!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-24 pb-6">
      <div className="bg-white p-8 rounded-lg shadow-md md:w-96 w-80">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Add New Task
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col">
            <label htmlFor="title" className="text-gray-700 font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 mt-1"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-700 font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mt-1"
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
              required
              rows="3"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="deadline" className="text-gray-700 font-medium">
              Deadline
            </label>
            <input
              type="datetime-local"
              id="deadline"
              className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 mt-1"
              value={task.deadline}
              onChange={(e) => setTask({ ...task, deadline: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg transition-all hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Adding" : "Add Task"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg transition-all hover:bg-gray-500 "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

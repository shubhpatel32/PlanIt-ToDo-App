import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTaskById, updateTodo } from "../redux/slices/todoSlice";
import moment from "moment";
import { toast } from "react-toastify";

export default function TodoEdit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    dispatch(fetchTaskById(id)).then((action) => {
      const task = action.payload;

      const formatDateForInput = (date) => {
        return moment(date).format("YYYY-MM-DDTHH:mm");
      };

      const formattedDeadline = task.deadline
        ? formatDateForInput(task.deadline)
        : "";

      setEditedTask({
        title: task.title,
        description: task.description,
        deadline: formattedDeadline,
        status: task.status,
      });
    });
  }, [id, dispatch]);

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(updateTodo({ id, ...editedTask }));

      if (updateTodo.fulfilled.match(response)) {
        toast.success("Task updated successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Failed to update task!");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Error updating task!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-24 pb-6">
      <div className="bg-white p-8 rounded-lg shadow-md md:w-96 w-80">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Edit Task
        </h1>

        <form onSubmit={saveChanges} className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-gray-700 font-medium">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={editedTask.title}
              onChange={handleChange}
              className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-gray-700 font-semibold"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={editedTask.description}
              onChange={handleChange}
              className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 resize-none"
              rows="3"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="deadline" className="text-gray-700 font-semibold">
              Deadline
            </label>
            <input
              type="datetime-local"
              name="deadline"
              id="deadline"
              value={editedTask.deadline}
              onChange={handleChange}
              className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-gray-700 font-semibold">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={editedTask.status}
              onChange={handleChange}
              className="border p-3 w-full rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
            >
              <option value="ACTIVE">Active</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETE">Complete</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg transition-all hover:bg-blue-700 "
            >
              Save Changes
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

import { useSelector, useDispatch } from "react-redux";
import { deleteTodoAsync } from "../redux/slices/todoSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function TodoList({ todos }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/todo/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTodoAsync(id));
      toast.success("Task deleted successfully!");
    }
  };

  return (
    <section className="py-4 pt-8">
      {todos.length === 0 ? (
        <p className="text-gray-500 text-xl text-center">No tasks available.</p>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="flex flex-col bg-white p-6 shadow-md rounded-xl hover:shadow-xl transition-all duration-300 ease-in-out"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between items-center">
                <div className="flex flex-col items-center sm:items-start">
                  <h3 className="text-[1.5rem] font-semibold text-gray-800 transition-colors duration-200">
                    {todo.title}
                  </h3>
                  <p className="text-gray-600 text-[1.1rem] mt-2">
                    {todo.description}
                  </p>
                  <p className="text-[1.1rem] text-gray-500 mt-2">
                    {todo.deadline}
                  </p>
                  <p
                    className={`text-[1.1rem] font-bold mt-2 ${
                      todo.status === "COMPLETE"
                        ? "text-green-600"
                        : todo.status === "IN_PROGRESS"
                        ? "text-yellow-400"
                        : todo.status === "EXPIRED"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    Status: {todo.status}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap mt-4 md:mt-0">
                  {todo.status !== "EXPIRED" && todo.status !== "COMPLETE" && (
                    <button
                      onClick={() => handleEdit(todo._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

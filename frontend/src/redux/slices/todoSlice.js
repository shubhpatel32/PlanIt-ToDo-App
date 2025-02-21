import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/api/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedTodos = response.data.map((todo) => ({
        ...todo,
        deadline: todo.deadline
          ? moment.utc(todo.deadline).local().format("Do MMM, YYYY hh:mm A")
          : "",
      }));

      return formattedTodos;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch todos");
    }
  }
);

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (todoData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const formattedDeadline = todoData.deadline
        ? moment(todoData.deadline).utc().format()
        : null;

      const response = await axios.post(
        `${API_URL}/api/todos`,
        { ...todoData, deadline: formattedDeadline },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add todo");
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (
    { id, title, description, deadline, status },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = getState().auth.token;

      const formattedDeadline = deadline
        ? moment(deadline).utc().format()
        : null;
      const response = await axios.put(
        `${API_URL}/api/todos/${id}`,
        { title, description, deadline: formattedDeadline, status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update todo"
      );
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  "todos/fetchById",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

export const deleteTodoAsync = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${API_URL}/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete todo");
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((todo) => todo._id !== action.payload);
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.editedTask = action.payload;
      });
  },
});

export default todoSlice.reducer;

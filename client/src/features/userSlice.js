import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";
import toast from "react-hot-toast";

const initialState = {
  value: null,
  loading: false,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async (token) => {
  const res = await api.get("/api/user/data", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
});

export const updateUser = createAsyncThunk(
  "user/update",
  async ({ userData, token }) => {
    const res = await api.post("/api/user/update", userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data.success) {
      toast.success(res.data.message);
      return res.data.user;
    } else {
      toast.error(res.data.message);
      return null;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.value = action.payload;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.value = action.payload;
      });
  },
});

export default userSlice.reducer;

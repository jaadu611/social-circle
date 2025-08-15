import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessages: (state, action) => {
      const newMsg = action.payload;
      // Ignore duplicates
      if (!state.messages.some((m) => m._id === newMsg._id)) {
        state.messages.push(newMsg);
      }
    },
    resetMessages: (state) => {
      state.messages = [];
    },
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },
  },
});

export const { addMessages, resetMessages, setMessages } =
  messagesSlice.actions;
export default messagesSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    addBookmark: (state, action) => {
      state.value.push(action.payload);
    },
    removeBookmark: (state, action) => {
      state.value = state.value.filter(
        (bookmark) => bookmark.title !== action.payload.title
      );
    },
    removeAllBookmarks: (state) => {
      state.value = [];
    },
    getUserBookmarksFromDB: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const {
  addBookmark,
  removeBookmark,
  removeAllBookmarks,
  getUserBookmarksFromDB,
} = bookmarksSlice.actions;
export default bookmarksSlice.reducer;

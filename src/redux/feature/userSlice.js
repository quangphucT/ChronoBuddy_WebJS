import { createSlice } from "@reduxjs/toolkit";

const initialState = null;
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveInformation: (state, action) => (state = action.payload),
    removeInformation: () => initialState,
  },
});
export const { saveInformation, removeInformation } = userSlice.actions;
export default userSlice.reducer;

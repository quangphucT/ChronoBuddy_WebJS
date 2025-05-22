import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./feature/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

// ✅ Cấu hình redux-persist cho từng slice
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // ✅ Lưu cả user và balance
};

// ✅ Kết hợp reducers
const rootReducer = combineReducers({
  user: userSlice,
});

// ✅ Bọc rootReducer bằng persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Tắt cảnh báo serialize của redux-persist
    }),
});

// ✅ Khởi tạo persistor để quản lý state đã lưu
export const persistor = persistStore(store);

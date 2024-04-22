import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
    reducer: {},
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
    devTools: true,
});

export default store;

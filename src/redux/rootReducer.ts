import { baseApi } from "./api/baseApi";
import imageReducer from "./slice/imageSlice";
import pageReloadReducer from "./slice/reloadSlice"
import chatReducer from "./slice/chatSlice"



export const reducer = {
    imageUrl: imageReducer,
    pageReload: pageReloadReducer,
    chat: chatReducer,
    [baseApi.reducerPath]: baseApi.reducer,
}


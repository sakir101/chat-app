import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const Message_URL = "/message";

export const messageApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        fetchUsers: build.query({
            query: (id) => ({
                url: `${Message_URL}/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.message],
        }),

        fetchMessages: build.query({
            query: ({ id, receiverId }) => ({
                url: `${Message_URL}/get-message/${id}/${receiverId}`,
                method: "GET",
            }),
            providesTags: [tagTypes.message],
        }),

        sendMessage: build.mutation({
            query: ({ id, data, receiverId }) => ({
                url: `${Message_URL}/send-message/${id}/${receiverId}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.message],
        }),


    }),
});

export const {
    useFetchUsersQuery,
    useFetchMessagesQuery,
    useSendMessageMutation,
} = messageApi;

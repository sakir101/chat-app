import { tagTypes } from "../tag-types"
import { baseApi } from "./baseApi"


const User_URL = "/user"
export const userApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        signUpUser: build.mutation({
            query: (data) => ({
                url: '/auth/signup',
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.user]
        }),
        getSingleUser: build.query({
            query: (id: string | string[] | undefined) => ({
                url: `${User_URL}/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.user],
        }),
        getUsers: build.query({
            query: (arg: Record<string, any>) => {
                return {
                    url: `${User_URL}`,
                    method: "GET",
                    params: arg,
                };
            },
            providesTags: [tagTypes.user]
        }),
    }),
})

export const {
    useSignUpUserMutation,
    useGetSingleUserQuery,
    useGetUsersQuery
} = userApi
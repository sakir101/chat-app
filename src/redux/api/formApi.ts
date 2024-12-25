import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

const Form_URL = "/form";

export const formApi = baseApi.injectEndpoints({
    endpoints: (build) => ({

        createForm: build.mutation({
            query: (data) => ({
                url: `${Form_URL}`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.form],
        }),

        getForms: build.query({
            query: (arg: Record<string, any>) => {
                return {
                    url: `${Form_URL}`,
                    method: "GET",
                    params: arg,
                };
            },
            providesTags: [tagTypes.user]
        }),

        getFormData: build.query({
            query: (id) => ({
                url: `${Form_URL}/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.form],
        }),

        updateForm: build.mutation({
            query: ({ id, data }) => ({
                url: `${Form_URL}/${id}`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.form],
        }),

        addField: build.mutation({
            query: ({ id, fieldData }) => ({
                url: `${Form_URL}/addField/${id}`,
                method: "PATCH",
                data: fieldData,
            }),
            invalidatesTags: [tagTypes.form],
        }),

        deleteField: build.mutation({
            query: ({ id, fieldIndex, fieldType }) => ({
                url: `${Form_URL}/deleteField/${id}`,
                method: "PATCH",
                data: { fieldIndex, fieldType },
            }),
            invalidatesTags: [tagTypes.form],
        }),

        updateField: build.mutation({
            query: ({ id, fieldIndex, fieldData }) => ({
                url: `${Form_URL}/updateField/${id}`,
                method: "PATCH",
                data: { fieldIndex, fieldData },
            }),
            invalidatesTags: [tagTypes.form],
        }),

        deleteForm: build.mutation({
            query: (id) => ({
                url: `${Form_URL}/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [tagTypes.form],
        }),
    }),
});

export const {
    useCreateFormMutation,
    useGetFormsQuery,
    useGetFormDataQuery,
    useUpdateFormMutation,
    useAddFieldMutation,
    useDeleteFieldMutation,
    useUpdateFieldMutation,
    useDeleteFormMutation,
} = formApi;

// remoteWorkApi.js

import { api } from "./apiBase";

export const remoteWorkApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllRemoteWorks: builder.mutation({
      query: () => ({
        url: "/remote",
        method: "GET",
      }),
    }),
    getAllRemoteWorksByEmail: builder.mutation({
      query: (email) => ({
        url: `/remote/user`,
        method: "POST",
        data: email
      }),
    }),
    createRemoteWork: builder.mutation({
      query: (data) => ({
        url: "/remote",
        method: "POST",
        data: data,
      }),
    }),
    updateRemoteWork: builder.mutation({
      query: (data) => ({
        url: `/remote/${data?.id}`,
        method: "PUT",
        data: data,
      }),
    }),
    getStatusOfEmployees: builder.mutation({
      query: (email) => ({
        url: `/remote/status`,
        method: "POST",
        data: email,
      }),
    }),
    deleteRemoteWork: builder.mutation({
      query: (remoteWorkId) => ({
        url: `/remote/${remoteWorkId}`,
        method: "DELETE",
      }),
    }),
    getUserProjects: builder.mutation({
      query: (email) => ({
        url: `/remote/projects`,
        method: "POST",
        data: email
      }),
    }),
  }),
});

export const {
  useGetAllRemoteWorksMutation,
  useGetAllRemoteWorksByEmailMutation, // New mutation hook for fetching remote works by user email
  useCreateRemoteWorkMutation,
  useUpdateRemoteWorkMutation,
  useDeleteRemoteWorkMutation,
  useGetStatusOfEmployeesMutation,
  useGetUserProjectsMutation
} = remoteWorkApi;

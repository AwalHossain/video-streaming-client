import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../helpers/axios/axiosBaseQuery";
import REACT_APP_API_URL from "../../../utils/apiUrl";
import { TAG_TYPES } from "./tagTypes";

export const apiSlice = createApi({
  name: "api",
  reducerPath: "api",
  baseQuery: axiosBaseQuery({
    baseUrl: REACT_APP_API_URL,
  }),
  endpoints: (builder) => ({}),
  tagTypes: [
    TAG_TYPES.Video,
    TAG_TYPES.Tag,
    TAG_TYPES.User,
    TAG_TYPES.Category,
  ],
});

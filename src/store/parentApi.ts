import { generateCustomError, getBaseUrl } from "@/lib/utils";
import { AppConfig } from "@/type";
import {
  BaseQueryApi,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const baseQueryCustom = (baseUrl: string) => {
  const baseQuery = fetchBaseQuery({ baseUrl });
  return async (args: string, api: BaseQueryApi, extraOptions: object) => {
    const { error, data } = await baseQuery(args, api, extraOptions);
    if (error) {
      return {
        error: generateCustomError(error),
      };
    }
    return { data };
  };
};

export const parentApi = createApi({
  reducerPath: "parentApi",
  baseQuery: baseQueryCustom(getBaseUrl()),
  tagTypes: ["product"],
  endpoints: (build) => ({
    getAppConfiguration: build.query<AppConfig, number>({
      query: (appId) => `/configuration/${appId}/`,
    }),
  }),
});

export const { useGetAppConfigurationQuery, useLazyGetAppConfigurationQuery } =
  parentApi;

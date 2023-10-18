import { Product, trl } from "@/type";
import { sanitizeHtmlString } from "@/lib/editorUtils";
import { parentApi } from "./parentApi";

const productEndPoints = parentApi.injectEndpoints({
  endpoints: (build) => ({
    getProduct: build.query<Product, number>({
      query: (id) => `/product/${id}/`,
      providesTags: ["product"],
      transformResponse: (res: Product): Product => {
        return {
          ...res,
          description: sanitizeHtmlString(res.description),
          video: res.video.replace("watch?v=", "/embed/"),
        };
      },
    }),
    editProduct: build.mutation<Product, Partial<Product>>({
      query: ({ id, ...rest }): any => ({
        url: `/product/${id}/`,
        method: "POST",
        body: rest,
      }),
      invalidatesTags: (_, error) => (!error ? ["product"] : []),
    }),
    getTRL: build.query<trl[], undefined>({
      query: () => "/trl/",
    }),
  }),
  overrideExisting: true,
});

export const { useGetProductQuery, useEditProductMutation, useGetTRLQuery } =
  productEndPoints;

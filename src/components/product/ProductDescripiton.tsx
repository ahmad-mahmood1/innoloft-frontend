import { PRODUCT_EDIT_PAGE } from "@/constants/routes";
import { PRODUCT_ID } from "@/layouts/Root";
import {
  editorContentFromHtmlString,
  getRawHtmlString,
} from "@/lib/editorUtils";
import { cn, getAppId } from "@/lib/utils";
import { useGetAppConfigurationQuery } from "@/store/parentApi";
import { Product } from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "@radix-ui/react-icons";
import { EditorState } from "draft-js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import * as z from "zod";
import RichTextEditor from "../RichTextEditor";
import { Icons } from "../icons";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Loader from "../ui/loader";
import { useEditProductMutation } from "@/store/productApi";

type ProductDescripitonProps = { product: Product };

function ProductDescripiton({ product }: ProductDescripitonProps) {
  const { data } = useGetAppConfigurationQuery(getAppId());
  const [editProduct, { error, reset }] = useEditProductMutation();

  const { pathname } = useLocation();
  const editMode = pathname.includes(PRODUCT_EDIT_PAGE);

  const address = product.company.address;

  const descriptionSchema = z.object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .min(5, { message: "Name must contain at least 5 character(s)" }),
    description: z.custom<EditorState>(),
  });

  type descriptionFormValues = z.infer<typeof descriptionSchema>;

  const defaultValues: Partial<descriptionFormValues> = {
    // employeeListFile: undefined,
    name: "",
    description: EditorState.createEmpty(),
  };

  const form = useForm<descriptionFormValues>({
    resolver: zodResolver(descriptionSchema),
    defaultValues,
  });

  const {
    getValues,
    setValue,
    reset: formReset,
    formState: { isDirty, isSubmitting },
  } = form;

  useEffect(() => {
    form.reset({
      name: product.name,
      description: EditorState.createWithContent(
        editorContentFromHtmlString(product.description)
      ),
    });
  }, [product]);

  const onSubmit = async (data: descriptionFormValues) => {
    if (error) {
      reset();
    }

    const body = {
      id: PRODUCT_ID,
      name: data.name,
      description: getRawHtmlString(data.description),
    };

    const res = await editProduct(body).unwrap();

    if (res && !error) {
      //as the edit api might not update the product, keeping the last edited form state while removing dirty states from all fields
      formReset(getValues(), { keepDirty: false });
      return res;
    }
  };

  return (
    <div className="bg-white border border-border divide-x rounded-sm flex  flex-col md:flex-row">
      <div className="min-w-[70%] flex-1">
        <div className="relative">
          <img
            src={product.picture}
            className="bg-slate-200 max-h-64 w-full object-cover"
          />
          <div className="absolute top-0 flex items-center bg-white rounded-br-sm">
            <div className="bg-primary h-9 flex items-center rounded-tl-sm rounded-br-sm">
              <Icons.badge className="w-9 m-auto" />
            </div>
            <div className="mx-2">Patent</div>
          </div>
        </div>
        <div className="p-4 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    {editMode ? (
                      <FormControl>
                        <Input {...field} placeholder="Product Name" />
                      </FormControl>
                    ) : (
                      <div className="text-base text-lg font-medium">
                        {product.name}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        wrapperClassName={cn(
                          editMode
                            ? "border border-border"
                            : "text-muted text-sm"
                        )}
                        editorClassName={cn(editMode && "p-2 overflow-hidden")}
                        toolbarHidden={!editMode}
                        editorState={field.value}
                        editorStateChange={(editorState) => {
                          setValue("description", editorState, {
                            shouldDirty: true,
                          });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {editMode && (
                <div
                  className={cn(
                    "w-full flex flex-row-reverse mt-4",
                    !editMode && "hidden"
                  )}
                >
                  <Button type="submit" disabled={!isDirty || isSubmitting}>
                    {isSubmitting ? (
                      <Loader className="mr-1" size={18} />
                    ) : (
                      <CheckIcon className="h-4 w-4 mr-1" />
                    )}
                    <span>Save</span>
                  </Button>
                  <Button
                    className="mr-4"
                    type="submit"
                    variant={"ghost"}
                    disabled={!isDirty || isSubmitting}
                    onClick={() => {
                      formReset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
      {data?.hasUserSection && (
        <div className="flex flex-col p-4 space-y-4 min-w-[30%]">
          <div className="text-base font-light">Offered By</div>
          <img src={product.company.logo} className="w-3/5" />
          <div className="flex space-x-5 items-center">
            <img
              src={product.user.profilePicture}
              className="rounded-full w-14"
            />
            <div>
              <div className="font-semibold text-muted text-sm">
                {product.user.firstName} {product.user.lastName}
              </div>
              <div className="text-muted text-sm">{product.company.name}</div>
            </div>
          </div>

          <div className="text-sm text-muted">
            <div>
              <span className="inline-block">
                <Icons.location />
              </span>
              {`${address.street} ${address.house}`}
            </div>
            <div className="pl-4">
              {`${address.zipCode} ${address.city.name}, ${address.country.name}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDescripiton;

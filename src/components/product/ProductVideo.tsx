import { URL_REGEX } from "@/constants/regex";
import { PRODUCT_EDIT_PAGE } from "@/constants/routes";
import { PRODUCT_ID } from "@/layouts/Root";
import { useEditProductMutation } from "@/store/productApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Loader from "../ui/loader";
import { cn } from "@/lib/utils";
type VideoProps = {
  source: string;
};

function ProductVideo({ source }: VideoProps) {
  const { pathname } = useLocation();
  const editMode = pathname.includes(PRODUCT_EDIT_PAGE);
  const [editProduct, { error, reset }] = useEditProductMutation();

  const videoSchema = z.object({
    url: z
      .string()
      .min(1, { message: "URL is required" })
      .refine((val) => !!URL_REGEX.test(val), { message: "Invlaid URL" }),
  });

  type videoFormValues = z.infer<typeof videoSchema>;

  const defaultValues: Partial<videoFormValues> = {
    url: "",
  };

  const form = useForm<videoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues,
    mode: "all",
  });

  const {
    formState: { isDirty, isValid, isSubmitting },
    reset: formReset,
    getValues,
  } = form;

  const onSubmit = async (data: videoFormValues) => {
    if (error) {
      reset();
    }
    const res = await editProduct({ id: PRODUCT_ID, video: data.url }).unwrap();

    if (res) {
      //as the edit api might not update the product, keeping the last edited form state while removing dirty states from all fields
      formReset(getValues(), { keepDirty: false });
      return res;
    }
  };

  useEffect(() => {
    form.reset({ url: source });
  }, [editMode]);

  const handleOnBlur = () => {
    if (isValid && isDirty) {
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="bg-white p-4 border border-border rounded-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className={cn(!editMode && "space-y-6")}>
                <FormLabel className="text-base font-medium ">Video</FormLabel>
                {editMode ? (
                  <>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          onBlur={(e) => {
                            e.preventDefault();
                            handleOnBlur();
                          }}
                          placeholder="Add to youtube or vimeo link"
                        />
                        {isSubmitting && (
                          <Loader className="absolute top-2 right-2" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </>
                ) : (
                  <iframe
                    src={source}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Product Video"
                    className="aspect-video w-full md:w-4/5 mx-auto"
                  />
                )}
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export default ProductVideo;

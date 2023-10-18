import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCT_EDIT_PAGE } from "@/constants/routes";
import { PRODUCT_ID } from "@/layouts/Root";
import { cn } from "@/lib/utils";
import { useEditProductMutation, useGetTRLQuery } from "@/store/productApi";
import { Product } from "@/type";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import * as z from "zod";
import { Icons } from "../icons";
import { Button } from "../ui/button";
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

type OfferDetailsProps = {
  product: Product;
};

function OfferDetails({ product }: OfferDetailsProps) {
  const getDefaultValues = () => ({
    technologyInput: "",
    technologies: product.categories,
    businessModelInput: "",
    businessModels: product.businessModels,
    trl: { id: product.trl?.id, name: product.trl?.name },
    cost: product.investmentEffort,
  });

  const { pathname } = useLocation();
  const editMode = pathname.includes(PRODUCT_EDIT_PAGE);

  const { data } = useGetTRLQuery(undefined, { skip: !editMode });

  const [editProduct, { error, reset }] = useEditProductMutation();

  const offerSchema = z
    .object({
      technologyInput: z.string().optional(),
      technologies: z
        .object({
          id: z.number(),
          name: z.string(),
        })
        .required()
        .array(),
      businessModelInput: z.string().optional(),
      businessModels: z
        .object({
          id: z.number(),
          name: z.string(),
        })
        .required()
        .array(),
      trl: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().optional().nullable(),
      }),
      cost: z.string().min(1, { message: "Cost is required" }),
    })
    .superRefine((val, ctx) => {
      if (val.businessModels.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessModelInput"],
          message: "At least one Business model required",
        });
      }

      if (val.technologies.length < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["technologyInput"],
          message: "At least one Technology is required",
        });
      }
    });

  type offerFormValues = z.infer<typeof offerSchema>;

  const defaultValues: Partial<offerFormValues> = {
    technologyInput: "",
    technologies: [],
    businessModelInput: "",
    businessModels: [],
    trl: undefined,
    cost: "",
  };

  const form = useForm<offerFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues,
    mode: "all",
  });

  const {
    control,
    setValue,
    formState: { isDirty, isSubmitting },
    reset: formReset,
    resetField,
    handleSubmit,
    getValues,
  } = form;

  const {
    fields: technologies,
    remove: removeTechnology,
    prepend: prependTechnology,
  } = useFieldArray({
    name: "technologies",
    control: control,
  });

  const {
    fields: businessModels,
    remove: removeBusinessModel,
    prepend: prependBusinessModel,
  } = useFieldArray({
    name: "businessModels",
    control: control,
  });

  const onSubmit = async (data: offerFormValues) => {
    if (error) {
      reset();
    }
    const res = await editProduct({ id: PRODUCT_ID, ...data }).unwrap();

    if (res && !error) {
      //as the edit api might not update the product, keeping the last edited form state while removing dirty states from all fields
      formReset(getValues(), { keepDirty: false });
      return res;
    }
  };

  useEffect(() => {
    formReset(getDefaultValues());
  }, [editMode]);

  return (
    <div className="bg-white p-4 border rounded-sm">
      <div className="text-base font-medium">Offer Details</div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-4 md:gap-y-3 p-2"
        >
          <FormField
            control={control}
            name="technologyInput"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <div className="flex items-center">
                  <Icons.technology
                    stroke="grey"
                    strokeWidth={"0.1"}
                    className="mr-2"
                  />
                  <FormLabel className="text-muted font-light">
                    Technologies
                  </FormLabel>
                </div>
                {editMode && (
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setValue(field.name, e.target.value.slice(0, 40));
                      }}
                      placeholder="Add technology"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (field.value?.length && technologies.length < 4) {
                            const newValue = {
                              id: Date.now(),
                              name: field.value?.trim(),
                            };
                            prependTechnology(newValue);
                            resetField("technologyInput");
                          }
                        }
                      }}
                    />
                  </FormControl>
                )}
                <div className="flex flex-wrap items-center overflow-scroll">
                  {technologies.map((item, index) => {
                    return (
                      <Chip
                        remove={() => {
                          removeTechnology(index);
                        }}
                        value={item.name}
                        key={"tech" + item.id}
                        isClosable={editMode}
                      />
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="businessModelInput"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <div className="flex items-center">
                  <Icons.businessModel
                    stroke="grey"
                    strokeWidth={"0.1"}
                    className="mr-2"
                  />
                  <FormLabel className="text-muted font-light">
                    Business Models
                  </FormLabel>
                </div>
                {editMode && (
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        setValue(field.name, e.target.value.slice(0, 40));
                      }}
                      placeholder="Add Business Model"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (
                            field.value?.length &&
                            businessModels.length < 5
                          ) {
                            const newValue = {
                              id: Date.now(),
                              name: field.value?.trim(),
                            };
                            prependBusinessModel(newValue);
                            resetField("businessModelInput");
                          }
                        }
                      }}
                    />
                  </FormControl>
                )}
                <div className="flex flex-wrap items-cente overflow-scroll">
                  {businessModels.map((item, index) => {
                    return (
                      <Chip
                        remove={() => {
                          removeBusinessModel(index);
                        }}
                        value={item.name}
                        key={"business" + item.id}
                        isClosable={editMode}
                      />
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="trl"
            render={({ field }) => {
              return (
                <FormItem className="w-full flex flex-col">
                  <div className="flex items-center">
                    <Icons.trl
                      stroke="grey"
                      strokeWidth={"0.1"}
                      className="mr-2"
                    />
                    <FormLabel className="text-muted font-light">TRL</FormLabel>
                  </div>
                  {editMode ? (
                    <Select
                      name={field.name}
                      onOpenChange={(e) => {
                        !e && field.onBlur();
                      }}
                      onValueChange={(id) => {
                        const selectItem = data?.find((e) => e.id === id);
                        selectItem &&
                          setValue(
                            "trl",
                            { ...selectItem, id: parseInt(selectItem.id) },
                            {
                              shouldDirty: true,
                            }
                          );
                      }}
                      value={field.value?.id?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select TRL">
                          <div className="truncate w-[140px] md:w-[280px]">
                            {field.value?.name}
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-[calc(100vw_-_1rem)] md:w-full">
                        {data?.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.name}
                          </SelectItem>
                        )) || (
                          <SelectItem value={"No Options"} disabled={true}>
                            No options
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Chip
                      key={field.value?.id}
                      value={field.value?.name || ""}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={control}
            name="cost"
            render={({ field }) => (
              <FormItem className="w-full flex flex-col">
                <div className="flex items-center">
                  <Icons.cost
                    stroke="grey"
                    strokeWidth={"0.1"}
                    className="mr-2"
                  />
                  <FormLabel className="text-muted font-light">Cost</FormLabel>
                </div>
                {editMode ? (
                  <>
                    <Input {...field} placeholder="Add product cost" />
                    <FormMessage />
                  </>
                ) : (
                  <div className="flex">
                    <Chip value={field.value} />
                  </div>
                )}
              </FormItem>
            )}
          />

          <div
            className={cn(
              "mt-4 flex flex-row-reverse md:col-start-2",
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
        </form>
      </Form>
    </div>
  );
}

type ChipProps = {
  remove?: () => void;
  value: string;
  className?: string;
  isClosable?: boolean;
};

function Chip({
  remove = () => null,
  value,
  className,
  isClosable = false,
  ...rest
}: ChipProps) {
  return (
    <div
      className={cn(
        "flex space-x-1 justify-center items-center m-1 px-3 py-1 rounded-full bg-muted-background text-muted text-sm",
        className
      )}
      {...rest}
    >
      <div className="flex-initial break-words">{value}</div>
      <button className={cn(!isClosable && "hidden")} onClick={remove}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
export default OfferDetails;

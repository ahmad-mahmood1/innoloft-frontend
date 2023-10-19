import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorState from "@/components/ErrorState";
import { Icons } from "@/components/icons";
import ProductInfo from "@/components/product/ProductInfo";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { PRODUCT_EDIT_PAGE, PRODUCT_PAGE } from "@/constants/routes";
import { PRODUCT_ID } from "@/layouts/Root";
import { useGetProductQuery } from "@/store/productApi";
import { breadcrumb } from "@/type";
import { useMatch, useNavigate } from "react-router-dom";

const productBreadcrumbs: breadcrumb[] = [
  {
    element: <Icons.home />,
    route: "/",
  },
  { element: "Offers", route: "/" },
];

function Product() {
  const navigate = useNavigate();
  const isEditRoute = useMatch(PRODUCT_EDIT_PAGE);
  const { data, isLoading, isError, error, refetch } = useGetProductQuery(
    PRODUCT_ID,
    {
      refetchOnMountOrArgChange: true,
    }
  );

  if (isLoading) {
    return <Loader className="min-h-screen" />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        description={"Endpoint Failure"}
        message={error?.message || "No Data Found"}
        onRetry={() => {
          refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between">
        <Breadcrumbs
          breadcrumbs={[...productBreadcrumbs, { element: data.name }]}
        />
        <Button
          onClick={() => {
            navigate(isEditRoute ? PRODUCT_PAGE : PRODUCT_EDIT_PAGE, {
              replace: true,
            });
          }}
        >
          {isEditRoute ? "View Offer" : "Edit"}
        </Button>
      </div>
      <ProductInfo product={data} />
    </div>
    // </div>
  );
}

export default Product;

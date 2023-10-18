import { Icons } from "@/components/icons";
import { PRODUCT_ID } from "@/layouts/Root";
import { useGetProductQuery } from "@/store/productApi";
import { Skeleton } from "./ui/skeleton";

function MenuBar() {
  const { data: product, isLoading } = useGetProductQuery(PRODUCT_ID);

  return (
    <div className="flex space-x-4 text-white items-center">
      <Icons.messenger />
      <div className="flex items-center space-x-2">
        <span>EN</span>
        <Icons.arrowDown />
      </div>
      <Icons.notification />
      <div className="flex items-center space-x-2">
        {isLoading ? (
          <Skeleton className="h-10 w-10 rounded-full" />
        ) : (
          <img
            src={product?.user.profilePicture}
            className="w-10 rounded-full"
          />
        )}
        <Icons.arrowDown />
      </div>
    </div>
  );
}

export default MenuBar;

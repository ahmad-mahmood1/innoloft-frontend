import { Icons } from "@/components/icons";
import { PRODUCT_PAGE } from "@/constants/routes";
import { PRODUCT_ID } from "@/layouts/Root";
import { useGetProductQuery } from "@/store/productApi";
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

const navItems = [
  { name: "Home", icon: <Icons.home />, children: null, to: "/" },
  {
    name: "Member Offer",
    icon: <Icons.members />,
    children: null,
    to: PRODUCT_PAGE,
  },
  {
    name: "Organizations",
    icon: <Icons.organizations />,
    children: [],
    to: "/",
  },
];

function UserSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

function UserNav() {
  const { data, isLoading } = useGetProductQuery(PRODUCT_ID);
  return (
    <div className="flex flex-col">
      <div className="flex space-x-5 items-center">
        {isLoading ? (
          <UserSkeleton />
        ) : (
          <>
            <img
              src={data?.user?.profilePicture}
              className="rounded-full w-14"
            />
            <div>
              <div className="font-semibold text-base text-lg">
                {data?.user?.firstName} {data?.user?.lastName}
              </div>
              <div className="text-base text-lg">{data?.company?.name}</div>
            </div>
          </>
        )}
      </div>

      <nav className="mt-8 px-6 space-y-6">
        {navItems.map((item) => (
          <ul key={item.name}>
            <li className="flex items-center">
              <Link className="flex items-center flex-1" to={item.to}>
                <div className="mr-6">{item.icon}</div>
                <div className="text-base flex-1">{item.name}</div>
              </Link>
              {!!item.children && (
                <Icons.arrowDown stroke="#374151" strokeWidth={"0.5"} />
              )}
            </li>
          </ul>
        ))}
      </nav>
    </div>
  );
}

export default UserNav;

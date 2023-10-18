import { cn } from "@/lib/utils";
import { breadcrumb } from "@/type";
import { Link } from "react-router-dom";
import { Icons } from "./icons";

function Breadcrumbs({
  breadcrumbs,
  className,
}: {
  breadcrumbs: breadcrumb[];
  className?: string;
}) {
  const generateBreadCrumbElements = (breadcrumbs: breadcrumb[]) => {
    const init: any[] = [];

    const forwardArrow = (key: number) => (
      <div className="mx-1 md:mx-3" key={"arrow" + key}>
        <Icons.arrowRight stroke="grey" strokeWidth={"0.6"} />
      </div>
    );

    const routeItem = (item: breadcrumb, key: number) => (
      <Link
        key={key}
        to={item.route || ""}
        className={cn(
          "text-slate-500 font-medium",
          item.route ? "font-light" : ""
        )}
      >
        {item.element}
      </Link>
    );
    breadcrumbs?.forEach((item, i) => {
      init.push(routeItem(item, i));
      if (item.route) {
        init.push(forwardArrow(i));
      }
    });
    return init;
  };

  return (
    <div className={cn("flex items-center", className)}>
      {generateBreadCrumbElements(breadcrumbs)}
    </div>
  );
}

export default Breadcrumbs;

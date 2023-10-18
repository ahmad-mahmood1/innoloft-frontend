import { getAppId } from "@/lib/utils";
import { useGetAppConfigurationQuery } from "@/store/parentApi";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import MenuBar from "./MenuBar";
import SearchBar from "./SearchBar";

function SiteHeader() {
  const { data } = useGetAppConfigurationQuery(getAppId());
  return (
    <div className="bg-primary fixed top-0 left-0 right-0 z-10 h-18">
      <div className="container flex items-center py-3">
        <div className="md:basis-1/4">
          <Link to="/">
            <ReactSVG
              afterInjection={(svg) => {
                svg.setAttribute("style", "height:2rem");
              }}
              className="stroke-white"
              wrapper="div"
              src={data?.logo || ""}
            />
          </Link>
        </div>
        <div className="flex-auto justify-between hidden md:flex flex-row">
          <SearchBar />
          <MenuBar />
        </div>
      </div>
    </div>
  );
}

export default SiteHeader;

import { Outlet } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";

import ErrorState from "@/components/ErrorState";
import UserNav from "@/components/UserNav";
import Loader from "@/components/ui/loader";
import { getAppId, mapThemeToRoot } from "@/lib/utils";
import { useLazyGetAppConfigurationQuery } from "@/store/parentApi";
import { Suspense, useEffect } from "react";
import { useLazyGetProductQuery } from "@/store/productApi";

export const PRODUCT_ID = 6781;

function useAppConfig() {
  const [trigger, { isLoading, error }] = useLazyGetAppConfigurationQuery();
  const [triggerProduct, { isLoading: isLoadingProduct, error: errorProduct }] =
    useLazyGetProductQuery();

  const getAppConfiguration = async () => {
    const configObj = await trigger(getAppId()).unwrap();
    mapThemeToRoot(configObj?.mainColor || "blue");
    return configObj;
  };

  const getProductData = async () => {
    const res = await triggerProduct(PRODUCT_ID).unwrap();
    return res;
  };

  useEffect(() => {
    getAppConfiguration();
  }, []);

  const reset = () =>
    error ? getAppConfiguration : errorProduct ? getProductData : null;

  return [isLoading || isLoadingProduct, error || errorProduct, reset] as const;
}

function RootLayout() {
  const [isConfigLoading, error, refetch] = useAppConfig();

  return (
    <main className="rootContainer">
      {isConfigLoading ? (
        <Loader className="self-center" />
      ) : error ? (
        <ErrorState
          message={error.message}
          onRetry={refetch}
          buttonText="Retry"
        />
      ) : (
        <Suspense fallback={<Loader className="self-center" />}>
          <SiteHeader />
          <div className="container mt-16 flex py-4">
            <div className="hidden md:block min-w-[25%]">
              <UserNav />
            </div>
            <div>
              <Outlet />
            </div>
          </div>
        </Suspense>
      )}
    </main>
  );
}

export default RootLayout;

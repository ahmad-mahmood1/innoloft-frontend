import { Outlet } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";

import ErrorState from "@/components/ErrorState";
import Loader from "@/components/ui/loader";
import { getAppId, mapThemeToRoot } from "@/lib/utils";
import { useLazyGetAppConfigurationQuery } from "@/store/parentApi";
import { Suspense, useEffect, useState } from "react";

export const PRODUCT_ID = 6781;

function useAppConfig() {
  const [trigger, { isLoading, error }] = useLazyGetAppConfigurationQuery();
  const [isThemeLoaded, setTheme] = useState(false);

  const getAppConfiguration = async () => {
    const configObj = await trigger(getAppId()).unwrap();
    mapThemeToRoot(configObj?.mainColor || "blue");
    setTheme(true);
    return configObj;
  };

  useEffect(() => {
    getAppConfiguration();
  }, []);

  return [isLoading || !isThemeLoaded, error, getAppConfiguration] as const;
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
          description="Failed to load App Config"
          onRetry={refetch}
          buttonText="Retry"
        />
      ) : (
        <Suspense fallback={<Loader className="self-center" />}>
          <SiteHeader />
          <div className="container mt-16">
            <Outlet />
          </div>
        </Suspense>
      )}
    </main>
  );
}

export default RootLayout;

import ErrorState from "@/components/ErrorState";
import { useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const routerError: any = useRouteError();
  const navigate = useNavigate();
  const isNotFoundError = routerError.status === 404;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorState
        message={routerError.error?.message || routerError.data}
        onRetry={() => {
          isNotFoundError ? navigate("/") : window.location.reload();
        }}
        {...(isNotFoundError && { buttonText: "Go Home" })}
      />
    </div>
  );
}

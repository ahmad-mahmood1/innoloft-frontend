import { Button } from "./ui/button";

type ErrorStateProps = {
  message: string;
  description?: string;
  onRetry?: () => void;
  buttonText?: string;
};

function ErrorState({
  message,
  description = "Applicaton error!",
  onRetry = () => null,
  buttonText = "Refresh",
}: ErrorStateProps) {
  return (
    <div className="center space-y-4">
      <p>{description}</p>
      <p className="text-sm text-base">{message}</p>
      <Button onClick={onRetry}>{buttonText}</Button>
    </div>
  );
}

export default ErrorState;

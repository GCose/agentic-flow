import React from "react";
import { AlertCircle, RefreshCw, ArrowLeft, Wifi, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  message?: string;
  type?: "network" | "server" | "not-found" | "generic";
  onRetry?: () => void;
  onGoBack?: () => void;
  isRetrying?: boolean;
  showRetry?: boolean;
  showGoBack?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  type = "generic",
  onRetry,
  onGoBack,
  isRetrying = false,
  showRetry = true,
  showGoBack = false,
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: <Wifi className="h-12 w-12 text-blue-400" />,
          defaultTitle: "Connection Issue",
          defaultMessage:
            "Unable to connect to our servers. Please check your internet connection and try again.",
          iconBg: "bg-blue-500/20",
        };
      case "server":
        return {
          icon: <Server className="h-12 w-12 text-orange-400" />,
          defaultTitle: "Server Error",
          defaultMessage:
            "Our servers are experiencing issues. We're working to fix this as quickly as possible.",
          iconBg: "bg-orange-500/20",
        };
      case "not-found":
        return {
          icon: <AlertCircle className="h-12 w-12 text-purple-400" />,
          defaultTitle: "No Data Found",
          defaultMessage:
            "We couldn't find any leads matching your criteria. Try adjusting your filters or check back later.",
          iconBg: "bg-purple-500/20",
        };
      default:
        return {
          icon: <AlertCircle className="h-12 w-12 text-red-400" />,
          defaultTitle: "Something Went Wrong",
          defaultMessage:
            "An unexpected error occurred. Please try again or contact support if the problem persists.",
          iconBg: "bg-red-500/20",
        };
    }
  };

  const config = getErrorConfig();

  return (
    <Card className="border-none bg-transparent">
      <CardContent className="p-8">
        <div
          className={`border border-blue-900/70 rounded-2xl p-8 text-center`}
        >
          <div
            className={`inline-flex items-center justify-center w-20 h-20 ${config.iconBg} rounded-full mb-6`}
          >
            {config.icon}
          </div>

          <h3 className="text-xl font-bold text-white mb-3">
            {title || config.defaultTitle}
          </h3>

          <p className="text-slate-300 text-md mb-8 max-w-md mx-auto leading-relaxed">
            {message || config.defaultMessage}
          </p>

          <div className="flex gap-4 justify-center">
            {showRetry && onRetry && (
              <Button
                onClick={onRetry}
                disabled={isRetrying}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5"
              >
                {isRetrying ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Retrying...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </>
                )}
              </Button>
            )}

            {showGoBack && onGoBack && (
              <Button
                onClick={onGoBack}
                variant="outline"
                className="border-blue-900/70 bg-transparent hover:bg-blue-600/10 text-white px-6 py-2.5"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ErrorState;

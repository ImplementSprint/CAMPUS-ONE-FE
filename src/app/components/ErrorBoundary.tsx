'use client'
import { useRouteError, isRouteErrorResponse } from "next/navigation";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{error.status}</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {error.statusText || "Page Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error.data || "The page you're looking for doesn't exist."}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-[#F59E0B] text-white rounded-md hover:bg-[#D97706] transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Oops!</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          An unexpected error has occurred. Please try again later.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-[#F59E0B] text-white rounded-md hover:bg-[#D97706] transition-colors"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}

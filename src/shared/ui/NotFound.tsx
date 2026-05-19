'use client'
import { DesktopLayout } from "./DesktopLayout";

export function NotFound() {
  return (
    <DesktopLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist.
          </p>
          <a
            href="/desktop/online-enrollment"
            className="inline-block px-6 py-3 bg-[#F59E0B] text-white rounded-md hover:bg-[#D97706] transition-colors"
          >
            Go to Online Enrollment
          </a>
        </div>
      </div>
    </DesktopLayout>
  );
}

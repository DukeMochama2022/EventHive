import React from "react";

const LoadingSkeleton = ({ type = "card", lines = 3, className = "" }) => {
  const CardSkeleton = () => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="animate-pulse">
        {/* Image placeholder */}
        <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>

        {/* Title */}
        <div className="h-6 bg-gray-300 rounded mb-3"></div>

        {/* Description lines */}
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`h-4 bg-gray-300 rounded mb-2 ${
              index === lines - 1 ? "w-3/4" : "w-full"
            }`}
          ></div>
        ))}

        {/* Button */}
        <div className="h-10 bg-gray-300 rounded mt-4"></div>
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const TableSkeleton = () => (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>

        {/* Rows */}
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="border-b border-gray-100 p-4">
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-300 rounded flex-1"></div>
              <div className="h-4 bg-gray-300 rounded flex-1"></div>
              <div className="h-4 bg-gray-300 rounded flex-1"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const FormSkeleton = () => (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="animate-pulse space-y-6">
        {/* Title */}
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>

        {/* Form fields */}
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-12 bg-gray-300 rounded"></div>
          </div>
        ))}

        {/* Submit button */}
        <div className="h-12 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );

  switch (type) {
    case "card":
      return <CardSkeleton />;
    case "list":
      return <ListSkeleton />;
    case "table":
      return <TableSkeleton />;
    case "form":
      return <FormSkeleton />;
    default:
      return <CardSkeleton />;
  }
};

export default LoadingSkeleton;
 
import React from "react";

const EmptyStateMessage = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <img src="/images/empty-100.png" alt="Placeholder" className="w-58 h-48 mb-4" />
      <p className="text-2xl font-bold mb-2 mt-6">{title}</p>
      <p className="text-gray-500 text-lg mb-6">{description}</p>
    </div>
  );
};
export default EmptyStateMessage;

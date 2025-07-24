import React from "react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white/90 z-[9999] flex flex-col items-center justify-center transition-opacity duration-500">
      <img
        src="/nama-sekolah-f.png"
        alt="Loading Logo"
        className="w-24 h-auto animate-pulse mb-4"
      />
    </div>
  );
};

export default PageLoader;

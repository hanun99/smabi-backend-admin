import React from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-72 transition-all duration-300">
        <Header />
        <main className="pt-20 px-4 sm:px-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

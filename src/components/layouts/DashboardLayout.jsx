import React from "react";
import Navbar from "../Navbar";
import SideMenu from "../SideMenu";
import { useUserContext } from "../../context/UserContext";

const DashboardLayout = ({ children, activeMenu }) => {
  const { me } = useUserContext();

  return (
    <div>
      <Navbar />

      {me && (
        <div className="flex">
          <div className="max-[1080px]:hidden">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Main */}
          <div className="grow mx-5">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;

import React, { useState } from "react";
import "./page.css";

import Sidebar from "../Sidebar/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Home from "../Home/home";
import ModelsComponent from "../Models/models";
import DatasetComponent from "../Dataset/dataset";
function Page() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPageName, setCurrentPageName] = useState("home");

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleToggle = () => {
    toggleSidebar();
  };

  const handleSetCurrentPageName = (value) => {
    setCurrentPageName(value);
  };

  const handlePageContent = (pageName) => {
    switch (pageName) {
      case "home":
        return <Home/>;
      case "models":
        return <ModelsComponent />;
      case "dataset":
        return <DatasetComponent />;
      default:
        break;
    }
  };

  return (
    <div className="container">
      <div className="cont">
        <h2 className="side-bar" onClick={handleToggle}>
          <FontAwesomeIcon icon={faBars} />
        </h2>
        <Sidebar
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          handleSetCurrentPageName={handleSetCurrentPageName}
          currentPageName={currentPageName}
        />
      </div>
      {handlePageContent(currentPageName)}
    </div>
  );
}
export default Page;

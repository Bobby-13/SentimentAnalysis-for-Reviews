import { faBookmark, faGears, faGlobe, faHouse } from "@fortawesome/free-solid-svg-icons";
import "./sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Sidebar({ isOpen, handleSetCurrentPageName,currentPageName }) {
   const handleModelsButtonClick = () => {
    handleSetCurrentPageName("models");
  };

  const handleHomeButtonClick = () => {
    handleSetCurrentPageName("home");
  };

  const handleDatasetButtonClick = () => {
    handleSetCurrentPageName("dataset");
  };
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-content">
        {isOpen && (
          <>
            <div className="content_wrapper">
             
              <button style={{fontSize:'20px'}} onClick={handleHomeButtonClick} className={`sidebar_item ${currentPageName === "home" && "active"}`}>
              <FontAwesomeIcon icon={faHouse} size="lg" style={{paddingRight:"2.5rem"}}/>Home</button>
              <button style={{fontSize:'20px'}} onClick={handleModelsButtonClick} className={`sidebar_item ${currentPageName === "models" && "active"}`}>
              <FontAwesomeIcon icon={faGears} size="lg" style={{paddingRight:"2.5rem"}}/>Models</button>
              <button style={{fontSize:'20px'}} onClick={handleDatasetButtonClick} className={`sidebar_item ${currentPageName === "dataset" && "active"}`}>
              <FontAwesomeIcon icon={faGlobe} size="lg"style={{paddingRight:"2.5rem"}}/>Dataset</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Sidebar;

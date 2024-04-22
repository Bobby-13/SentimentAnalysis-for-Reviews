import "./sidebar.css";

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
              <button style={{fontSize:'20px'}} onClick={handleHomeButtonClick} className={`sidebar_item ${currentPageName === "home" && "active"}`}>Home</button>
              <button style={{fontSize:'20px'}} onClick={handleModelsButtonClick} className={`sidebar_item ${currentPageName === "models" && "active"}`}>Models</button>
              <button style={{fontSize:'20px'}} onClick={handleDatasetButtonClick} className={`sidebar_item ${currentPageName === "dataset" && "active"}`}>Dataset</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Sidebar;

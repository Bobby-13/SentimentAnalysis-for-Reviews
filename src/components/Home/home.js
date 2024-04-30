import React, { useState, useEffect } from "react";
import "./home.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BarChartComponent } from "../Models/models";
import {
  faCircleLeft,
  faCircleRight,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import ApexChart from "./ApexChart"; // Import the ApexChart component
import { PieChart, Pie, Cell, Tooltip } from "recharts";
const Home = () => {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [barData, setBarData] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [pieData, setPieData] = useState([]);
  const [csvData, setCsvData] = useState(null);
  const [isPredict, setIsPredict] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    setPrediction("");
  };
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  const handleInputClick = (event) => {
    setPrediction("");
    setError("");
  };

  const handlePredictClick = () => {
    if (inputText.length <= 5) {
      setError("Prediction must be at least 20 characters long.");
      setPrediction("");
    } else {
      const requestData = {
        sentence: inputText,
      };
      setIsPredict(true);

      axios
        .post("http://localhost:8000/predict", requestData)
        .then((response) => {
          const predictionResult = response.data.Model_Sentiment;
          const formattedData = Object.entries(predictionResult).map(
            ([model, data]) => ({
              model,
              positive: data.positive,
              negative: data.negative,
            })
          );
          setBarData(formattedData);
          setError("");
          setPrediction("");
          setShowChart(true);
        })
        .catch((error) => {
          setError("Error fetching prediction.");
          console.error("Error fetching prediction:", error);
        });
    }
  };

  const handleFile = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };

  const handleClickChange = () => {
    document.getElementById("fileInput").click();
  };

  const handleCross = () => {
    setSelectedFile("");
    setPieData([]);
    setBarData([]);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
    setError("");
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError("Please select a file before submitting.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    // formData.append("model", selectedModel); // Include selected model in the formData

    setIsLoading(true);
    axios
      .post("http://localhost:8000/predict_csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const data = response.data;
        setCsvData(data);

        let pieChartData = [];
        let keyArr = Object.keys(data).slice(0, 3);
        for (let index = 0; index < keyArr.length; index++) {
          const obj = {
            name: keyArr[index],
            value: data[keyArr[index]],
          };
          pieChartData.push(obj);
        }
        setPieData(pieChartData);
        setError("");
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          setError("Error uploading CSV file.");
        }, 2000);
      });
  };

  return (
    <>
      <div className="main-content">
        <div className="btn-container-wrapper">
          <div className="btn-container">
            <button
              onClick={() => {
                setToggle(true);
                setError("");
              }}
              style={buttonStyle}
            >
              <FontAwesomeIcon
                icon={faCircleLeft}
                size="4x"
                color={toggle ? "#BFC0C2" : "#0000F7"}
              />
            </button>
            <button
              onClick={() => {
                setToggle(false);
                setError("");
              }}
              style={buttonStyle}
            >
              <FontAwesomeIcon
                icon={faCircleRight}
                size="4x"
                color={toggle ? "#0000F7" : "#BFC0C2"}
              />
            </button>
          </div>
        </div>
        <p className="heading">Sentiment Analysis of Reviews</p>
        {toggle ? (
          <div>
            {isPredict ? (
              <div className="loading-container">
                <img
                  src="https://cdn.dribbble.com/users/2973561/screenshots/5757826/media/c5083407af44c0753602fa3e7b025ba7.gif"
                  height={300}
                  width={400}
                />
              </div>
            ) : (
              <>
                {barData.length <= 0 && (
                  <div>
                    <textarea
                      className={
                        inputText.length > 0
                          ? "input-textarea-enable"
                          : "input-textarea"
                      }
                      placeholder="Type your words here..."
                      value={inputText}
                      onClick={handleInputClick}
                      onChange={handleInputChange}
                      rows={9}
                      cols={50}
                    />
                    <br />
                    <div className="button-container">
                      <button
                        className="predict-button"
                        onClick={handlePredictClick}
                      >
                        Predict
                      </button>
                    </div>
                    {error && (
                      <div className="error-message">
                        <p style={{ color: "red" }}>{error}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {barData.length > 0 && (
                  <div className="apex-chart">
                    <ApexChart barData={barData} />
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="bulk-upload">
            {isLoading ? (
              <div className="loading-container">
                <img
                  src="https://cdn.dribbble.com/users/2973561/screenshots/5757826/media/c5083407af44c0753602fa3e7b025ba7.gif"
                  height={300}
                  width={400}
                />
              </div>
            ) : (
              <>
                {pieData.length <= 0 && (
                  <div
                    className="file-upload-container"
                    onClick={handleClickChange}
                  >
                    <input
                      type="file"
                      className="file-input"
                      onChange={handleFile}
                      style={{ display: "none" }}
                      id="fileInput"
                    />
                    <button className="upload-btn">
                      <FontAwesomeIcon
                        icon={faCloudArrowUp}
                        size="4x"
                        color="#01AAE9"
                      />
                    </button>
                    <p className="upload-txt">Upload only csv file</p>
                  </div>
                )}
              </>
            )}
            <div className="file-cross-container">
              <p>{selectedFile?.name}</p>
              {selectedFile?.name?.length > 0 && (
                <button className="cross-btn" onClick={handleCross}>
                  X
                </button>
              )}
            </div>
            {pieData.length <= 0 && (
              <button className="predict-button" onClick={handleSubmit}>
                Submit
              </button>
            )}
            {error && (
              <div className="error-message">
                <p style={{ color: "red" }}>{error}</p>
              </div>
            )}

            {pieData.length > 0 && (
              <div style={{ display: "flex", padding: "50px" }}>
                <PieChart width={470} height={430}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={180}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
                <div
                  style={{
                    marginLeft: "50px",
                    paddingTop: "100px",
                    display: "flex",
                  }}
                >
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {pieData.map((entry, index) => (
                      <li
                        key={`legend-${index}`}
                        style={{ marginBottom: "8px" }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "20px",
                            height: "15px",
                            backgroundColor: colors[index % colors.length],
                            marginRight: "5px",
                          }}
                        ></span>
                        {entry.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const buttonStyle = {
  // display: "inline-block",
  // margin: "0 10px",
  // fontSize: "10px",
  width: "min-content",
  // height: "50px",
  // borderRadius: "50%",
  background: "transparent",
  border: "none",
  outline: "none",
  cursor: "pointer",
};

export default Home;

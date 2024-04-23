import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import axios from "axios";
import { PieChartComponent } from "../Models/models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleLeft,
  faCircleRight,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [csvData, setCsvData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handlePredictClick = () => {
    if (inputText.length <= 5) {
      setError("Prediction must be at least 20 characters long.");
      setPrediction("");
    } else {
      const requestData = {
        sentence: inputText,
        language: "english",
      };

      axios
        .post("http://localhost:8000/predict", requestData)
        .then((response) => {
          const predictionResult = response.data;
          const prediction = predictionResult.Predicted_Sentiment;
          setError("");
          setPrediction(prediction);
        })
        .catch((error) => {
          setError("Error fetching prediction.");
          console.error("Error fetching prediction:", error);
        });
    }
  };
 

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    // if (!file) {
    //   setError("Please select a file.");
    //   return;
    // }

    // if (file.size === 0) {
    //   setError("File is empty. Please select a non-empty file.");
    //   return;
    // }

    setSelectedFile(file);
    setError("");
  };
  const handleFile = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
  };
  const handleClickChange = () => {
    document.getElementById("fileInput").click()
  };
  const handleCross = () => {
    setSelectedFile("");
    setPieData([]);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = "";
    }
    setError("")
  };
  const handleSubmit = () => {
    if (!selectedFile) {
      setError("Please select a file before submitting.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

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
        // console.log(Object.keys(data).slice(0, 3));

        let pieChartData = [];
        let keyArr = Object.keys(data).slice(0, 3);
        for (let index = 0; index < keyArr.length; index++) {
          const obj = {
            name: keyArr[index],
            value: data[keyArr[index]],
          };
          pieChartData.push(obj);
        }
        // console.log("PIE_DATA 1", pieChartData);
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
  const renderUserIds = (sentimentType) => {
    if (!csvData) return null;

    const { positive, negative, neutral } = csvData;
    let userIds = [];
    switch (sentimentType) {
      case "positive":
        userIds = positive;
        break;
      case "negative":
        userIds = negative;
        break;
      case "neutral":
        userIds = neutral;
        break;
      default:
        break;
    }

    return (
      <div>
        <h3>{sentimentType.toUpperCase()} User IDs:</h3>
        <ul>
          {userIds.map((userId, index) => (
            <li key={index}>{userId}</li>
          ))}
        </ul>
      </div>
    );
  };
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
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
            <textarea
              className={
                inputText.length > 0
                  ? "input-textarea-enable"
                  : "input-textarea"
              }
              placeholder="Type your words here..."
              value={inputText}
              onChange={handleInputChange}
              rows={9}
              cols={50}
            />
            <br></br>
            <button className="predict-button" onClick={handlePredictClick}>
              Predict
            </button>
            {prediction && (
              <div className="prediction-result">
                <h2
                  style={{
                    color:
                      prediction.toLocaleLowerCase() === "positive"
                        ? "green"
                        : prediction.toLocaleLowerCase() === "neutral"
                        ? "orange"
                        : "red",
                    marginTop: "2rem",
                  }}
                >
                  {prediction}
                </h2>
              </div>
            )}
            {error && (
              <div className="error-message">
                <p style={{ color: "red" }}>{error}</p>
              </div>
            )}{" "}
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
                {pieData.length <=0 && (
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

            {pieData && <PieChartComponent data={pieData} />}

            {/* {renderUserIds("positive")}
            {renderUserIds("negative")}
            {renderUserIds("neutral")} */}
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

const arrowStyle = {
  fontSize: "28px",
};
export default Home;

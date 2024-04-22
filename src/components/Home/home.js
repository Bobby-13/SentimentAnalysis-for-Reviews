

import React, { useState } from "react";
import "./home.css";
import axios from "axios";
import { PieChartComponent } from "../Models/models";

const Home = () => {
  const [inputText, setInputText] = useState("");
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [csvData, setCsvData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [toggle, setToggle] = useState(true);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handlePredictClick = () => {
    if (inputText.length <= 5) {
      console.log("Error");
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
          console.log(prediction)
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

    if (!file) {
      setError("Please select a file.");
      return;
    }

    if (file.size === 0) {
      setError("File is empty. Please select a non-empty file.");
      return;
    }

    setSelectedFile(file);
    setError("");
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    axios
      .post("http://localhost:8000/predict_csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const data = response.data;
        setCsvData(data);
        console.log(Object.keys(data).slice(0, 3));

        let pieChartData = [];
        let keyArr = Object.keys(data).slice(0, 3);
        for (let index = 0; index < keyArr.length; index++) {
          const obj = {
            name: keyArr[index],
            value: data[keyArr[index]],
          };
          pieChartData.push(obj);
        }
        console.log("PIE_DATA 1", pieChartData);
        setPieData(pieChartData);
        setError("");
      })
      .catch((error) => {
        setError("Error uploading CSV file.");
        console.error("Error uploading CSV file:", error);
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
        <button onClick={() => setToggle(true)} style={buttonStyle}> <span style={arrowStyle}>⬅</span></button>

        <button onClick={() => setToggle(false)}style={buttonStyle}><span style={arrowStyle}>➡</span></button>
        <h1>Sentiment Analysis of Reviews</h1>
        {toggle ? (
          <div>
            <textarea
              className="input-textarea"
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
                <h2 style={{ color: "green" }}>{prediction}</h2>
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
            <div style={{display:'flex'}}>
            <div className="file-upload-container">
              <input
                type="file"
                className="file-input"
                onChange={handleFileUpload}
              />
            </div>
            <button className="submit-btn" onClick={handleSubmit}>Submit</button>
            </div>
            {error && (
              <div className="error-message">
                <p style={{ color: "red" }}>{error}</p>
              </div>
            )}
            <br />

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
  display: "inline-block", 
  margin: "0 10px",
  fontSize: "10px",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "lightgrey",
  border: "none",
  outline: "none",
  cursor: "pointer",
};

const arrowStyle = {
  fontSize: "28px",
};
export default Home;

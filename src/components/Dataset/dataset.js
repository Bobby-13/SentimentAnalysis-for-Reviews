import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import axios from "axios";
import "./dataset.css";

function Dataset() {
  const [datasetData, setDatasetData] = useState([]);
  const [legendColors, setLegendColors] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/csv_file")
      .then((response) => {
        const data = response.data;
        const datasetList = Object.keys(data).map((datasetName) => {
          const dataset = data[datasetName];
          const totalRows = dataset["Total Rows"];
          const positiveCount = dataset["Positive Reviews"];
          const negativeCount = dataset["Negative Reviews"];
          const neutralCount = dataset["Neutral Reviews"];
          const modelAccuracies = dataset["Model Accuracies"];
          return {
            name: datasetName,
            totalRows,
            positiveCount,
            negativeCount,
            neutralCount,
            modelAccuracies: Object.entries(modelAccuracies).map(
              ([modelName, accuracy]) => ({
                name: modelName,
                accuracy,
              })
            ),
          };
        });
        setDatasetData(datasetList);

        const colors = datasetList[0]?.modelAccuracies.map(() => generateRandomColor());
        setLegendColors(colors);
      })
      .catch((error) => {
        console.error("Error fetching dataset data:", error);
      });
  }, []);

  const generateRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  const CustomLegendContent = () => (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {datasetData[0]?.modelAccuracies.map((entry, index) => (
        <li key={index} style={{ marginBottom: "4px" }}>
          <span
            style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              backgroundColor: legendColors[index],
              marginRight: "5px",
              marginBottom: "2px",
            }}
          ></span>
          {entry.name}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="dataset">
      <h1 className="head" style={{ marginBottom: "3rem" }}>
        Dataset Measures
      </h1>
      <div className="whole-container">
        <div style={{ paddingBottom: "50px" }}>
          {datasetData.map((dataset, index) => (
            <>
              <div key={index} className="d-1">
                <p className="heading1">{dataset.name}</p>
                <div className="d-2">
                  <PieChart width={600} height={400}>
                    <Pie
                      data={dataset.modelAccuracies}
                      dataKey="accuracy"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={170}
                      label
                    >
                      {dataset.modelAccuracies.map((entry, idx) => (
                        <Cell key={idx} fill={legendColors[idx]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      align="right"
                      verticalAlign="middle"
                      layout="vertical"
                      content={<CustomLegendContent />}
                      wrapperStyle={{ padding: "0%" }}
                    />
                  </PieChart>
                </div>
                <div className="d-2">
                  <p className="heading">Dataset Details</p>
                  <table border="1">
                    <thead>
                      <tr>
                        <th>Dataset Name</th>
                        <th>Total Rows</th>
                        <th>Positive Count</th>
                        <th>Negative Count</th>
                        <th>Neutral Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{dataset.name}</td>
                        <td>{dataset.totalRows}</td>
                        <td>{dataset.positiveCount}</td>
                        <td>{dataset.negativeCount}</td>
                        <td>{dataset.neutralCount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dataset;

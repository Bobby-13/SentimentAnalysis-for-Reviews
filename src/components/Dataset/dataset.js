import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import axios from "axios";
import "./dataset.css";

function Dataset() {
  const [datasetData, setDatasetData] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/csv_file")
      .then((response) => {
        const data = response.data;
        const extractedModels = Object.values(data).reduce((acc, cur) => {
          Object.keys(cur).forEach((model) => {
            if (!acc.includes(model)) {
              acc.push(model);
            }
          });
          return acc;
        }, []);

        console.log("csv_file",extractedModels)
        setModels(extractedModels);
        setDatasetData(
          Object.entries(data).map(([name, accuracies]) => ({
            name,
            accuracies: Object.entries(accuracies).map(([model, accuracy]) => ({
              name: model,
              accuracy,
            })),
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching dataset data:", error);
      });
  }, []);

  const generateRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  const CustomLegendContent = () => (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {models.map((model, index) => (
        <li key={index} style={{ marginBottom: "4px" }}>
          <span
            style={{
              display: "inline-block",
              width: "15px",
              height: "15px",
              backgroundColor: generateRandomColor(),
              marginRight: "5px",
              marginBottom: "2px",
            }}
          ></span>
          {model}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="dataset">
      <h1>Dataset Measures</h1>
      <div>
        <div style={{paddingBottom:'50px'}}>
          {datasetData.map((dataset, index) => (
            <>
              <div key={index} style={{ marginBottom: "20px", padding: "2px" }}>
                <h2>{dataset.name}</h2>
                <h3>Pie Chart</h3>
                <div style={{ display: "flex" }}>
                  <PieChart width={600} height={400}>
                    <Pie
                      data={dataset.accuracies}
                      dataKey="accuracy"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={170}
                      label
                    >
                      {dataset.accuracies.map((entry, idx) => (
                        <Cell key={idx} fill={generateRandomColor()} />
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
                <div>
                  <h3>Dataset Details</h3>
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

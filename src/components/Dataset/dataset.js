import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import axios from "axios";
import "./dataset.css"

function Dataset() {
  const [datasetData, setDatasetData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/csv_file")
      .then((response) => {
        const data = response.data;
        const datasetList = Object.keys(data).map((datasetName) => {
          const dataset = data[datasetName];
          const modelAccuracies = dataset["Model Accuracies"];
          return {
            name: datasetName,
            modelAccuracies: Object.entries(modelAccuracies).map(
              ([modelName, accuracy]) => ({
                name: modelName,
                models :accuracy,
              })
            ),
          };
        });
        console.log(datasetList);
        setDatasetData(datasetList);
      })
      .catch((error) => {
        console.error("Error fetching dataset data:", error);
      });
  }, []);

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="dataset">
      <h1 className="head" style={{ marginBottom: "3rem" }}>
        Dataset Measures
      </h1>
      <div className="whole-container">
        <div style={{ paddingBottom: "50px" }}>
          {datasetData.map((dataset, index) => (
            <div key={index} className="d-1">
              <p className="heading1">{dataset.name}</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <BarChart width={600} height={400} data={dataset.modelAccuracies}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="models" label={{ position: "top" }}>
                    {dataset.modelAccuracies.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
                <div style={{ marginTop: "20px" }}>
                  <ul style={{ listStyle: "none", display: "flex", justifyContent: "center", padding: 0 }}>
                    {dataset.modelAccuracies.map((entry, index) => (
                      <li key={`legend-${index}`} style={{ marginRight: "20px" }}>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dataset;

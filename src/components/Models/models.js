import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import "./models.css";
import axios from "axios";

export function BarChartComponent({ data }) {
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <BarChart width={600} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="models" label={{ position: "top" }}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
      <div style={{ marginTop: "20px" }}>
        <ul style={{ listStyle: "none", display: "flex", justifyContent: "center", padding: 0 }}>
          {data.map((entry, index) => (
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
  );
}

function Models() {
  const [modelsData, setModelsData] = useState([]);

  const barChartData = modelsData.map((model) => ({
    name: model.name,
    models: model.accuracy,
  }));

  useEffect(() => {
    axios
      .get("http://localhost:8000/model_accuracy")
      .then((response) => {
        const model_data = response.data;
        const modelsWithAccuracy = Object.entries(model_data).map(
          ([name, accuracy]) => ({ name, accuracy })
        );
        console.log("models_accuracy", modelsWithAccuracy);
        setModelsData(modelsWithAccuracy);
      })
      .catch((error) => {
        console.error("Error fetching model accuracy:", error);
      });
  }, []);

  return (
    <div className="model-wrapper">
      <div className="model-container">
        <p className="heading">Models with high accuracy</p>
        <BarChartComponent data={barChartData} />
      </div>
    </div>
  );
}

export default Models;

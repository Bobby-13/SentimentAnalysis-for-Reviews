import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import "./models.css";
import axios from "axios";
export function PieChartComponent({ data }) {
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  console.log("PIE_DATA", data);
  return (
    <div style={{ display: "flex", padding: "50px" }}>
      <PieChart width={470} height={410}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={180}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <div style={{ marginLeft: "50px", paddingTop: "100px" }}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {data.map((entry, index) => (
            <li key={`legend-${index}`} style={{ marginBottom: "8px" }}>
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

  const pieChartData = modelsData.map((model) => ({
    name: model.name,
    value: model.accuracy,
  }));
  useEffect(() => {
    axios
      .get("https://05d8-106-51-77-11.ngrok-free.app/model_accuracy")
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
    <div className="model">
      <h1>Models with high accuracy</h1>
      <PieChartComponent data={pieChartData} />
    </div>
  );
}

export default Models;

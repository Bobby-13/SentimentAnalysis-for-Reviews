import React from "react";
import ReactApexChart from "react-apexcharts";

class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [],
      options: {
        chart: {
          type: "bar",
          height: 350,
          stacked: true,
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
            },
          },
        },
        stroke: {
          width: 1,
          colors: ["#fff"],
        },
        title: {
          text: "Polarity Percentage for the Models",
          align: "center",
          margin: 10,
          style: {
            fontSize: "24px",
            fontWeight: "bold",
            color: "#333",
          },
        },
        xaxis: {
          max: 100,
          categories: [],
          labels: {
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        yaxis: {
          title: {
            text: undefined,
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        fill: {
          opacity: 1,
          colors: ["#03A9F4", "#FF9800"],
        },
        legend: {
            position: "bottom",
            horizontalAlign: "center",
            offsetY: 10,
            labels: {
              colors: ["#333"],
              useSeriesColors: false,
            },
            markers: {
              fillColors: ["#03A9F4", "#FF9800"],
              radius: 12,
              width: 12,
              height: 12,
              strokeWidth: 0,
              strokeColor: "#fff",
              shape: "square",
            },
        },
      },
    };
  }

  componentDidMount() {
    this.updateChart();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.barData !== this.props.barData) {
      this.updateChart();
    }
  }

  updateChart() {
    const { barData } = this.props;
    const categories = barData.map((item) => item.model);
    const positiveData = barData.map((item) => item.positive);
    const negativeData = barData.map((item) => item.negative);

    this.setState({
      series: [
        { name: "Positive", data: positiveData },
        { name: "Negative", data: negativeData },
      ],
      options: {
        ...this.state.options,
        xaxis: {
          ...this.state.options.xaxis,
          categories: categories,
        },
      },
    });
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={450}
        />
      </div>
    );
  }
}

export default ApexChart;

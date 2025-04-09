import { data, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { getData } from "../../API/dataAPI";

export interface PIE_DATA {
  id: string;
  options?: {
    title: {
      text: string;
      icon?: string;
      click: string;
    };
    chart: {
      displayLegend: boolean;
    };
  };
  data?: {
    apiUrl?: string;
    chart: PIE_API_RESPONSE_MODEL[];
  };
}

export interface PIE_API_RESPONSE_MODEL {
  labels: string;
  values: number;
  backgroundColor: string;
  hoverBackgroundColor: string;
}

function Pie(props: PIE_DATA) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: PIE_API_RESPONSE_MODEL[] = await getData(
          props?.data?.apiUrl || " "
        );
        if (response) {
          formatChartData(response);
        }
      } catch (err) {
        console.error("failed to load chart data", err);
      }
    };
    fetchData();
  }, []);

  const formatChartData = (chartValues: PIE_API_RESPONSE_MODEL[]) => {
    if (!Array.isArray(chartValues)) {
      console.error("Invalid chart data structure", chartValues);
      return;
    }
    const data = {
      labels: chartValues.map((item: { labels: string }) => item.labels),
      datasets: [
        {
          data: chartValues.map((item: { values: number }) => item.values),
          backgroundColor: chartValues.map(
            (item: { backgroundColor: string }) => item.backgroundColor
          ),
          hoverBackgroundColor: chartValues.map(
            (item: { hoverBackgroundColor: string }) =>
              item.hoverBackgroundColor
          ),
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };
    setChartData(data);
    setChartOptions(options);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div>
          <Link to="#" className="card-body-title">
            {props.options?.title.text}
          </Link>
          <Chart
            type="pie"
            data={chartData}
            options={chartOptions}
            className="w-full md:w-30rem"
          />
        </div>
      </div>
    </div>
  );
}

export default Pie;

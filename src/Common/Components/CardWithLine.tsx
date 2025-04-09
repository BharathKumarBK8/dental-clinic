import { Link } from "react-router-dom";
import {
  CARD_WITH_LINE_DATA,
  CWL_API_RESPONSE_MODEL,
} from "../../Models/PageModel";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { getData } from "../../API/dataAPI";

function CardWithLine(props: CARD_WITH_LINE_DATA) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [values, setValues] = useState<string | null>(null);
  const [percentage, setPercentage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response: CWL_API_RESPONSE_MODEL = await getData(
          props.data?.apiUrl || " "
        );
        if (response) {
          console.log("response", response);
          createChart(response);
          setValues(response.value || null);
          setPercentage(response.percentage || null);
        }
      } catch (err) {
        console.error("failed to load chart data", err);
      }
    };
    fetchData();
  }, []);

  const createChart = (chartValues: CWL_API_RESPONSE_MODEL) => {
    const bgColor = [
      chartValues?.bgcolor[0],
      chartValues.bgcolor[1],
      chartValues.bgcolor[2],
    ];
    const Data = [
      chartValues.data[0],
      chartValues.data[1],
      chartValues.data[2],
    ];

    const data = {
      labels: Data[0],
      datasets: [
        {
          data: Data[0],
          fill: false,
          borderDash: [2, 4],
          tension: 0.4,
          borderColor: bgColor[1],
          borderWidth: 2,
          pointStyle: false,
        },
        {
          data: Data[1],
          fill: true,
          tension: 0.4,
          borderColor: bgColor[0],
          borderWidth: 2,
          backgroundColor: (context: any) => {
            const { ctx } = context.chart;
            const gradientBg = ctx.createLinearGradient(0, 0, 0, 25);
            gradientBg.addColorStop(0, bgColor[1]);
            gradientBg.addColorStop(1, bgColor[2]);

            return gradientBg;
          },
          pointStyle: false,
        },
      ],
    };
    const options = {
      maintainAspectRatio: true,
      aspectRatio: 3,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  };

  return (
    <>
      <div className="card">
        <div className="card-body">
          <Link to="#" className="card-body-title">
            {props.options?.title.text}
          </Link>
          <div className="row align-items-center">
            <div className="col-md-7">
              <span className="d-flex align-items-center gap-2">
                <span className="val">{values}</span>
                {percentage && <span className="percentage">{percentage}</span>}
              </span>
            </div>
            <div className="col-md-5">
              {chartData && chartOptions && (
                <Chart type="line" data={chartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CardWithLine;

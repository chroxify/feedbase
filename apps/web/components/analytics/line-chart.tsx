'use client';

/* eslint-disable */
import { useEffect } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  Plugin,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { AnyObject } from 'chart.js/dist/types/basic';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  elements: {
    point: {
      // @ts-expect-error - type definition is wrong
      pointBackgroundColor: 'white',
      hoverBackgroundColor: 'white',
      borderWidth: 2,
      hoverRadius: 4,
      hoverBorderWidth: 2,
    },
    line: {
      tension: 0.4,
      borderWidth: 2,
      fill: true,
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: true,
        drawOnChartArea: false,
        drawTicks: true,
        color: 'rgba(51,54,61,1)',
        tickColor: 'rgba(51,54,61,1)',
      },
      ticks: {
        font: {
          size: 10,
        },
        padding: 6,
      },
    },
    y: {
      type: 'linear',
      grid: {
        display: true,
        drawTicks: true,
        color: 'rgba(51,54,61,1)',
        tickColor: 'rgba(51,54,61,1)',
      },
      border: {
        display: true,
        color: 'rgba(51,54,61,1)',
      },
      ticks: {
        font: {
          size: 10,
        },
        padding: 8,
        precision: 0,
      },
      min: 0,
    },
  },
};

const intersectDataVerticalLine: Plugin<'line', AnyObject>[] = [
  {
    id: 'intersectDataVerticalLine',
    beforeDraw: (chart: any) => {
      if (chart.getActiveElements().length) {
        const activePoint = chart.getActiveElements()[0];
        const chartArea = chart.chartArea;
        const ctx = chart.ctx;
        ctx.save();
        // grey vertical hover line - full chart height
        ctx.beginPath();
        ctx.moveTo(activePoint.element.x, chartArea.top);
        ctx.lineTo(activePoint.element.x, chartArea.bottom);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(143,160,255,0.3)';
        ctx.stroke();
        ctx.restore();

        // colored vertical hover line - ['data point' to chart bottom] - only for charts 1 dataset
        if (chart.data.datasets.length === 1) {
          ctx.beginPath();
          ctx.moveTo(activePoint.element.x, activePoint.element.y);
          ctx.lineTo(activePoint.element.x, chartArea.bottom);
          ctx.lineWidth = 2;
          ctx.strokeStyle = chart.data.datasets[0].borderColor;
          ctx.stroke();
          ctx.restore();
        }
      }
    },
  },
];
/* eslint-enable */

export default function LineChart({
  labels,
  data,
  dataLabel,
}: {
  labels: string[];
  data: number[];
  dataLabel: string;
}) {
  // BUG: For some reason the max value is not calculated correctly and it is the same for all charts as the highest value in any chart
  // options.scales!.y!.max = Math.max(...data) + 5;

  // Update step size of y axis (whole numbers only)
  // options.scales!.y!.ticks!.stepSize = Math.ceil(Math.max(...data) / 2);

  // Resize event listener
  useEffect(() => {
    function handleResize() {
      const chart = document.getElementById(dataLabel);
      if (chart) {
        chart.style.height = '250px';
        chart.style.width = '100%';
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dataLabel]);

  return (
    <Line
      key={dataLabel}
      id={dataLabel}
      options={options}
      data={{
        labels,
        datasets: [
          {
            label: dataLabel,
            data,
            fill: true,
            borderColor: 'rgba(143,160,255,1)',
            backgroundColor: 'rgba(143,160,255,0.3)',
          },
        ],
      }}
      plugins={intersectDataVerticalLine}
      className='h-full w-full'
    />
  );
}

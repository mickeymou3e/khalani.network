import ReactApexChart from 'react-apexcharts'
import useBreakpoint from '@/hooks/useBreakpoint'

const CandlestickChart = ({ data, theme }) => {
  const isDesktop = useBreakpoint('desktop')
  const options = {
    chart: {
      type: 'line',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true,
      },
      toolbar: {
        show: false,
      },
      fontFamily: 'aeonikFono, "aeonikFono Fallback"',
      foreColor: 'var(--color-grey-500)',
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    grid: {
      borderColor: 'var(--gridColor)',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    markers: {
      size: 0,
      hover: {
        size: 3,
      },
    },
    colors: ['var(--color-templar-red)'],
    title: {
      text: 'Validator Loss by Step',
      align: 'left',
    },
    annotations: {
      xaxis: [
        {
          strokeDashArray: 0,
          borderColor: 'var(--gridColor)',
        },
      ],
    },
    tooltip: {
      enabled: true,
      x: {
        show: true,
        formatter: function (val) {
          return `Step: ${val}`
        },
      },
      marker: {
        show: false,
      },
      y: {
        formatter: function (val) {
          return `Loss: ${parseFloat(val).toFixed(4)}`
        },
      },
    },
    xaxis: {
      type: 'numeric',
      title: {
        text: 'Training Step',
      },
      labels: {
        formatter: function (val) {
          return val.toFixed(0)
        },
        show: isDesktop,
        trim: true,
        showDuplicates: false,
        hideOverlappingLabels: true,
        style: {
          fontSize: '9px',
        },
      },
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
        color: 'var(--gridColor)',
      },
    },
    yaxis: {
      show: isDesktop,
      title: {
        text: 'Loss Value',
      },
      tooltip: {
        enabled: false,
      },
      type: 'numeric',
      labels: {
        formatter: function (val) {
          return val.toFixed(4)
        },
        style: {
          colors: ['var(--color-grey-500)'],
        },
      },
    },
  }

  if (!data?.chart) return null
  return <ReactApexChart type="line" options={options} height="100%" series={data?.chart?.series} />
}

export default CandlestickChart

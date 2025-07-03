import { Box, Typography } from "@mui/material";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_DIMENSIONS, VINTAGE_CHART_DIMENSIONS } from "../config";
import { useEffect, useState, useMemo } from "react";

export const EmptyBarChartComponent = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Ensure that the chart only renders on the client side
  }, []);

  const barChartData = useMemo(() => Array(6).fill({ scope1: 2500 }), []);

  if (!isMounted) return null; // Avoid rendering on the server

  return (
    <Box
      sx={{
        mt: 6,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        left: "-40px",
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
        TCO₂e PER MONTH
      </Typography>
      <BarChart
        width={VINTAGE_CHART_DIMENSIONS}
        height={CHART_DIMENSIONS}
        data={barChartData}
        margin={{ top: 10, right: 20, left: 30, bottom: 20 }}
      >
        <CartesianGrid horizontal={false} vertical={false} />
        <XAxis tick={false} />
        <YAxis
          tick={false}
          domain={[0, 2500]}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip wrapperStyle={{ fontSize: "12px" }} />
        <Bar dataKey="scope1" stackId="a" fill="#E0E0E0" barSize={15} />
      </BarChart>
    </Box>
  );
};

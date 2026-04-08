/**
 * ServiceRequestChart Component
 * Combined bar and line chart for service request trends
 */

import PropTypes from "prop-types";
import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import styles from "../../../../styles/serviceRequestChart.module.css";

const DEFAULT_DATA = [
  { month: "Jan", requests: 45, trend: 40 },
  { month: "Feb", requests: 52, trend: 48 },
  { month: "Mar", requests: 48, trend: 52 },
  { month: "Apr", requests: 70, trend: 58 },
  { month: "May", requests: 65, trend: 62 },
  { month: "Jun", requests: 95, trend: 75 },
  { month: "Jul", requests: 55, trend: 68 },
  { month: "Aug", requests: 48, trend: 58 },
  { month: "Sep", requests: 72, trend: 65 },
  { month: "Oct", requests: 68, trend: 70 },
  { month: "Nov", requests: 58, trend: 62 },
  { month: "Dec", requests: 52, trend: 55 },
];

const ServiceRequestChart = ({ data, title }) => {
  const chartData = useMemo(() => data || DEFAULT_DATA, [data]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              domain={[0, 100]}
            />
            <Bar
              dataKey="requests"
              fill="#d1fae5"
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

ServiceRequestChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      requests: PropTypes.number.isRequired,
      trend: PropTypes.number.isRequired,
    }),
  ),
  title: PropTypes.string,
};

ServiceRequestChart.defaultProps = {
  data: DEFAULT_DATA,
  title: "Service Request Trends",
};

export default ServiceRequestChart;

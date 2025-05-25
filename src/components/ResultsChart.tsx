"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface ResultsChartProps {
  options: Option[];
}

const COLORS = [
  "#6366F1", // indigo
  "#10B981", // emerald
  "#F59E0B", // amber
  "#EF4444", // red
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#F43F5E", // rose
];

export default function ResultsChart({ options }: ResultsChartProps) {
  const totalVotes = options.reduce((sum, o) => sum + o.votes, 0);

  const data = options.map((opt) => ({
    name: opt.text,
    value: opt.votes,
  }));

  return (
    <div className="w-full h-80">
      {totalVotes === 0 ? (
        <p className="text-gray-500 text-center">No votes yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

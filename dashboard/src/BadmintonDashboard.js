import React from "react";
import {
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

/* ---------------- DATA ---------------- */

const winLossData = [
  { team: "H10A", wins: 5, losses: 0 },
  { team: "H7", wins: 3, losses: 2 },
  { team: "H10B", wins: 3, losses: 2 },
  { team: "H8", wins: 1, losses: 3 },
  { team: "H1", wins: 1, losses: 1 },
  { team: "H5", wins: 0, losses: 2 },
];

const netGameData = [
  { team: "H10A", diff: 11 },
  { team: "H7", diff: 6 },
  { team: "H10B", diff: 4 },
  { team: "H8", diff: -5 },
  { team: "H1", diff: -2 },
  { team: "H5", diff: -5 },
];

const matchDistribution = [
  { name: "Pool", value: 6 },
  { name: "Semi-Final", value: 2 },
  { name: "Final", value: 1 },
  { name: "3rd Place", value: 1 },
];

const dailySchedule = [
  { day: "Day 1", matches: 3 },
  { day: "Day 2", matches: 2 },
  { day: "Day 3", matches: 3 },
  { day: "Day 4", matches: 2 },
];

const finalStandings = [
  { pos: 1, hostel: "H10A", captain: "Vaibhav Kataria", matches: 5, wins: 5, games: "14-3", rate: "100%" },
  { pos: 2, hostel: "H7", captain: "Dev Dixit", matches: 5, wins: 3, games: "10-4", rate: "60%" },
  { pos: 3, hostel: "H10B", captain: "Hitesh", matches: 5, wins: 3, games: "10-6", rate: "60%" },
  { pos: 4, hostel: "H8", captain: "Shivpriya", matches: 4, wins: 1, games: "5-10", rate: "25%" },
  { pos: 5, hostel: "H1", captain: "Ambaram Patel", matches: 2, wins: 1, games: "3-5", rate: "50%" },
  { pos: 6, hostel: "H5", captain: "Khwnasat Nazary", matches: 2, wins: 0, games: "1-6", rate: "0%" },
];

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b"];

/* ---------------- COMPONENT ---------------- */

function BadmintonDashboard() {
  return (
    <div style={page}>

      {/* Header */}
      <div style={header}>
        <h1 style={{ margin: 0 }}>Inter-Hostel Badminton Tournament 2025</h1>
        <p style={{ margin: "6px 0 0", color: "#555" }}>
          NIT Kurukshetra | April 11–14, 2025
        </p>
      </div>

      {/* Stats */}
      <div style={statsGrid}>
        <StatCard value="6" label="Teams" />
        <StatCard value="10" label="Matches" />
        <StatCard value="H10A" label="Champion" highlight />
      </div>

      {/* Charts */}
      <div style={grid2}>
        <ChartCard title="Win–Loss Record">
          <BarChart data={winLossData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="wins" fill="#22c55e" />
            <Bar dataKey="losses" fill="#ef4444" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Net Game Performance">
          <BarChart data={netGameData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="team" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="diff" fill="#3b82f6" />
          </BarChart>
        </ChartCard>
      </div>

      <div style={grid2}>
        <ChartCard title="Match Distribution">
          <PieChart>
            <Pie data={matchDistribution} dataKey="value" nameKey="name" outerRadius={90} label>
              {matchDistribution.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>

        <ChartCard title="Daily Schedule">
          <BarChart data={dailySchedule}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="matches" fill="#8b5cf6" />
          </BarChart>
        </ChartCard>
      </div>

      {/* FINAL STANDINGS */}
      <div style={standingsCard}>
        <h2>Final Standings</h2>

        {finalStandings.map(team => (
          <div key={team.pos} style={standingRow}>
            <div style={{ width: "60px", fontSize: "24px", fontWeight: "bold" }}>
              {team.pos === 1 ? "🥇" : team.pos === 2 ? "🥈" : team.pos === 3 ? "🥉" : `#${team.pos}`}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>{team.hostel}</div>
              <div style={{ color: "#555" }}>{team.captain}</div>
            </div>

            <StatMini value={team.matches} label="Matches" />
            <StatMini value={team.wins} label="Wins" color="#22c55e" />
            <StatMini value={team.games} label="Games" color="#7c3aed" />
            <StatMini value={team.rate} label="Win Rate" color="#2563eb" />
          </div>
        ))}
      </div>

    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

const page = {
  background: "#eef2ff",
  minHeight: "100vh",
  padding: "30px",
};

const header = {
  background: "white",
  padding: "24px",
  borderRadius: "14px",
  marginBottom: "24px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  marginBottom: "30px",
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "24px",
  marginBottom: "30px",
};

const standingsCard = {
  background: "white",
  padding: "24px",
  borderRadius: "14px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
};

const standingRow = {
  display: "flex",
  alignItems: "center",
  padding: "14px",
  borderRadius: "10px",
  background: "#f8fafc",
  marginBottom: "12px",
};

function StatCard({ value, label, highlight }) {
  return (
    <div style={{
      background: highlight ? "#facc15" : "white",
      padding: "20px",
      borderRadius: "14px",
      textAlign: "center",
      fontWeight: "bold",
      boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
    }}>
      <div style={{ fontSize: "28px" }}>{value}</div>
      <div style={{ color: "#555" }}>{label}</div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div style={{
      background: "white",
      padding: "20px",
      borderRadius: "14px",
      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
    }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function StatMini({ value, label, color }) {
  return (
    <div style={{ width: "90px", textAlign: "center" }}>
      <div style={{ fontWeight: "bold", color }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#666" }}>{label}</div>
    </div>
  );
}

export default BadmintonDashboard;


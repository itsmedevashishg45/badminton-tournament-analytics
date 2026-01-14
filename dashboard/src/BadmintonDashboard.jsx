import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Trophy, TrendingUp, Users, Calendar } from "lucide-react";

const BadmintonDashboard = () => {
  const tournamentData = {
    teams: [
      { id: 1, hostel: "H10A", captain: "Vaibhav Kataria", pool: "B", position: 1, matches: 5, wins: 5, losses: 0, gamesWon: 14, gamesLost: 3 },
      { id: 2, hostel: "H7", captain: "Dev Dixit", pool: "A", position: 2, matches: 5, wins: 3, losses: 2, gamesWon: 10, gamesLost: 4 },
      { id: 3, hostel: "H10B", captain: "Hitesh", pool: "A", position: 3, matches: 5, wins: 3, losses: 2, gamesWon: 10, gamesLost: 6 },
      { id: 4, hostel: "H8", captain: "Shivpriya", pool: "B", position: 4, matches: 4, wins: 1, losses: 3, gamesWon: 5, gamesLost: 10 },
      { id: 5, hostel: "H1", captain: "Ambaram Patel", pool: "A", position: 5, matches: 2, wins: 1, losses: 1, gamesWon: 3, gamesLost: 5 },
      { id: 6, hostel: "H5", captain: "Khwnasat Nazary", pool: "B", position: 6, matches: 2, wins: 0, losses: 2, gamesWon: 1, gamesLost: 6 },
    ],
    matches: [
      { id: 1, type: "Pool" },
      { id: 2, type: "Pool" },
      { id: 3, type: "Pool" },
      { id: 4, type: "Pool" },
      { id: 5, type: "Pool" },
      { id: 6, type: "Pool" },
      { id: 7, type: "Semi-Final" },
      { id: 8, type: "Semi-Final" },
      { id: 9, type: "3rd Place" },
      { id: 10, type: "Final" },
    ],
  };

  const stats = useMemo(() => {
    const totalMatches = tournamentData.matches.length;
    return {
      totalTeams: tournamentData.teams.length,
      totalMatches,
      champion: tournamentData.teams.find(t => t.position === 1)?.hostel,
    };
  }, []);

  const winLossData = tournamentData.teams.map(t => ({
    name: t.hostel,
    Wins: t.wins,
    Losses: t.losses,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h1 className="text-4xl font-bold text-gray-800">
            Inter-Hostel Badminton Tournament 2025
          </h1>
          <p className="text-gray-600">NIT Kurukshetra</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Stat icon={<Users />} label="Teams" value={stats.totalTeams} />
          <Stat icon={<Calendar />} label="Matches" value={stats.totalMatches} />
          <Stat icon={<Trophy />} label="Champion" value={stats.champion} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Win–Loss Record</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={winLossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Wins" fill="#2ecc71" />
              <Bar dataKey="Losses" fill="#e74c3c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="bg-white p-6 rounded-xl shadow text-center">
    <div className="flex justify-center mb-2 text-blue-600">{icon}</div>
    <div className="text-3xl font-bold">{value}</div>
    <div className="text-gray-600 text-sm">{label}</div>
  </div>
);

export default BadmintonDashboard;

import BadmintonDashboard from "./BadmintonDashboard";

function App() {
  return <BadmintonDashboard />;
}

export default App;
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Users, Calendar } from 'lucide-react';

const BadmintonDashboard = () => {
  // Tournament Data
  const tournamentData = {
    teams: [
      { id: 1, hostel: 'H10A', captain: 'Vaibhav Kataria', pool: 'B', position: 1, matches: 5, wins: 5, losses: 0, gamesWon: 14, gamesLost: 3 },
      { id: 2, hostel: 'H7', captain: 'Dev Dixit', pool: 'A', position: 2, matches: 5, wins: 3, losses: 2, gamesWon: 10, gamesLost: 4 },
      { id: 3, hostel: 'H10B', captain: 'Hitesh', pool: 'A', position: 3, matches: 5, wins: 3, losses: 2, gamesWon: 10, gamesLost: 6 },
      { id: 4, hostel: 'H8', captain: 'Shivpriya', pool: 'B', position: 4, matches: 4, wins: 1, losses: 3, gamesWon: 5, gamesLost: 10 },
      { id: 5, hostel: 'H1', captain: 'Ambaram Patel', pool: 'A', position: 5, matches: 2, wins: 1, losses: 1, gamesWon: 3, gamesLost: 5 },
      { id: 6, hostel: 'H5', captain: 'Khwnasat Nazary', pool: 'B', position: 6, matches: 2, wins: 0, losses: 2, gamesWon: 1, gamesLost: 6 },
    ],
    matches: [
      { id: 1, date: '2025-04-11', type: 'Pool', team1: 'H7', team2: 'H1', score1: 3, score2: 0, pool: 'A' },
      { id: 2, date: '2025-04-11', type: 'Pool', team1: 'H10A', team2: 'H8', score1: 3, score2: 1, pool: 'B' },
      { id: 3, date: '2025-04-11', type: 'Pool', team1: 'H10A', team2: 'H5', score1: 3, score2: 0, pool: 'B' },
      { id: 4, date: '2025-04-12', type: 'Pool', team1: 'H8', team2: 'H5', score1: 3, score2: 1, pool: 'B' },
      { id: 5, date: '2025-04-12', type: 'Pool', team1: 'H1', team2: 'H10B', score1: 3, score2: 2, pool: 'A' },
      { id: 6, date: '2025-04-13', type: 'Pool', team1: 'H10B', team2: 'H7', score1: 3, score2: 1, pool: 'A' },
      { id: 7, date: '2025-04-13', type: 'Semi-Final', team1: 'H7', team2: 'H8', score1: 3, score2: 0, pool: null },
      { id: 8, date: '2025-04-13', type: 'Semi-Final', team1: 'H10A', team2: 'H10B', score1: 3, score2: 0, pool: null },
      { id: 9, date: '2025-04-14', type: '3rd Place', team1: 'H10B', team2: 'H8', score1: 3, score2: 0, pool: null },
      { id: 10, date: '2025-04-14', type: 'Final', team1: 'H7', team2: 'H10A', score1: 2, score2: 3, pool: null },
    ]
  };

  const [selectedView, setSelectedView] = useState('overview');
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Computed Statistics
  const stats = useMemo(() => {
    const totalMatches = tournamentData.matches.length;
    const closeMatches = tournamentData.matches.filter(m => Math.abs(m.score1 - m.score2) <= 1).length;
    const avgGamesPerMatch = tournamentData.matches.reduce((sum, m) => sum + m.score1 + m.score2, 0) / totalMatches;
    
    return {
      totalTeams: tournamentData.teams.length,
      totalMatches,
      closeMatches,
      avgGamesPerMatch: avgGamesPerMatch.toFixed(1),
      champion: tournamentData.teams.find(t => t.position === 1)?.hostel
    };
  }, []);

  // Chart Data
  const winLossData = tournamentData.teams.map(t => ({
    name: t.hostel,
    Wins: t.wins,
    Losses: t.losses,
    position: t.position
  })).sort((a, b) => a.position - b.position);

  const gamesDiffData = tournamentData.teams.map(t => ({
    name: t.hostel,
    'Game Difference': t.gamesWon - t.gamesLost,
    position: t.position
  })).sort((a, b) => a.position - b.position);

  const matchTypeData = [
    { name: 'Pool', value: tournamentData.matches.filter(m => m.type === 'Pool').length },
    { name: 'Semi-Final', value: tournamentData.matches.filter(m => m.type === 'Semi-Final').length },
    { name: 'Final', value: tournamentData.matches.filter(m => m.type === 'Final').length },
    { name: '3rd Place', value: tournamentData.matches.filter(m => m.type === '3rd Place').length },
  ];

  const dailyMatchData = [
    { day: 'Day 1\nApr 11', matches: 3 },
    { day: 'Day 2\nApr 12', matches: 2 },
    { day: 'Day 3\nApr 13', matches: 3 },
    { day: 'Day 4\nApr 14', matches: 2 },
  ];

  const COLORS = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];

  // Team Detail View
  const TeamDetailView = ({ team }) => {
    const teamMatches = tournamentData.matches.filter(
      m => m.team1 === team.hostel || m.team2 === team.hostel
    );

    const matchResults = teamMatches.map((m, idx) => {
      const isTeam1 = m.team1 === team.hostel;
      const won = (isTeam1 && m.score1 > m.score2) || (!isTeam1 && m.score2 > m.score1);
      return {
        match: idx + 1,
        opponent: isTeam1 ? m.team2 : m.team1,
        result: won ? 'W' : 'L',
        score: isTeam1 ? `${m.score1}-${m.score2}` : `${m.score2}-${m.score1}`,
        type: m.type
      };
    });

    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{team.hostel}</h2>
            <p className="text-gray-600">Captain: {team.captain}</p>
            <p className="text-gray-500">Pool {team.pool}</p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-2">
              {team.position === 1 ? '🥇' : team.position === 2 ? '🥈' : team.position === 3 ? '🥉' : `#${team.position}`}
            </div>
            <p className="text-sm text-gray-600">Final Position</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{team.matches}</div>
            <div className="text-xs text-gray-600">Matches</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{team.wins}</div>
            <div className="text-xs text-gray-600">Wins</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{team.gamesWon}</div>
            <div className="text-xs text-gray-600">Games Won</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {((team.wins / team.matches) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Win Rate</div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Match History</h3>
        <div className="space-y-2">
          {matchResults.map((result, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-3 rounded-lg ${
                result.result === 'W' ? 'bg-green-50' : 'bg-red-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`font-bold ${result.result === 'W' ? 'text-green-600' : 'text-red-600'}`}>
                  {result.result}
                </span>
                <span className="text-gray-700">vs {result.opponent}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">{result.type}</span>
                <span className="font-semibold">{result.score}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setSelectedTeam(null)}
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
        >
          Back to Overview
        </button>
      </div>
    );
  };

  if (selectedTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-4xl mx-auto">
          <TeamDetailView team={selectedTeam} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Inter-Hostel Badminton Tournament 2025
              </h1>
              <p className="text-gray-600">NIT Kurukshetra | April 11-14, 2025</p>
            </div>
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
        </div>

        {/* Key Statistics */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{stats.totalTeams}</div>
            <div className="text-sm text-gray-600">Teams</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{stats.totalMatches}</div>
            <div className="text-sm text-gray-600">Matches</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-3xl font-bold text-gray-800">{stats.closeMatches}</div>
            <div className="text-sm text-gray-600">Close Matches</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-2xl mb-2">🏸</div>
            <div className="text-3xl font-bold text-gray-800">{stats.avgGamesPerMatch}</div>
            <div className="text-sm text-gray-600">Avg Games/Match</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg shadow-md p-6 text-center text-white">
            <Trophy className="w-8 h-8 mx-auto mb-2" />
            <div className="text-3xl font-bold">{stats.champion}</div>
            <div className="text-sm">Champion</div>
          </div>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Win-Loss Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Win-Loss Record</h2>
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

          {/* Game Difference */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Net Game Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gamesDiffData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Game Difference" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Match Type Distribution */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Match Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={matchTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {matchTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Schedule */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Daily Schedule</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyMatchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="matches" fill="#9b59b6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Standings */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Final Standings</h2>
          <div className="space-y-3">
            {tournamentData.teams.sort((a, b) => a.position - b.position).map((team) => (
              <div
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold w-12">
                    {team.position === 1 ? '🥇' : team.position === 2 ? '🥈' : team.position === 3 ? '🥉' : `#${team.position}`}
                  </div>
                  <div>
                    <div className="font-semibold text-lg text-gray-800">{team.hostel}</div>
                    <div className="text-sm text-gray-600">{team.captain}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-gray-800">{team.matches}</div>
                    <div className="text-gray-500">Matches</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{team.wins}</div>
                    <div className="text-gray-500">Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">{team.gamesWon}-{team.gamesLost}</div>
                    <div className="text-gray-500">Games</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{((team.wins/team.matches)*100).toFixed(0)}%</div>
                    <div className="text-gray-500">Win Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadmintonDashboard;

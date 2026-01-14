"""
Badminton Tournament Analytics
Python Data Analysis & Visualization Script (SQL Server Version)
Author: Devashish
Year: 2025
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pyodbc
from sqlalchemy import create_engine
import urllib
import warnings

warnings.filterwarnings("ignore")

# Plot styling
plt.style.use("seaborn-v0_8-darkgrid")
sns.set_palette("husl")

from config import CONNECTION_STRING


class BadmintonAnalytics:
    """Main analytics class for tournament data"""

    def __init__(self, connection_string):
        params = urllib.parse.quote_plus(connection_string)
        self.engine = create_engine(
            f"mssql+pyodbc:///?odbc_connect={params}"
        )
        self.conn = pyodbc.connect(connection_string)

    # --------------------------------------------------
    # LOAD DATA
    # --------------------------------------------------
    def load_data(self):
        print("Loading tournament data...")

        self.tournaments = pd.read_sql("SELECT * FROM tournaments", self.engine)
        self.hostels = pd.read_sql("SELECT * FROM hostels", self.engine)
        self.teams = pd.read_sql(
            "SELECT * FROM teams WHERE tournament_id = 3", self.engine
        )
        self.matches = pd.read_sql(
            "SELECT * FROM matches WHERE tournament_id = 3", self.engine
        )
        self.pool_standings = pd.read_sql(
            "SELECT * FROM pool_standings WHERE tournament_id = 3", self.engine
        )
        self.team_members = pd.read_sql(
            """
            SELECT tm.*
            FROM team_members tm
            JOIN teams t ON tm.team_id = t.team_id
            WHERE t.tournament_id = 3
            """,
            self.engine,
        )

        self.matches["match_date"] = pd.to_datetime(self.matches["match_date"])
        self.teams["registration_timestamp"] = pd.to_datetime(
            self.teams["registration_timestamp"]
        )

        print(f"Loaded {len(self.teams)} teams, {len(self.matches)} matches")

    # --------------------------------------------------
    # MATCH DATAFRAME
    # --------------------------------------------------
    def create_match_dataframe(self):
        df = self.matches.copy()

        df = df.merge(
            self.teams[["team_id", "hostel_id"]].rename(
                columns={"team_id": "team1_id", "hostel_id": "team1_hostel"}
            ),
            on="team1_id",
        )
        df = df.merge(
            self.teams[["team_id", "hostel_id"]].rename(
                columns={"team_id": "team2_id", "hostel_id": "team2_hostel"}
            ),
            on="team2_id",
        )
        df = df.merge(
            self.teams[["team_id", "hostel_id"]].rename(
                columns={
                    "team_id": "winner_team_id",
                    "hostel_id": "winner_hostel",
                }
            ),
            on="winner_team_id",
        )

        df = df.merge(
            self.hostels[["hostel_id", "hostel_code"]].rename(
                columns={"hostel_id": "team1_hostel", "hostel_code": "team1_code"}
            ),
            on="team1_hostel",
        )
        df = df.merge(
            self.hostels[["hostel_id", "hostel_code"]].rename(
                columns={"hostel_id": "team2_hostel", "hostel_code": "team2_code"}
            ),
            on="team2_hostel",
        )
        df = df.merge(
            self.hostels[["hostel_id", "hostel_code"]].rename(
                columns={"hostel_id": "winner_hostel", "hostel_code": "winner_code"}
            ),
            on="winner_hostel",
        )

        df["score_margin"] = abs(df["team1_score"] - df["team2_score"])
        return df

    # --------------------------------------------------
    # TEAM PERFORMANCE
    # --------------------------------------------------
    def team_performance_summary(self):
        performance = []

        for _, team in self.teams.iterrows():
            team_matches = self.matches[
                (self.matches["team1_id"] == team["team_id"])
                | (self.matches["team2_id"] == team["team_id"])
            ]

            wins = len(
                team_matches[
                    team_matches["winner_team_id"] == team["team_id"]
                ]
            )
            losses = len(team_matches) - wins

            games_won = (
                team_matches[team_matches["team1_id"] == team["team_id"]][
                    "team1_score"
                ].sum()
                + team_matches[
                    team_matches["team2_id"] == team["team_id"]
                ]["team2_score"].sum()
            )

            games_lost = (
                team_matches[team_matches["team1_id"] == team["team_id"]][
                    "team2_score"
                ].sum()
                + team_matches[
                    team_matches["team2_id"] == team["team_id"]
                ]["team1_score"].sum()
            )

            hostel = self.hostels[
                self.hostels["hostel_id"] == team["hostel_id"]
            ]["hostel_code"].values[0]

            performance.append(
                {
                    "hostel": hostel,
                    "matches_played": len(team_matches),
                    "wins": wins,
                    "losses": losses,
                    "win_rate": wins / len(team_matches)
                    if len(team_matches) > 0
                    else 0,
                    "games_won": int(games_won),
                    "games_lost": int(games_lost),
                    "game_diff": int(games_won - games_lost),
                    "final_position": team["final_position"],
                }
            )

        return pd.DataFrame(performance).sort_values("final_position")

    # --------------------------------------------------
    # VISUALIZATIONS
    # --------------------------------------------------
    def visualize_tournament_overview(self):
        perf = self.team_performance_summary()

        plt.figure(figsize=(10, 6))
        plt.bar(perf["hostel"], perf["wins"], label="Wins")
        plt.bar(perf["hostel"], perf["losses"], bottom=perf["wins"], label="Losses")
        plt.title("Tournament Win/Loss Overview")
        plt.ylabel("Matches")
        plt.legend()
        plt.tight_layout()
        plt.savefig("tournament_overview.png", dpi=300)
        print("Saved: tournament_overview.png")

    def visualize_team_performance(self):
        perf = self.team_performance_summary()

        plt.figure(figsize=(10, 6))
        sns.barplot(
            data=perf,
            x="win_rate",
            y="hostel",
            orient="h",
        )
        plt.xlabel("Win Rate")
        plt.title("Team Win Rates")
        plt.tight_layout()
        plt.savefig("team_performance.png", dpi=300)
        print("Saved: team_performance.png")

    def visualize_match_analysis(self):
        df = self.create_match_dataframe()

        plt.figure(figsize=(10, 6))
        plt.hist(df["score_margin"], bins=5, edgecolor="black")
        plt.xlabel("Score Margin")
        plt.ylabel("Frequency")
        plt.title("Match Competitiveness")
        plt.tight_layout()
        plt.savefig("match_analysis.png", dpi=300)
        print("Saved: match_analysis.png")

    # --------------------------------------------------
    # STATISTICS REPORT
    # --------------------------------------------------
    def generate_statistics_report(self):
        perf = self.team_performance_summary()
        df = self.create_match_dataframe()

        report = {
            "Tournament Statistics": {
                "Total Teams": len(self.teams),
                "Total Matches": len(self.matches),
            },
            "Match Statistics": {
                "Most Common Score Margin": int(df["score_margin"].mode()[0]),
                "Close Matches (≤1)": len(df[df["score_margin"] <= 1]),
            },
            "Team Performance": {
                "Best Team": perf.iloc[0]["hostel"],
                "Best Game Difference": int(perf["game_diff"].max()),
            },
        }

        return report

    # --------------------------------------------------
    # EXPORTS
    # --------------------------------------------------
    def export_analysis_results(self):
        self.team_performance_summary().to_csv(
            "team_performance_summary.csv", index=False
        )
        self.create_match_dataframe().to_csv(
            "match_details.csv", index=False
        )

        stats = self.generate_statistics_report()
        rows = []
        for cat, metrics in stats.items():
            for k, v in metrics.items():
                rows.append({"Category": cat, "Metric": k, "Value": v})

        pd.DataFrame(rows).to_csv("tournament_statistics.csv", index=False)
        print("Exported: team_performance_summary.csv")
        print("Exported: match_details.csv")
        print("Exported: tournament_statistics.csv")


# --------------------------------------------------
# MAIN
# --------------------------------------------------
if __name__ == "__main__":
    print("=" * 60)
    print("BADMINTON TOURNAMENT ANALYTICS - SQL SERVER VERSION")
    print("=" * 60)

    analytics = BadmintonAnalytics(CONNECTION_STRING)
    analytics.load_data()

    print("\nGenerating visualizations...")
    analytics.visualize_tournament_overview()
    analytics.visualize_team_performance()
    analytics.visualize_match_analysis()

    print("\nExporting analysis results...")
    analytics.export_analysis_results()

    print("\n" + "=" * 60)
    print("Analysis complete! Check output files.")
    print("=" * 60)


-- =====================================================
-- BADMINTON TOURNAMENT DATABASE SCHEMA
-- Microsoft SQL Server (T-SQL)
-- Inter-Hostel Tournament Management System
-- NIT Kurukshetra (2023-2025)
-- =====================================================

-- Drop existing tables if they exist
IF OBJECT_ID('match_games', 'U') IS NOT NULL DROP TABLE match_games;
IF OBJECT_ID('matches', 'U') IS NOT NULL DROP TABLE matches;
IF OBJECT_ID('pool_standings', 'U') IS NOT NULL DROP TABLE pool_standings;
IF OBJECT_ID('team_members', 'U') IS NOT NULL DROP TABLE team_members;
IF OBJECT_ID('teams', 'U') IS NOT NULL DROP TABLE teams;
IF OBJECT_ID('hostels', 'U') IS NOT NULL DROP TABLE hostels;
IF OBJECT_ID('tournaments', 'U') IS NOT NULL DROP TABLE tournaments;
GO

-- =====================================================
-- TABLE 1: TOURNAMENTS
-- =====================================================
CREATE TABLE tournaments (
    tournament_id INT IDENTITY(1,1) PRIMARY KEY,
    tournament_name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    year INT NOT NULL,
    format VARCHAR(50) DEFAULT 'Thomas Cup',
    shuttle_type VARCHAR(50) DEFAULT 'Yonex Mavis 350',
    total_teams INT,
    status VARCHAR(20) DEFAULT 'Completed',
    convenor_name VARCHAR(100),
    convenor_roll VARCHAR(20)
);
GO

-- =====================================================
-- TABLE 2: HOSTELS
-- =====================================================
CREATE TABLE hostels (
    hostel_id INT IDENTITY(1,1) PRIMARY KEY,
    hostel_code VARCHAR(10) UNIQUE NOT NULL,
    hostel_name VARCHAR(100),
    total_capacity INT,
    is_active BIT DEFAULT 1
);
GO

-- =====================================================
-- TABLE 3: TEAMS
-- =====================================================
CREATE TABLE teams (
    team_id INT IDENTITY(1,1) PRIMARY KEY,
    tournament_id INT FOREIGN KEY REFERENCES tournaments(tournament_id),
    hostel_id INT FOREIGN KEY REFERENCES hostels(hostel_id),
    captain_name VARCHAR(100) NOT NULL,
    captain_roll VARCHAR(20) NOT NULL,
    captain_contact VARCHAR(15),
    registration_timestamp DATETIME,
    pool_assigned VARCHAR(10),
    final_position INT,
    status VARCHAR(20) DEFAULT 'Active',
    CONSTRAINT UQ_tournament_hostel UNIQUE(tournament_id, hostel_id)
);
GO

-- =====================================================
-- TABLE 4: TEAM_MEMBERS
-- =====================================================
CREATE TABLE team_members (
    member_id INT IDENTITY(1,1) PRIMARY KEY,
    team_id INT FOREIGN KEY REFERENCES teams(team_id),
    player_name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(20),
    is_captain BIT DEFAULT 0,
    games_played INT DEFAULT 0,
    games_won INT DEFAULT 0
);
GO

-- =====================================================
-- TABLE 5: MATCHES
-- =====================================================
CREATE TABLE matches (
    match_id INT IDENTITY(1,1) PRIMARY KEY,
    tournament_id INT FOREIGN KEY REFERENCES tournaments(tournament_id),
    match_number VARCHAR(10) NOT NULL,
    match_date DATE NOT NULL,
    match_type VARCHAR(20) NOT NULL, -- Pool, Semi-Final, Final, 3rd Place
    team1_id INT FOREIGN KEY REFERENCES teams(team_id),
    team2_id INT FOREIGN KEY REFERENCES teams(team_id),
    winner_team_id INT FOREIGN KEY REFERENCES teams(team_id),
    team1_score INT DEFAULT 0,
    team2_score INT DEFAULT 0,
    pool VARCHAR(10),
    venue VARCHAR(100) DEFAULT 'NIT Kurukshetra Sports Complex'
);
GO

-- =====================================================
-- TABLE 6: MATCH_GAMES
-- =====================================================
CREATE TABLE match_games (
    game_id INT IDENTITY(1,1) PRIMARY KEY,
    match_id INT FOREIGN KEY REFERENCES matches(match_id),
    game_number INT NOT NULL,
    game_type VARCHAR(20) NOT NULL, -- Singles, Doubles
    team1_player1 VARCHAR(100),
    team1_player2 VARCHAR(100), -- NULL for singles
    team2_player1 VARCHAR(100),
    team2_player2 VARCHAR(100), -- NULL for singles
    winner_team INT, -- 1 or 2
    set1_team1_score INT,
    set1_team2_score INT,
    set2_team1_score INT,
    set2_team2_score INT,
    set3_team1_score INT,
    set3_team2_score INT,
    total_sets_played INT,
    CONSTRAINT CHK_game_number CHECK (game_number BETWEEN 1 AND 5)
);
GO

-- =====================================================
-- TABLE 7: POOL_STANDINGS
-- =====================================================
CREATE TABLE pool_standings (
    standing_id INT IDENTITY(1,1) PRIMARY KEY,
    tournament_id INT FOREIGN KEY REFERENCES tournaments(tournament_id),
    team_id INT FOREIGN KEY REFERENCES teams(team_id),
    pool VARCHAR(10) NOT NULL,
    matches_played INT DEFAULT 0,
    matches_won INT DEFAULT 0,
    matches_lost INT DEFAULT 0,
    games_won INT DEFAULT 0,
    games_lost INT DEFAULT 0,
    points INT DEFAULT 0, -- 2 for win, 1 for loss
    pool_rank INT
);
GO

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert Tournaments
SET IDENTITY_INSERT tournaments ON;
INSERT INTO tournaments (tournament_id, tournament_name, start_date, end_date, year, total_teams, convenor_name, convenor_roll)
VALUES 
    (1, 'Inter-Hostel Badminton Tournament', '2023-04-10', '2023-04-13', 2023, 8, 'Tournament Convenor', ''),
    (2, 'Inter-Hostel Badminton Tournament', '2024-04-08', '2024-04-11', 2024, 8, 'Tournament Convenor', ''),
    (3, 'Inter-Hostel Badminton Tournament', '2025-04-11', '2025-04-14', 2025, 6, 'Devashish', '12112002');
SET IDENTITY_INSERT tournaments OFF;
GO

-- Insert Hostels
SET IDENTITY_INSERT hostels ON;
INSERT INTO hostels (hostel_id, hostel_code, hostel_name, total_capacity)
VALUES 
    (1, 'H1', 'Hostel 1', 250),
    (2, 'H3', 'Hostel 3', 250),
    (3, 'H5', 'Eklavya Bhawan', 300),
    (4, 'H7', 'Hostel 7', 250),
    (5, 'H8', 'Hostel 8', 250),
    (6, 'H9', 'Hostel 9', 250),
    (7, 'H10A', 'Hostel 10 Block A', 200),
    (8, 'H10B', 'Hostel 10 Block B', 200);
SET IDENTITY_INSERT hostels OFF;
GO

-- Insert Teams for 2025 Tournament
SET IDENTITY_INSERT teams ON;
INSERT INTO teams (team_id, tournament_id, hostel_id, captain_name, captain_roll, captain_contact, registration_timestamp, pool_assigned, final_position, status)
VALUES 
    (1, 3, 4, 'Dev Dixit', '12012111', '9918568186', '2025-04-10 15:29:04', 'A', 2, 'Active'),
    (2, 3, 8, 'Hitesh', '12215152', '9306956601', '2025-04-10 19:52:32', 'A', 3, 'Active'),
    (3, 3, 1, 'Ambaram Patel', '124108046', '7600657046', '2025-04-10 21:21:24', 'A', 5, 'Active'),
    (4, 3, 5, 'Shivpriya', '123101118', '9799178896', '2025-04-10 21:52:09', 'B', 4, 'Active'),
    (5, 3, 7, 'Vaibhav Kataria', '12217083', '9034434798', '2025-04-10 22:03:22', 'B', 1, 'Active'),
    (6, 3, 2, 'Abhishek', '124106020', '9053512173', '2025-04-10 22:28:17', NULL, NULL, 'Withdrawn'),
    (7, 3, 3, 'Khwnasat Giri Nazary', '523110021', '7896476728', '2025-04-10 22:34:09', 'B', 6, 'Active'),
    (8, 3, 6, 'Rakshit', '123108008', '8872548043', '2025-04-10 22:37:30', NULL, NULL, 'Withdrawn');
SET IDENTITY_INSERT teams OFF;
GO

-- Insert Team Members for H7
INSERT INTO team_members (team_id, player_name, roll_number, is_captain)
VALUES 
    (1, 'Dev Dixit', '12012111', 1),
    (1, 'Devashish', '12112002', 0),
    (1, 'Anuj', '12112043', 0),
    (1, 'Vipin', '12112149', 0),
    (1, 'Ayush', '12112037', 0),
    (1, 'Govind', '12114153', 0);
GO

-- Insert Team Members for H10B
INSERT INTO team_members (team_id, player_name, roll_number, is_captain)
VALUES 
    (2, 'Hitesh', '12215152', 1),
    (2, 'Vansh', '12215129', 0),
    (2, 'Rahul', '7061', 0),
    (2, 'Purav', '12215050', 0),
    (2, 'Ayush', '12211098', 0),
    (2, 'Krish', '12216129', 0);
GO

-- Insert Team Members for H1
INSERT INTO team_members (team_id, player_name, roll_number, is_captain)
VALUES 
    (3, 'Ambaram Patel', '124108046', 1),
    (3, 'Sabhye', '124101044', 0),
    (3, 'Parbhat', '124104005', 0),
    (3, 'Abhay', '124110040', 0),
    (3, 'Mukesh', '124108051', 0),
    (3, 'Deepak', '124101060', 0);
GO

-- Insert Team Members for H8
INSERT INTO team_members (team_id, player_name, roll_number, is_captain)
VALUES 
    (4, 'Shivpriya', '123101118', 1),
    (4, 'Aman Kumar', '123101018', 0),
    (4, 'Sourav', '123102163', 0),
    (4, 'Akshat', '123102002', 0),
    (4, 'Tanishk', '123105103', 0),
    (4, 'Abhinav', '123110017', 0);
GO

-- Insert Team Members for H10A
INSERT INTO team_members (team_id, player_name, roll_number, is_captain)
VALUES 
    (5, 'Vaibhav Kataria', '12217083', 1),
    (5, 'Chaitanya Pandey', '12212209', 0),
    (5, 'Sushant Ahuja', '12212008', 0),
    (5, 'Himanshu Jangid', '12112062', 0),
    (5, 'Rupesh', '12212228', 0),
    (5, 'Apoorva', '12217075', 0);
GO

-- Insert Team Members for H5
INSERT INTO team_members (team_id, player_name, roll_number, is_captain)
VALUES 
    (7, 'Khwnasat Giri Nazary', '523110021', 1),
    (7, 'Lalit', '123106029', 0),
    (7, 'Sarthak Gupta', '42310011', 0),
    (7, 'Ayush', '123105035', 0),
    (7, 'Shivam', '123105023', 0),
    (7, 'Devansh', '123108032', 0);
GO

-- Insert Matches for 2025 Tournament
SET IDENTITY_INSERT matches ON;
INSERT INTO matches (match_id, tournament_id, match_number, match_date, match_type, team1_id, team2_id, winner_team_id, team1_score, team2_score, pool)
VALUES 
    -- Pool Matches
    (1, 3, 'M1', '2025-04-11', 'Pool', 1, 3, 1, 3, 0, 'A'), -- H7 vs H1
    (2, 3, 'M2', '2025-04-11', 'Pool', 5, 4, 5, 3, 1, 'B'), -- H10A vs H8
    (3, 3, 'M3', '2025-04-11', 'Pool', 5, 7, 5, 3, 0, 'B'), -- H10A vs H5
    (4, 3, 'M4', '2025-04-12', 'Pool', 4, 7, 4, 3, 1, 'B'), -- H8 vs H5
    (5, 3, 'M5', '2025-04-12', 'Pool', 3, 2, 3, 3, 2, 'A'), -- H1 vs H10B
    (6, 3, 'M6', '2025-04-13', 'Pool', 2, 1, 2, 3, 1, 'A'), -- H10B vs H7
    -- Semi-Finals
    (7, 3, 'SF1', '2025-04-13', 'Semi-Final', 1, 4, 1, 3, 0, NULL), -- H7 vs H8
    (8, 3, 'SF2', '2025-04-13', 'Semi-Final', 5, 2, 5, 3, 0, NULL), -- H10A vs H10B
    -- Finals
    (9, 3, '3RD', '2025-04-14', '3rd Place', 2, 4, 2, 3, 0, NULL), -- H10B vs H8
    (10, 3, 'FINAL', '2025-04-14', 'Final', 1, 5, 5, 3, 2, NULL); -- H7 vs H10A
SET IDENTITY_INSERT matches OFF;
GO

-- Insert Pool Standings for 2025
INSERT INTO pool_standings (tournament_id, team_id, pool, matches_played, matches_won, matches_lost, games_won, games_lost, points, pool_rank)
VALUES 
    -- Pool A
    (3, 1, 'A', 2, 1, 1, 4, 1, 3, 1), -- H7
    (3, 2, 'A', 2, 1, 1, 4, 3, 3, 2), -- H10B
    (3, 3, 'A', 2, 1, 1, 3, 5, 3, 3), -- H1
    -- Pool B
    (3, 5, 'B', 2, 2, 0, 6, 1, 6, 1), -- H10A
    (3, 4, 'B', 2, 1, 1, 4, 4, 3, 2), -- H8
    (3, 7, 'B', 2, 0, 2, 1, 6, 2, 3); -- H5
GO

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_teams_tournament ON teams(tournament_id);
CREATE INDEX idx_teams_hostel ON teams(hostel_id);
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_date ON matches(match_date);
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_pool_standings_tournament ON pool_standings(tournament_id);
GO

-- =====================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Tournament Summary
CREATE VIEW v_tournament_summary AS
SELECT 
    t.tournament_id,
    t.year,
    t.tournament_name,
    t.start_date,
    t.end_date,
    COUNT(DISTINCT tm.team_id) as total_teams,
    COUNT(DISTINCT m.match_id) as total_matches,
    t.status
FROM tournaments t
LEFT JOIN teams tm ON t.tournament_id = tm.tournament_id
LEFT JOIN matches m ON t.tournament_id = m.tournament_id
GROUP BY t.tournament_id, t.year, t.tournament_name, t.start_date, t.end_date, t.status;
GO

-- View: Team Performance
CREATE VIEW v_team_performance AS
SELECT 
    t.team_id,
    h.hostel_code,
    h.hostel_name,
    t.captain_name,
    tr.year,
    COUNT(DISTINCT m.match_id) as matches_played,
    SUM(CASE WHEN m.winner_team_id = t.team_id THEN 1 ELSE 0 END) as wins,
    COUNT(DISTINCT m.match_id) - SUM(CASE WHEN m.winner_team_id = t.team_id THEN 1 ELSE 0 END) as losses,
    t.final_position
FROM teams t
JOIN hostels h ON t.hostel_id = h.hostel_id
JOIN tournaments tr ON t.tournament_id = tr.tournament_id
LEFT JOIN matches m ON (m.team1_id = t.team_id OR m.team2_id = t.team_id)
WHERE t.status = 'Active'
GROUP BY t.team_id, h.hostel_code, h.hostel_name, t.captain_name, tr.year, t.final_position;
GO

-- Add table comments using extended properties
EXEC sp_addextendedproperty 
    @name = N'MS_Description', @value = 'Stores tournament information across multiple years',
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table', @level1name = 'tournaments';
GO

EXEC sp_addextendedproperty 
    @name = N'MS_Description', @value = 'Master table for hostel information',
    @level0type = N'Schema', @level0name = 'dbo',
    @level1type = N'Table', @level1name = 'hostels';
GO

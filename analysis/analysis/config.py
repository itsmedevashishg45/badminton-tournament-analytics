# config.py
# SQL Server connection configuration for macOS (Docker)

import os

# --------------------------------------------------
# Primary connection string (local Docker SQL Server)
# --------------------------------------------------
CONNECTION_STRING = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost,1433;"
    "DATABASE=badminton_db;"
    "UID=sa;"
    "PWD=StrongPass@123;"
    "TrustServerCertificate=yes;"
)

# --------------------------------------------------
# Optional: Environment-variable-based configuration
# (useful for GitHub / production)
# --------------------------------------------------
DB_PASSWORD = os.getenv("DB_PASSWORD", "StrongPass@123")

CONNECTION_STRING_ENV = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost,1433;"
    "DATABASE=badminton_db;"
    "UID=sa;"
    f"PWD={DB_PASSWORD};"
    "TrustServerCertificate=yes;"
)


# config.py
import os

# Database Configuration for SQL Server (Docker on Mac)
CONNECTION_STRING = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost,1433;"
    "DATABASE=badminton_db;"
    "UID=sa;"
    "PWD=StrongPass@123;"
    "TrustServerCertificate=yes;"  # Important for local development
)
# Alternative: using environment variables (more secure)
DB_PASSWORD = os.getenv('DB_PASSWORD', 'StrongPass@123')

CONNECTION_STRING_ENV = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    f"SERVER=localhost,1433;"
    f"DATABASE=badminton_db;"
    f"UID=sa;"
    f"PWD={DB_PASSWORD};"
    f"TrustServerCertificate=yes;"
)

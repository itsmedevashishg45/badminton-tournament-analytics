# config.example.py
# Copy this file to config.py and update with your credentials

import os

# Database Configuration for SQL Server
CONNECTION_STRING = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=localhost,1433;"  # Change to your server
    "DATABASE=badminton_db;"
    "UID=sa;"
    "PWD=YOUR_PASSWORD_HERE;"  # Replace with your password
    "TrustServerCertificate=yes;"
)

# Or use environment variables (recommended)
DB_PASSWORD = os.getenv('DB_PASSWORD', 'your-password')

CONNECTION_STRING_ENV = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    f"SERVER=localhost,1433;"
    f"DATABASE=badminton_db;"
    f"UID=sa;"
    f"PWD={DB_PASSWORD};"
    f"TrustServerCertificate=yes;"
)

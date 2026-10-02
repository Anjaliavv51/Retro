from datetime import datetime
import sqlite3

# Connect to SQLite database
conn = sqlite3.connect('user_data.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
CREATE TABLE IF NOT EXISTS user_interactions (
    user_id INTEGER,
    item_id INTEGER,
    interaction_type TEXT,
    timestamp DATETIME
)
''')

# Function to log interaction
def log_interaction(user_id, item_id, interaction_type):
    timestamp = datetime.now()
    cursor.execute('''
    INSERT INTO user_interactions (user_id, item_id, interaction_type, timestamp)
    VALUES (?, ?, ?, ?)
    ''', (user_id, item_id, interaction_type, timestamp))
    conn.commit()

# Example usage
log_interaction(1, 101, 'click')
log_interaction(1, 102, 'view')
log_interaction(2, 101, 'purchase')

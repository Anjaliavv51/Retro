from datetime import datetime
import sqlite3

# Connect to SQLite database
conn = sqlite3.connect('user_data.db')
cursor = conn.cursor()

# Create table if it doesn't exist
cursor.execute('''
CREATE TABLE IF NOT EXISTS user_interactions (
    user_id INTEGER,
    item_id INTEGER,
    interaction_type TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

# Function to log interaction
def log_interaction(user_id, item_id, interaction_type):
    timestamp = datetime.now()  # Get the current timestamp
    try:
        cursor.execute('''
        INSERT INTO user_interactions (user_id, item_id, interaction_type, timestamp)
        VALUES (?, ?, ?, ?)
        ''', (user_id, item_id, interaction_type, timestamp))
        conn.commit()  # Commit changes to the database
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")

# Example usage
log_interaction(1, 101, 'click')
log_interaction(1, 102, 'view')
log_interaction(2, 101, 'purchase')

# Close the connection
conn.close()

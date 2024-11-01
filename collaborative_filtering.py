import pandas as pd
from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split, accuracy

# Load data from database
data = cursor.execute('SELECT user_id, item_id, interaction_type FROM user_interactions').fetchall()

# Convert to DataFrame and ensure interaction_type is treated as a rating
df = pd.DataFrame(data, columns=['user_id', 'item_id', 'interaction_type'])

# Check if interaction_type is within the expected rating scale
if df['interaction_type'].max() > 5 or df['interaction_type'].min() < 1:
    raise ValueError("Interaction type values must be within the range 1 to 5.")

# Convert to Surprise dataset
reader = Reader(rating_scale=(1, 5))
dataset = Dataset.load_from_df(df[['user_id', 'item_id', 'interaction_type']], reader)

# Train-test split
trainset, testset = train_test_split(dataset, test_size=0.25)

# Train model
algo = SVD()
algo.fit(trainset)

# Test model
predictions = algo.test(testset)

# Calculate and print RMSE
rmse = accuracy.rmse(predictions)
print(f'Root Mean Squared Error: {rmse}')

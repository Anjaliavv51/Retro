from surprise import Dataset, Reader, SVD
from surprise.model_selection import train_test_split, accuracy

# Load data from database
data = cursor.execute('SELECT user_id, item_id, interaction_type FROM user_interactions').fetchall()

# Convert to Surprise dataset
reader = Reader(rating_scale=(1, 5))
dataset = Dataset.load_from_df(pd.DataFrame(data, columns=['user_id', 'item_id', 'interaction_type']), reader)

# Train-test split
trainset, testset = train_test_split(dataset, test_size=0.25)

# Train model
algo = SVD()
algo.fit(trainset)

# Test model
predictions = algo.test(testset)
accuracy.rmse(predictions)

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def load_data():
    # Load interaction data
    data = pd.read_csv('user_interactions.csv')
    return data

def build_model(data):
    # Create user-item interaction matrix
    user_item_matrix = data.pivot_table(index='user_id', columns='item_id', values='interaction', aggfunc='count', fill_value=0)
    
    # Compute cosine similarity between users
    user_similarity = cosine_similarity(user_item_matrix)
    
    return user_item_matrix, user_similarity

def recommend_items(user_id, user_item_matrix, user_similarity, num_recommendations=5):
    user_idx = user_item_matrix.index.get_loc(user_id)
    similar_users = list(enumerate(user_similarity[user_idx]))
    similar_users = sorted(similar_users, key=lambda x: x[1], reverse=True)

    recommendations = set()  # Use a set to avoid duplicates
    for user, score in similar_users:
        if user != user_idx:
            # Get items rated by similar users that the current user has not rated yet
            similar_user_items = user_item_matrix.iloc[user]
            user_items = user_item_matrix.iloc[user_idx]
            recommended_items = similar_user_items[user_items == 0].index.tolist()
            
            recommendations.update(recommended_items)
        
        if len(recommendations) >= num_recommendations:
            break
    
    return list(recommendations)[:num_recommendations]  # Return only the top recommendations

# Example usage
if __name__ == "__main__":
    data = load_data()
    user_item_matrix, user_similarity = build_model(data)
    user_id = 1  # Example user ID
    recommendations = recommend_items(user_id, user_item_matrix, user_similarity, num_recommendations=5)
    print("Recommended items for user {}: {}".format(user_id, recommendations))

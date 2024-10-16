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
    
    recommendations = []
    for user, score in similar_users:
        if user != user_idx:
            similar_user_items = user_item_matrix.iloc

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
from rag_search import get_rag_engine, VintageRAGSearchEngine

def load_data(csv_path='user_interactions.csv'):
    """Load user-item interaction data."""
    if not os.path.exists(csv_path):
        # Create a sample interaction dataset if none exists
        df = pd.DataFrame([
            {"user_id": 1, "item_id": "prod-1", "interaction": 5},
            {"user_id": 1, "item_id": "1.02", "interaction": 4},
            {"user_id": 2, "item_id": "prod-3", "interaction": 5},
            {"user_id": 2, "item_id": "2.04", "interaction": 4},
            {"user_id": 3, "item_id": "prod-4", "interaction": 5},
            {"user_id": 3, "item_id": "2.03", "interaction": 4},
            {"user_id": 4, "item_id": "prod-1", "interaction": 4},
            {"user_id": 4, "item_id": "prod-2", "interaction": 5},
        ])
        df.to_csv(csv_path, index=False)
        return df
    return pd.read_csv(csv_path)

def build_model(data):
    """Create user-item interaction matrix and compute user similarity."""
    user_item_matrix = data.pivot_table(index='user_id', columns='item_id', values='interaction', aggfunc='sum', fill_value=0)
    user_similarity = cosine_similarity(user_item_matrix)
    return user_item_matrix, user_similarity

def recommend_items(user_id, user_item_matrix, user_similarity, num_recommendations=5):
    """Collaborative filtering recommendation for a given user."""
    if user_id not in user_item_matrix.index:
        return []
    
    user_idx = user_item_matrix.index.get_loc(user_id)
    similar_users = list(enumerate(user_similarity[user_idx]))
    similar_users = sorted(similar_users, key=lambda x: x[1], reverse=True)
    
    user_interacted_items = set(user_item_matrix.columns[user_item_matrix.iloc[user_idx] > 0])
    recommendations = []
    
    for other_user_idx, sim_score in similar_users:
        if other_user_idx != user_idx and sim_score > 0:
            other_user_items = user_item_matrix.columns[user_item_matrix.iloc[other_user_idx] > 0]
            for item in other_user_items:
                if item not in user_interacted_items and item not in recommendations:
                    recommendations.append(item)
                    if len(recommendations) >= num_recommendations:
                        break
        if len(recommendations) >= num_recommendations:
            break
            
    return recommendations

def rag_search_recommendations(natural_language_query: str, top_k: int = 4):
    """
    RAG-based natural language product search and recommendation.
    Combines dense semantic retrieval, context augmentation, and generative curation.
    """
    engine = get_rag_engine()
    return engine.search(natural_language_query, top_k=top_k)

if __name__ == '__main__':
    # Demo Collaborative Filtering
    data = load_data()
    matrix, sim = build_model(data)
    user_recs = recommend_items(1, matrix, sim)
    print(f"Collaborative Filtering Recommendations for User 1: {user_recs}")

    # Demo RAG Search
    print("\n--- Demo RAG Search ---")
    query = "authentic mechanical typewriter for a vintage novel writer"
    rag_res = rag_search_recommendations(query)
    print(f"Query: {query}")
    print(f"Curator Note: {rag_res['curator_response']['summary']}")
    for p in rag_res['recommendations']:
        print(f" * {p['title']} ({p['relevance_percentage']}% Match): {p['match_reason']}")

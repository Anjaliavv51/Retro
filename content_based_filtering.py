from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

# Example item descriptions
items = [
    {'id': 101, 'description': 'Vintage camera from the 1950s'},
    {'id': 102, 'description': 'Classic vinyl record'},
    {'id': 103, 'description': 'Retro gaming console'}
]

# Create TF-IDF matrix
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform([item['description'] for item in items])

# Compute cosine similarity
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

# Function to get recommendations
def get_recommendations(item_id, cosine_sim=cosine_sim):
    # Find the index of the item that matches the given id
    idx = next((index for (index, d) in enumerate(items) if d["id"] == item_id), None)
    if idx is None:
        return []  # Return empty if item_id is not found
    
    # Get similarity scores for the selected item
    sim_scores = list(enumerate(cosine_sim[idx]))
    # Sort the items based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    # Get the scores of the top 3 similar items, excluding the first one (itself)
    sim_scores = sim_scores[1:4]
    
    # Get the item indices
    item_indices = [i[0] for i in sim_scores]
    return [items[i]['id'] for i in item_indices]

# Example usage
recommended_ids = get_recommendations(101)
print("Recommended item IDs:", recommended_ids)

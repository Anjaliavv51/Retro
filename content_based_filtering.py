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
    idx = next(index for (index, d) in enumerate(items) if d["id"] == item_id)
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:4]
    item_indices = [i[0] for i in sim_scores]
    return [items[i]['id'] for i in item_indices]

# Example usage
print(get_recommendations(101))

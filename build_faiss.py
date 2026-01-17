import json
import faiss
import numpy as np

# Load embeddings JSON
with open("data\knowledge_base_embeddings.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Extract vectors
vectors = []
for item in data:
    vectors.append(item["embedding"])

vectors = np.array(vectors).astype("float32")

# Create FAISS index
dimension = len(vectors[0])
index = faiss.IndexFlatL2(dimension)
index.add(vectors)

# Save index to file
faiss.write_index(index, "faiss_index.index")

print("FAISS index saved as faiss_index.index")

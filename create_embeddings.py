import os
import json
from google import genai

# Initialize client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# Load JSON knowledge base
with open("data/knowledge_base.json", "r", encoding="utf-8") as f:
    knowledge_base = json.load(f)

embeddings_data = []

for item in knowledge_base:
    # Generate embedding
    response = client.models.embed_content(
        model="models/text-embedding-004",
        contents=item["content"]
    )

    # Convert ContentEmbedding object to list of floats
    embedding_vector = list(response.embeddings[0].values)

    embeddings_data.append({
        "id": item["id"],
        "category": item["category"],
        "content": item["content"],
        "embedding": embedding_vector
    })

# Save embeddings to JSON
with open("data/knowledge_base_embeddings.json", "w", encoding="utf-8") as f:
    json.dump(embeddings_data, f, ensure_ascii=False, indent=4)

print("Embeddings created and saved successfully!")

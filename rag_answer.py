import os
import json
import numpy as np
import faiss
from google import genai
from deep_translator import GoogleTranslator
import re
import requests

# ===============================
# 1. Gemini Client
# ===============================
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# ===============================
# 2. Load FAISS index
# ===============================
index = faiss.read_index("faiss_index.index")

# ===============================
# 3. Load metadata
# ===============================
with open("data/knowledge_base_embeddings.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# ===============================
# 4. Multilingual Utilities
# ===============================
def detect_language(text):
    # Gujarati Unicode block detection
    if re.search(r'[\u0A80-\u0AFF]', text):
        return "gu"
    return "en"

def translate_to_english(text):
    try:
        return GoogleTranslator(source='auto', target='en').translate(text)
    except:
        return text

def translate_to_gujarati(text):
    try:
        return GoogleTranslator(source='en', target='gu').translate(text)
    except:
        return text

# ===============================
# 5. Create query embedding
# ===============================
def get_query_embedding(text):
    response = client.models.embed_content(
        model="models/text-embedding-004",
        contents=text
    )
    return np.array(response.embeddings[0].values).astype("float32")

# ===============================
# 6. FAISS search
# ===============================
def search_faiss(query, top_k=3):
    query_vector = get_query_embedding(query).reshape(1, -1)
    distances, indices = index.search(query_vector, top_k)

    results = []
    for idx in indices[0]:
        results.append(data[idx]["content"])
    return results

# ===============================
# 7. Generate Answer from Gemini
# ===============================
def generate_answer(question, retrieved_docs):
    context = "\n".join(retrieved_docs)

    prompt = f"""
You are a helpful college assistant chatbot.
Answer the question strictly using the information below.
If the answer is not present, say "I don't have that information."

Context:
{context}

Question:
{question}
"""

    response = client.models.generate_content(
        model="models/gemini-2.5-flash",
        contents=prompt
    )

    return response.text

# ===============================
# 8. Live Faculty Status Service
# ===============================
def get_faculty_status(name):
    url = f"http://127.0.0.1:8000/faculty/{name}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        if "status" in data:
            return data["status"]
    return None

def is_faculty_query(query):
    keywords = ["available", "busy", "leave", "faculty", "professor"]
    return any(k in query.lower() for k in keywords)


def extract_faculty_name(query):
    words = query.split()
    for i, word in enumerate(words):
        if word.lower() in i + 1 < len(words):
            return f" {words[i+1].capitalize()}"
    return None

# ===============================
# 9. Complete Multilingual RAG + Live Data Pipeline
# ===============================
def chatbot_pipeline(user_query):
    # Detect language
    lang = detect_language(user_query)

    # Translate to English if Gujarati
    if lang == "gu":
        query_en = translate_to_english(user_query)
    else:
        query_en = user_query

    # -------------------------
    # LIVE FACULTY STATUS ROUTE
    # -------------------------
    if is_faculty_query(query_en):
        faculty_name = extract_faculty_name(query_en)

        if faculty_name:
            status = get_faculty_status(faculty_name)

            if status:
                answer_en = f"{faculty_name} is currently {status}."
            else:
                answer_en = f"I don't have live status for {faculty_name}."
        else:
            answer_en = "Please mention the faculty name."

    # -------------------------
    # RAG ROUTE (Static Knowledge)
    # -------------------------
    else:
        retrieved = search_faiss(query_en)
        answer_en = generate_answer(query_en, retrieved)

    # Translate back if Gujarati
    if lang == "gu":
        final_answer = translate_to_gujarati(answer_en)
    else:
        final_answer = answer_en

    return final_answer


# ===============================
# 10. Run Chatbot
# ===============================
if __name__ == "__main__":
    while True:
        query = input("\nAsk something (type 'exit' to quit): ")
        if query.lower() == "exit":
            break

        answer = chatbot_pipeline(query)

        print(answer)

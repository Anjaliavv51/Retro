from flask import Flask, render_template, request, jsonify
from bs4 import BeautifulSoup
import requests
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import HuggingFaceHub
from langchain.chains import RetrievalQA
import os

app = Flask(__name__)

# Initialize global variables
vectorstore = None
processed_urls = set()

def load_sentence_transformer():
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def process_url(url):
    global vectorstore, processed_urls
    
    if url in processed_urls:
        return "URL already processed"

    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        title = soup.title.string if soup.title else "No title found"
        main_content = soup.find('article') or soup.find('main') or soup.body
        content = main_content.get_text(separator='\n', strip=True) if main_content else "No content found"
        
        document = f"Title: {title}\n\nContent: {content}"
        
        text_splitter = RecursiveCharacterTextSplitter(
            separators=['\n\n', '\n', '.', ','],
            chunk_size=1000
        )
        docs = text_splitter.create_documents([document], metadatas=[{"source": url}])

        embedding_function = load_sentence_transformer()
        
        new_vectorstore = FAISS.from_documents(docs, embedding_function)
        
        if vectorstore:
            vectorstore.merge_from(new_vectorstore)
        else:
            vectorstore = new_vectorstore
        
        processed_urls.add(url)
        
        return "URL processed successfully"
    except Exception as e:
        return f"Error processing URL: {str(e)}"

def ask_question(query):
    global vectorstore
    
    if not vectorstore:
        return "Please process a URL before asking questions"

    try:
        llm = HuggingFaceHub(
            repo_id="google/flan-t5-base", 
            model_kwargs={"temperature": 0.3, "max_length": 512}
        )
        
        retriever = vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 2}
        )
        
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=retriever,
            return_source_documents=True
        )
        
        result = qa_chain({"query": query})
        answer = result.get("result", str(result))
        source_docs = result.get("source_documents", [])
        
        sources = [doc.metadata.get('source', 'Unknown source') for doc in source_docs]
        
        return {"answer": answer, "sources": sources}
    except Exception as e:
        return {"error": f"Error processing question: {str(e)}"}

@app.route('/')
def index():
    return render_template('qa.html')

@app.route('/process_url', methods=['POST'])
def process_url_route():
    url = request.json.get('url')
    if not url:
        return jsonify({"error": "No URL provided"}), 400
    result = process_url(url)
    return jsonify({"result": result})

@app.route('/ask_question', methods=['POST'])
def ask_question_route():
    query = request.json.get('question')
    if not query:
        return jsonify({"error": "No question provided"}), 400
    result = ask_question(query)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
from haystack import Document, Pipeline
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.retrievers.in_memory import InMemoryBM25Retriever
from haystack.components.readers import ExtractiveReader

# Create an in-memory document store
document_store = InMemoryDocumentStore()

# Add some sample documents (you can load your own product data here)
documents = [
    Document(content="Apple iPhone 13 with A15 Bionic chip and 128GB storage."),
    Document(content="Samsung Galaxy S21 Ultra with Snapdragon 888 and 256GB storage."),
    Document(content="OnePlus 9 Pro with Hasselblad camera and 12GB RAM.")
]
document_store.write_documents(documents)

# Use BM25 retriever for fast search
retriever = InMemoryBM25Retriever(document_store=document_store)

# Use an extractive reader
reader = ExtractiveReader()
reader.warm_up()

# Create a pipeline and add components
extractive_qa_pipeline = Pipeline()
extractive_qa_pipeline.add_component(instance=retriever, name="retriever")
extractive_qa_pipeline.add_component(instance=reader, name="reader")

# Connect the components in the pipeline
extractive_qa_pipeline.connect("retriever.documents", "reader.documents")

# Query the pipeline
query = "Which phone has the Snapdragon 888 chip?"
results = extractive_qa_pipeline.run(data={
    "retriever": {"query": query, "top_k": 5}, 
    "reader": {"query": query, "top_k": 3}
})

# Print the results
for result in results["reader"]["answers"]:
    print(result)


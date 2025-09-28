class VectorService {
  constructor() {
    this.documents = new Map();
    this.index = new Map(); // Simple keyword index
  }
  
  async addDocuments(docs) {
    for (const doc of docs) {
      this.documents.set(doc.id, doc);
      this.indexDocument(doc);
    }
  }
  
  indexDocument(doc) {
    const text = (doc.title + ' ' + doc.content).toLowerCase();
    const words = text.match(/\b\w+\b/g) || [];
    
    for (const word of words) {
      if (word.length > 2) { // Ignore very short words
        if (!this.index.has(word)) {
          this.index.set(word, new Set());
        }
        this.index.get(word).add(doc.id);
      }
    }
  }
  
  async searchRelevantContent(query, limit = 3) {
    const queryWords = query.toLowerCase().match(/\b\w+\b/g) || [];
    const scores = new Map();
    
    // Score documents based on keyword matches
    for (const word of queryWords) {
      if (this.index.has(word)) {
        const docIds = this.index.get(word);
        for (const docId of docIds) {
          scores.set(docId, (scores.get(docId) || 0) + 1);
        }
      }
    }
    
    // Get top scoring documents
    const sortedDocs = Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([docId]) => this.documents.get(docId))
      .filter(doc => doc);
    
    // If no matches found, return some sample documents
    if (sortedDocs.length === 0 && this.documents.size > 0) {
      const allDocs = Array.from(this.documents.values());
      return allDocs.slice(0, Math.min(2, allDocs.length));
    }
    
    return sortedDocs;
  }
  
  clearDocuments() {
    this.documents.clear();
    this.index.clear();
  }
  
  getDocumentCount() {
    return this.documents.size;
  }
}

export default new VectorService();
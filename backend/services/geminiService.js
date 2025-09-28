import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    }
  }
  
  async generateResponse(query, relevantContent) {
    try {
      if (!this.apiKey) {
        return this.getFallbackResponse(query, relevantContent);
      }
      
      const context = relevantContent.map(doc => 
        `Title: ${doc.title}\nContent: ${doc.content}\n---`
      ).join('\n\n');
      
      const prompt = `You are a helpful college assistant chatbot. Answer the student's question based ONLY on the provided information from the college's knowledge base. 

Rules:
- Always be helpful, clear, and concise
- If the information isn't in the knowledge base, politely say you don't have that information
- Provide specific details when available (dates, requirements, contact info, etc.)
- Use a friendly, professional tone appropriate for students and faculty
- If asked about multiple topics, organize your response with clear sections

Knowledge Base Information:
${context}

Student Question: ${query}

Please provide a helpful and accurate response:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const answer = response.text();
      
      return {
        answer: answer.trim(),
        confidence: this.calculateConfidence(relevantContent),
        sources: relevantContent.map(doc => ({
          title: doc.title,
          url: doc.url
        }))
      };
      
    } catch (error) {
      console.error('❌ Error generating Gemini response:', error);
      return this.getFallbackResponse(query, relevantContent);
    }
  }
  
  getFallbackResponse(query, relevantContent) {
    if (relevantContent.length === 0) {
      return {
        answer: "I'm sorry, I don't have information about that topic in my knowledge base. Please try asking about courses, admissions, campus facilities, or academic programs.",
        confidence: 0,
        sources: []
      };
    }
    
    // Simple fallback response based on relevant content
    const topContent = relevantContent[0];
    const answer = `Based on the information I have about "${topContent.title}": ${topContent.content.substring(0, 300)}${topContent.content.length > 300 ? '...' : ''}`;
    
    return {
      answer,
      confidence: this.calculateConfidence(relevantContent),
      sources: relevantContent.slice(0, 2).map(doc => ({
        title: doc.title,
        url: doc.url
      }))
    };
  }
  
  calculateConfidence(relevantContent) {
    if (relevantContent.length === 0) return 0;
    if (relevantContent.length >= 3) return 0.9;
    if (relevantContent.length >= 2) return 0.7;
    return 0.5;
  }
}

export default new GeminiService();
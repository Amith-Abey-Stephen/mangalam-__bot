import notionService from '../services/notionService.js';
import geminiService from '../services/geminiService.js';
import vectorService from '../services/vectorService.js';

const handleQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    console.log(`📝 [Step 1] Received query: "${query}"`);

    // Step 2: Vector search
    console.log('🔍 [Step 2] Searching for relevant content in knowledge base...');
    const relevantContent = await vectorService.searchRelevantContent(query);
    console.log(`🔍 [Step 2] Found ${relevantContent.length} relevant documents.`);

    if (relevantContent.length === 0) {
      console.log('⚠️ [Step 2] No relevant content found. Sending fallback response.');
      return res.json({
        answer: "I'm sorry, I don't have information about that topic in my knowledge base. Please try asking about courses, admissions, campus facilities, or academic programs.",
        confidence: 0,
        sources: []
      });
    }

    // Step 3: Generate response using Gemini
    console.log('🤖 [Step 3] Generating response using Gemini...');
    const response = await geminiService.generateResponse(query, relevantContent);
    console.log('✅ [Step 3] Gemini response generated:', response.answer);

    // Step 4: Send response
    console.log('📤 [Step 4] Sending response to frontend.');
    res.json({
      answer: response.answer,
      confidence: response.confidence,
      sources: response.sources,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error handling query:', error);
    res.status(500).json({
      error: 'I apologize, but I encountered an error while processing your question. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const syncData = async (req, res) => {
  try {
    console.log('🔄 Manual data sync initiated');
    await notionService.syncNotionData();
    
    res.json({
      message: 'Data sync completed successfully',
      timestamp: new Date().toISOString(),
      totalDocuments: vectorService.getDocumentCount()
    });
    
  } catch (error) {
    console.error('❌ Error syncing data:', error);
    res.status(500).json({
      error: 'Failed to sync data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  handleQuery,
  syncData
};
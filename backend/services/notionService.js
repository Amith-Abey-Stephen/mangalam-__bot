import axios from 'axios';
import cron from 'node-cron';
import vectorService from './vectorService.js';
import fs from 'fs';
import path from 'path';

class NotionService {
  constructor() {
    this.apiKey = process.env.NOTION_API_KEY;
    this.databaseId = process.env.NOTION_DATABASE_ID;
    this.baseURL = 'https://api.notion.com/v1';
    
    // Schedule data sync every 6 hours
    cron.schedule('0 */6 * * *', () => {
      console.log('⏰ Scheduled Notion data sync started');
      this.syncNotionData();
    });
  }
  
  async syncNotionData() {
    try {
      console.log('🔄 Syncing data from Notion...');
      
      if (!this.apiKey || !this.databaseId) {
        console.log('⚠️ Notion API key or database ID not configured, using fallback data file');
        this.loadFallbackData();
        return;
      }
      
      const pages = await this.fetchNotionPages();
      const documents = await this.processPages(pages);
      
      // Clear existing data and load new data
      vectorService.clearDocuments();
      await vectorService.addDocuments(documents);
      
      console.log(`✅ Synced ${documents.length} documents from Notion`);
      
    } catch (error) {
  console.error('❌ Error syncing Notion data:', error.message);
  // Fallback to data file if Notion sync fails
  this.loadFallbackData();
    }
  }
  
  async fetchNotionPages() {
    const response = await axios.post(
      `${this.baseURL}/databases/${this.databaseId}/query`,
      {
        page_size: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('📄 Raw Notion pages fetched:', JSON.stringify(response.data.results, null, 2));
    return response.data.results;
  }
  
  async processPages(pages) {
    const documents = [];
    for (const page of pages) {
      try {
        const content = await this.extractPageContent(page);
        const title = this.extractTitle(page);
        if (content && title) {
          const doc = {
            id: page.id,
            title,
            content,
            url: page.url,
            lastModified: page.last_edited_time
          };
          documents.push(doc);
          console.log('📝 Processed Notion document:', JSON.stringify(doc, null, 2));
        }
      } catch (error) {
        console.error(`❌ Error processing page ${page.id}:`, error.message);
      }
    }
    console.log(`📦 Total processed Notion documents: ${documents.length}`);
    return documents;
  }
  
  async extractPageContent(page) {
    try {
      const response = await axios.get(
        `${this.baseURL}/blocks/${page.id}/children`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Notion-Version': '2022-06-28'
          }
        }
      );
      
      let content = '';
      for (const block of response.data.results) {
        content += this.extractTextFromBlock(block) + '\n';
      }
      
      return content.trim();
    } catch (error) {
      console.error(`Error extracting content from page ${page.id}:`, error.message);
      return null;
    }
  }
  
  extractTitle(page) {
    try {
      const titleProperty = Object.values(page.properties).find(
        prop => prop.type === 'title'
      );
      
      if (titleProperty && titleProperty.title.length > 0) {
        return titleProperty.title[0].plain_text;
      }
      
      return 'Untitled';
    } catch (error) {
      return 'Untitled';
    }
  }
  
  extractTextFromBlock(block) {
    switch (block.type) {
      case 'paragraph':
        return block.paragraph.rich_text.map(t => t.plain_text).join('');
      case 'heading_1':
        return block.heading_1.rich_text.map(t => t.plain_text).join('');
      case 'heading_2':
        return block.heading_2.rich_text.map(t => t.plain_text).join('');
      case 'heading_3':
        return block.heading_3.rich_text.map(t => t.plain_text).join('');
      case 'bulleted_list_item':
        return '• ' + block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
      case 'numbered_list_item':
        return '• ' + block.numbered_list_item.rich_text.map(t => t.plain_text).join('');
      default:
        return '';
    }
  }
  
  loadFallbackData() {
    console.log('📚 Loading fallback data from file...');
    try {
      // Try both possible locations for robust fallback
      let dataPath = path.resolve(process.cwd(), 'data', 'fallbackData.json');
      if (!fs.existsSync(dataPath)) {
        dataPath = path.resolve(process.cwd(), 'backend', 'data', 'fallbackData.json');
      }
      const raw = fs.readFileSync(dataPath, 'utf-8');
      const documents = JSON.parse(raw);
      vectorService.clearDocuments();
      vectorService.addDocuments(documents);
      console.log(`✅ Loaded ${documents.length} fallback documents from file.`);
    } catch (err) {
      console.error('❌ Failed to load fallback data file:', err.message);
    }
  }
}

export default new NotionService();
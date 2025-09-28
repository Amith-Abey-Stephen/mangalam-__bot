# College Chatbot 🎓

An AI-powered college chatbot that fetches data from Notion and provides intelligent answers to student and faculty queries. Built with React frontend and Node.js backend, featuring semantic search and Gemini AI integration.

## ✨ Features

- **Notion Integration**: Syncs data from Notion databases automatically
- **AI-Powered Responses**: Uses Google Gemini for intelligent, contextual answers  
- **Semantic Search**: Finds relevant information using vector search
- **Real-time Chat**: Beautiful, responsive chat interface with typing indicators
- **Auto-sync**: Periodically updates knowledge base from Notion
- **Production Ready**: Comprehensive error handling, logging, and validation
- **Mobile Responsive**: Works seamlessly on all devices

## 🏗️ Architecture

```
college-chatbot/
├── backend/                 # Node.js Express API
│   ├── controllers/         # Request handlers
│   ├── services/           # Business logic (Notion, Gemini, Vector search)
│   ├── middleware/         # Validation, error handling
│   ├── routes/             # API routes
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API client
│   │   └── App.jsx         # Main app component
│   └── dist/               # Built frontend files
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Notion account (optional - falls back to sample data)
- Google Gemini API key (optional - has fallback responses)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd college-chatbot
npm run install:all
```

2. **Set up environment variables**:
```bash
cp .env.example .env
```

3. **Configure your `.env` file**:
```env
# Required
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# Optional - For Notion integration
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional - For AI responses
GEMINI_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. **Start development servers**:
```bash
npm run dev
```

This starts both backend (port 3001) and frontend (port 5173).

## 🔧 Configuration

### Notion Setup (Optional)

1. Create a new Notion integration at https://www.notion.so/my-integrations
2. Copy the API key to your `.env` file
3. Create a database in Notion with your college information
4. Share the database with your integration
5. Copy the database ID from the URL to your `.env` file

### Gemini API Setup (Optional)

1. Get a free API key from https://makersuite.google.com/app/apikey
2. Add it to your `.env` file as `GEMINI_API_KEY`

### Sample Data

If you don't configure Notion or Gemini, the chatbot will use sample college data and provide basic responses.

## 📝 API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/ask` - Send a query and get AI response
- `POST /api/sync` - Manually trigger Notion data sync

### Example API Usage

```javascript
// Send a question
const response = await fetch('http://localhost:3001/api/ask', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'What are the admission requirements?' })
});

const data = await response.json();
console.log(data.answer);
```

## 🌟 Usage Examples

### Sample Questions

Try asking the chatbot:

- "What are the admission requirements for undergraduate programs?"
- "Tell me about the Computer Science program"
- "What financial aid options are available?"
- "What facilities are available on campus?"
- "How do I apply for housing?"
- "What student organizations can I join?"

### Sample Response Format

```json
{
  "answer": "The Computer Science program offers undergraduate and graduate degrees...",
  "confidence": 0.9,
  "sources": [
    {
      "title": "Computer Science Program",
      "url": "https://notion.so/cs-program"
    }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🚢 Deployment

### Backend Deployment Options

#### 1. Koyeb (Recommended - Free Tier)

1. Connect your GitHub repository to Koyeb
2. Set environment variables in Koyeb dashboard
3. Deploy with auto-scaling enabled

#### 2. Cloudflare Workers

1. Install Wrangler CLI: `npm install -g wrangler`
2. Configure `wrangler.toml`
3. Deploy: `wrangler publish`

### Frontend Deployment

#### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url`

#### Netlify

1. Build command: `cd frontend && npm run build`
2. Publish directory: `frontend/dist`
3. Add environment variables in Netlify dashboard

## 🔄 Data Sync

The chatbot automatically syncs data from Notion every 6 hours. You can also trigger manual sync:

1. Via API: `POST /api/sync`
2. The sync process:
   - Fetches pages from configured Notion database
   - Processes content and creates vector embeddings
   - Updates the search index
   - Logs sync status

## 🛠️ Customization

### Adding New Data Sources

1. Create a new service in `backend/services/`
2. Implement data fetching and processing
3. Update the vector service to include new data
4. Add sync scheduling if needed

### Modifying AI Responses

Edit the system prompt in `backend/services/geminiService.js`:

```javascript
const prompt = `You are a helpful college assistant chatbot...`;
```

### Styling Changes

The frontend uses Tailwind CSS. Modify styles in:
- `frontend/src/index.css` - Global styles
- `frontend/tailwind.config.js` - Theme configuration
- Component files - Component-specific styles

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot connect to API"**
   - Check if backend is running on port 3001
   - Verify CORS configuration
   - Check firewall settings

2. **"No data found"**
   - Verify Notion API key and database ID
   - Check database permissions
   - Review sync logs

3. **"AI responses not working"**
   - Verify Gemini API key
   - Check API quotas and limits
   - Review error logs

### Debug Mode

Set `NODE_ENV=development` to enable detailed error messages and logging.

## 📊 Production Considerations

### Performance

- Implement Redis caching for frequent queries
- Use Pinecone for production-grade vector search
- Add database connection pooling
- Implement response compression

### Security

- Add API authentication
- Implement rate limiting per user
- Sanitize all user inputs  
- Use HTTPS in production
- Rotate API keys regularly

### Monitoring

- Add application monitoring (e.g., Sentry)
- Set up uptime monitoring
- Implement structured logging
- Track usage metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review existing GitHub issues
3. Create a new issue with detailed description
4. Include logs and environment details

## 🔮 Future Enhancements

- [ ] Voice chat support
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with student information systems
- [ ] Mobile app version
- [ ] Slack/Discord bot integration

---

Made with ❤️ for students and educators
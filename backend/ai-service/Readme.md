```
ai-service/
├── app/
|   ├── __init__.py
│   ├── main.py                  # Entry point for the service
│   ├── routes.py                # API routes for debate and analysis
│   ├── services/
│   │   ├── debate.py      # Handles requests to external APIs (ChatGPT)
│   │   └── analysis.py          # Analysis logic using external API
│   ├── models/
│   │   ├── debate_request.py    # Schema for debate request payload
│   │   └── analysis_request.py  # Schema for analysis request payload
│   └── utils/
│       ├── logging.py           # Logging utilities
│       └── config.py            # Configuration loader (e.g., API keys)
├── tests/                       # Test cases for AI service
│   ├── test_external_api.py     # Tests for external API calls
│   └── test_routes.py           # Tests for API routes
├── Dockerfile                   # Docker configuration
├── requirements.txt             # Python dependencies
└── .env                         # Environment variables (e.g., API keys)



```
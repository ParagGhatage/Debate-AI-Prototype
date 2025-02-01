
## Getting Started

1. Clone the repository.
2. Navigate to the `backend` or `frontend` directory as needed.
3. Follow the instructions in the respective README files for setup and usage.

---

# README.md for Backend

## Overview

The backend of the Debate-AI-Prototype consists of several microservices responsible for handling different aspects of the platform, including AI interactions, debate management, and analysis.

### Directory Structure

```
backend/
   ├── README.md
   ├── Makefile
   ├── docker-compose.yml
   ├── .env
   ├── ai-service/
   │   ├── Readme.md
   │   ├── requirements.txt
   │   ├── .gitignore
   │   └── app/
   │       ├── __init__.py
   │       ├── main.py
   │       ├── routes.py
   │       ├── models/
   │       │   ├── analysis_request.py
   │       │   └── debate_request.py
   │       ├── services/
   │       │   ├── analysis.py
   │       │   └── debate.py
   │       └── utils/
   │           ├── config.py
   │           └── logging.py
   ├── gateway-service/
   │   ├── Readme.md
   │   ├── go.mod
   │   ├── go.sum
   │   ├── main.go
   │   └── .gitignore
   ├── scripts/
   │   └── Readme.md
   └── shared/
       └── Readme.md

```


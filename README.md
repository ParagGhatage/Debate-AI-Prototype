# README.md for Debate-AI-Prototype

## Overview

The **Debate-AI-Prototype** is an innovative platform designed to facilitate engaging debates using artificial intelligence. It consists of multiple microservices that handle various functionalities, including debate management, analysis, and AI interactions.

### Architecture Overview

Architecture Diagram


### Workflow Diagram

Workflow Diagram  
*Workflow Diagram*

### Data Flow Diagram

Data Flow Diagram  
*Data Flow Diagram*

## Directory Structure

```
Directory structure:
└── paragghatage-debate-ai-prototype/
    ├── README.md
    ├── backend/
    │   ├── README.md
    │   ├── Makefile
    │   ├── docker-compose.yml
    │   ├── .env
    │   ├── ai-service/
    │   │   ├── Readme.md
    │   │   ├── requirements.txt
    │   │   ├── .gitignore
    │   │   └── app/
    │   │       ├── __init__.py
    │   │       ├── main.py
    │   │       ├── routes.py
    │   │       ├── models/
    │   │       │   ├── analysis_request.py
    │   │       │   └── debate_request.py
    │   │       ├── services/
    │   │       │   ├── analysis.py
    │   │       │   └── debate.py
    │   │       └── utils/
    │   │           ├── config.py
    │   │           └── logging.py
    │   ├── gateway-service/
    │   │   ├── Readme.md
    │   │   ├── go.mod
    │   │   ├── go.sum
    │   │   ├── main.go
    │   │   └── .gitignore
    │   ├── scripts/
    │   │   └── Readme.md
    │   └── shared/
    │       └── Readme.md
    └── frontend/
        ├── README.md
        ├── components.json
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.js
        ├── tailwind.config.js
        ├── tsconfig.app.json
        ├── tsconfig.json
        ├── tsconfig.node.json
        ├── vite.config.ts
        ├── .gitignore
        ├── public/
        └── src/
            ├── App.css
            ├── App.tsx
            ├── index.css
            ├── main.tsx
            ├── vite-env.d.ts
            ├── Pages/
            │   ├── Authentication.tsx
            │   ├── Authentication/
            │   │   └── form.tsx
            │   ├── Debate/
            │   │   └── page.tsx
            │   ├── Landing page.tsx/
            │   │   └── Home1.tsx
            │   └── start-debate/
            │       └── page.tsx
            ├── assets/
            ├── components/
            │   └── ui/
            │       ├── SmoothScroll.tsx
            │       ├── button.tsx
            │       ├── input.tsx
            │       ├── label.tsx
            │       └── separator.tsx
            ├── context/
            │   └── theme-provider.tsx
            └── lib/
                └── utils.ts


```

## Getting Started

1. Clone the repository.
2. Navigate to the `backend` or `frontend` directory as needed.
3. Follow the instructions in the respective README files for setup and usage.

---
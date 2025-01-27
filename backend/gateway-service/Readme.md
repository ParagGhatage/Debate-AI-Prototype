```
gateway-service/
├── main.go                      # Entry point
├── handlers/
│   ├── ai_handler.go            # Routes requests to AI service
│   ├── debate_handler.go        # Routes requests to Debate service
│   └── analysis_handler.go      # Routes requests to Analysis service
├── configs/
│   └── routes.yaml              # API Gateway routes configuration
├── middlewares/
│   └── auth.go                  # Authentication middleware
├── tests/
│   └── gateway_test.go
├── Dockerfile
└── go.mod

```
# Flow Puzzle Development Commands

.PHONY: help dev build up down logs clean frontend backend

help: ## Show this help message
	@echo "Flow Puzzle Development Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	docker-compose -f docker-compose.dev.yml up --build

build: ## Build production images
	docker-compose build

up: ## Start production environment
	docker-compose up -d

down: ## Stop all containers
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

logs: ## Show logs from all containers
	docker-compose logs -f

clean: ## Clean up containers, images, and volumes
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
	docker system prune -f

frontend: ## Start only frontend in development
	docker-compose -f docker-compose.dev.yml up --build frontend

backend: ## Start only backend in development
	docker-compose -f docker-compose.dev.yml up --build backend

install-frontend: ## Install frontend dependencies
	cd frontend && npm install

install-backend: ## Install backend dependencies
	cd backend && pip install -r requirements.txt

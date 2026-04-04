build-deploy:
	@echo "🚀 Building frontend..."
	cd frontend && npm run build
	
	@echo "📦 Preparing backend public folder..."
	rm -rf backend/public/*
	
	@echo "📂 Copying built files..."
	cp -r frontend/dist/* backend/public/
	
	@echo "✅ Build and deploy completed!"

start-server:
	node backend/src/server.js

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix


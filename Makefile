# Includes commonly used Docker commands

bbc-start:
	docker compose up -d

bbc-build:
	docker compose up --build -d

app-start:
	docker compose up app

app-attach:
	docker attach bigbisonchat_app_1

db-start:
	docker compose up db
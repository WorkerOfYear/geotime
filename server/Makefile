.PHONY: run clean down stop

run:
	docker system prune -af
	docker volume prune -af
	docker network prune -f
	docker-compose up -d

down:
	docker-compose down
	docker system prune -af
	docker volume prune -af
	docker network prune -f


stop:
	pm2 stop run.config.js

clean:
	docker system prune -af
	docker volume prune -af
	docker network prune -f


.PHONY: run clean down fix mig streem

fix:
	ruff check --fix .

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

clean:
	docker system prune -af
	docker volume prune -af
	docker network prune -f

mig:
	alembic revision --autogenerate -m "migrate"
	alembic upgrade head

streem:
	vlc -I dummy --loop test.mp4 :sout=#gather:rtp{sdp=rtsp://:8554/} :network-caching=500 :sout-all :sout-keepep
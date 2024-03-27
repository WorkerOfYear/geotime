module.exports = {
  apps: [
    {
      name: "celery-worker",
      script: "python3",
      args: "-m celery -A src.tasks.tasks worker --concurrency=4 --loglevel=info --pool=threads",
      autorestart: true,
      watch: false,
      max_memory_restart: "10G"
    }
  ]
};
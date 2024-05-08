module.exports = {
    apps: [
        {
            name: "celery-worker",
            script: "python3",
            args: "-m celery -A src.tasks.tasks worker --concurrency=4 --loglevel=info --pool=threads",
            autorestart: true,
            watch: false,
            max_memory_restart: "10G"
        },
        {
            name: "wits_stream",
            script: "main.py",
            interpreter: "python3",
            autorestart: true,
            watch: false,
            max_memory_restart: "10G",
            cwd: "src_websockets",
            env: {
                "PYTHONPATH": "../"
            }
        },
        {
            name: "video",
            script: "main.py",
            interpreter: "python3",
            autorestart: true,
            watch: false,
            max_memory_restart: "10G",
            cwd: "src_video",
            env: {
                "PYTHONPATH": "../"
            }
        },
        {
            name: "main",
            script: "main.py",
            interpreter: "python3",
            autorestart: true,
            watch: false,
            max_memory_restart: "10G",
            cwd: "src",
            env: {
                "PYTHONPATH": "../"
            }
        },
        {
            name: "report",
            script: "worker_report.py",
            interpreter: "python3",
            autorestart: true,
            watch: false,
            max_memory_restart: "10G",
            cwd: "src_report",
            env: {
                "PYTHONPATH": "../"
            }
        },
        {
            name: "wits_predict",
            script: "worker_wits.py",
            interpreter: "python3",
            autorestart: true,
            watch: false,
            max_memory_restart: "10G",
            cwd: "src_wits",
            env: {
                "PYTHONPATH": "../"
            }
        },
    ]
};

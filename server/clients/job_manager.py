from src.tasks.tasks import consume_flow_of_frames
from celery import group
from src.utils.singleton import singleton
from src.db.schemas.job import JobSchema
from clients.redis_manager import RedisManager


@singleton
class JobManager:
    @staticmethod
    def get_active_cameras(job: JobSchema):
        cameras = []

        content = {
            'camera_id': job.camera1_id,
            'number': '1',
            'status': job.camera1_is_active
        }
        cameras.append(content)

        content = {
            'camera_id': job.camera2_id,
            'number': '2',
            'status': job.camera2_is_active
        }
        cameras.append(content)

        content = {
            'camera_id': job.camera3_id,
            'number': '3',
            'status': job.camera3_is_active
        }
        cameras.append(content)

        return cameras

    @staticmethod
    def create_jobs(cameras):
        jobs = []
        for camera in cameras:
            if camera['number'] == '1':
                content = {
                    'id': 'camera1',
                    'camera_id': camera['camera_id'],
                    'status': camera['status']
                }
                RedisManager().add_data('job', 'add', content)
                jobs.append(content)
            if camera['number'] == '2':
                content = {
                    'id': 'camera2',
                    'camera_id': camera['camera_id'],
                    'status': camera['status']
                }
                RedisManager().add_data('job', 'add', content)
                jobs.append(content)
            if camera['number'] == '3':
                content = {
                    'id': 'camera3',
                    'camera_id': camera['camera_id'],
                    'status': camera['status']
                }
                RedisManager().add_data('job', 'add', content)
                jobs.append(content)
        return jobs

    @staticmethod
    def check_status_job(job: dict):
        job_content = RedisManager().get_data(job['id'])['data']
        if job_content['status']:
            return True
        else:
            return False

    def create_new_jobs(self, job: JobSchema):
        cameras = self.get_active_cameras(job)

        if cameras:
            jobs = self.create_jobs(cameras)
            if jobs:
                tasks = []
                for job in jobs:
                    camera = RedisManager().get_data(job['camera_id'])
                    if camera:
                        tasks.append(consume_flow_of_frames.s(job['id'], camera['data']['url']))

                task_group = group(tasks)
                task_group.apply_async()

            return jobs

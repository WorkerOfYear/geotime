module.exports = {
  apps: [
    {
      name: "load_video",
      script: "python3",
      args: "ffmpeg -hide_banner -y -loglevel error -rtsp_transport tcp -use_wallclock_as_timestamps 1 -i \"http://47.51.131.147/-wvhttp-01-/GetOneShot?image_size=1280x720&frame_count=1000000000\" -vcodec copy -acodec copy -f segment -reset_timestamps 1 -segment_time 300 -segment_format mkv -segment_atclocktime 1 -strftime 1 \".%%Y-%%m-%%dT%%H-%%M-%%S.mkv\"",
      autorestart: true,
      watch: false,
      max_memory_restart: "10G"
    }
  ]
};
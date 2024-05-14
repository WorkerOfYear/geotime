import { useState } from "react";
import clsx from "clsx";

import styles from "./Video.module.scss";

type Props = {
  className?: string;
  cameraUrl?: string;
  errorText?: string;
  showVideo?: boolean;
};

const Video = ({ className, cameraUrl, errorText, showVideo = true }: Props) => {
  const [loadError, setLoadError] = useState(false);

  return (
    <>
      <div className={clsx(className, styles.video)}>
        {showVideo ? (
          loadError ? (
            <p>Ошибка при работе камеры - {cameraUrl}</p>
          ) : (
            <img
              src={
                String(import.meta.env.VITE_BASE_VIDEO_URL) +
                String(import.meta.env.VITE_STREAM_ENDPOINT) +
                String(cameraUrl)
              }
              onError={() => setLoadError(true)}
              alt=""
            />
          )
        ) : (
          <div className={styles.video__text}>{errorText}</div>
        )}
      </div>
    </>
  );
};

export default Video;

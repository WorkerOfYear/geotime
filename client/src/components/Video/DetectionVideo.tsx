import { useState } from "react";
import clsx from "clsx";

import styles from "./Video.module.scss";

type Props = {
  className?: string;
  errorText?: string;
  cameraUrl?: string;
  showVideo?: boolean;
};

const DetectionVideo = ({ className, cameraUrl, errorText, showVideo = true }: Props) => {
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
                String(import.meta.env.VITE_DETECTION_STREAM_ENDPOINT) +
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

export default DetectionVideo;

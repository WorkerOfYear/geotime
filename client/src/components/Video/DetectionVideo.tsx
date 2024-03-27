import { useState } from "react";
import clsx from "clsx";

import styles from "./Video.module.scss";

type Props = {
  className?: string;
  errorText?: string;
  cameraUrl?: string;
  showVideo?: boolean;
};

const DetectionVideo = ({ className, cameraUrl, errorText, showVideo }: Props) => {
  const [loadError, setLoadError] = useState(false);

  return (
    <>
      <div className={clsx(className, styles.video)}>
        {showVideo ? (
          loadError ? (
            <p>Камера {cameraUrl} не подключена</p>
          ) : (
            <img
              src={String(import.meta.env.VITE_DETECTION_STREAM_ENDPOINT) + String(cameraUrl)}
              onError={(error) => setLoadError(true)}
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

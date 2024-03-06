import styles from "./Video.module.scss";
import clsx from "clsx";

type Props = {
  className?: string;
  errorText?: string;
  cameraUrl?: string;
  showVideo?: boolean;
};

const Video = ({ className, cameraUrl, errorText, showVideo}: Props) => {
  return (
    <div className={clsx(className, styles.video)}>
      {showVideo ? (
        <img src={String(import.meta.env.VITE_STREAM_ENDPOINT) + String(cameraUrl)}  alt="" /> //String(process.env.REACT_APP_BASE_URL) + String(process.env.REACT_APP_STREAM_ENDPOINT) + 
      ) : (
        <div className={styles.video__text}>{errorText}</div>
      )}
    </div>
  );
};

export default Video;

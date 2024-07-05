import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

import styles from "./Video.module.scss";
import axios from "axios";

type Props = {
  className?: string;
  errorText?: string;
  cameraUrl?: string;
  showVideo?: boolean;
};

const DetectionVideo = ({ className, cameraUrl, errorText, showVideo = false }: Props) => {
  const [loadError, setLoadError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // useEffect(() => {
  //   const fetchStream = async () => {
  //     const url = String(import.meta.env.VITE_BASE_VIDEO_URL) + String(import.meta.env.VITE_DETECTION_STREAM_ENDPOINT);

  //     const response = await axios.get(url, {
  //       responseType: "stream",
  //       params: {
  //         camera_url: String(cameraUrl),
  //       },
  //     });

  //     const reader = response.data.getReader();
  //     let imageData = "";

  //     while (true) {
  //       const { done, value } = await reader.read();
  //       if (done) {
  //         console.log("Stream finished");
  //         break;
  //       }

  //       // Convert the Uint8Array to a string and accumulate it
  //       imageData += new TextDecoder().decode(value);

  //       // Check for the end of the frame boundary
  //       const boundary = imageData.indexOf("\r\n\r\n");
  //       if (boundary !== -1) {
  //         // Extract the JPEG data
  //         const imageDataPart = imageData.slice(0, boundary);
  //         const imageBlob = new Blob([imageDataPart], { type: "image/jpeg" });
  //         const imageUrl = URL.createObjectURL(imageBlob);

  //         // Update the image source
  //         if (imgRef.current) {
  //           imgRef.current.src = imageUrl;
  //         }

  //         // Remove the processed part from the accumulated data
  //         imageData = imageData.slice(boundary + 4);
  //       }
  //     }
  //   };

  //   if (showVideo) {
  //     fetchStream();
  //   }
  // }, [showVideo]);

  useEffect(() => {
    if (showVideo && cameraUrl && imgRef.current) {
      imgRef.current.src =
        String(import.meta.env.VITE_BASE_VIDEO_URL) +
        String(import.meta.env.VITE_DETECTION_STREAM_ENDPOINT) +
        encodeURIComponent(cameraUrl);
    }

    if (!showVideo && imgRef.current) {
      imgRef.current.src = "";
    }

    return () => {
      if (imgRef.current) {
        imgRef.current.src = "";
      }
    }
  }, [showVideo]);

  return (
    <>
      <div className={clsx(className, styles.video)}>
        {showVideo ? (
          loadError ? (
            <p>Ошибка при работе камеры - {cameraUrl}</p>
          ) : (
            <img ref={imgRef} onError={() => setLoadError(true)} alt="" />
          )
        ) : (
          <div className={styles.video__text}>{errorText}</div>
        )}
      </div>
    </>
  );
};

export default DetectionVideo;

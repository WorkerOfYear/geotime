import { useEffect, useState } from "react";
import { useAppSelector } from "./redux";

export default function useProductFirstImg(sieveId: string | undefined) {
  const [firstImageUrl, setFirstImageUrl] = useState<string>("");
  const cameraReducer = useAppSelector((state) => state.cameraReducer);

  useEffect(() => {
    switch (Number(sieveId)) {
      case 1:
        if (cameraReducer.detectionImg1) {
          setFirstImageUrl(cameraReducer.detectionImg1);
        } else {
          setFirstImageUrl("");
        }
        break;
      case 2:
        if (cameraReducer.detectionImg2) {
          setFirstImageUrl(cameraReducer.detectionImg2);
        } else {
          setFirstImageUrl("");
        }
        break;
      case 3:
        if (cameraReducer.detectionImg3) {
          setFirstImageUrl(cameraReducer.detectionImg3);
        } else {
          setFirstImageUrl("");
        }
    }
  }, [cameraReducer.detectionImg1, cameraReducer.detectionImg2, cameraReducer.detectionImg3, sieveId]);

  return firstImageUrl;
}

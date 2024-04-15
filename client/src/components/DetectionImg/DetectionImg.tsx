import React, { useEffect } from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

import DetectionAreaSpawner from "./DetectionAreaSpawner";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { cameraSlice } from "../../store/reducers/CameraSlice";
import { IDetection } from "../../types/ICamera";

interface Props {
  imgUrl: string;
  cameraId: number;
}

const DetectionImg = ({ imgUrl, cameraId }: Props) => {
  const [image, state] = useImage(imgUrl);

  const dispatch = useAppDispatch();
  const cameraReducer = useAppSelector((state) => state.cameraReducer);

  const onPointsChange = (points: IDetection) => {
    dispatch(cameraSlice.actions.setDetectionPoints({ cameraIndex: cameraId, points: points }));
  };

  useEffect(() => {
    if (state !== "loaded") return;
    if (!image) return;
    dispatch(cameraSlice.actions.setHeightImgCoef({ cameraIndex: cameraId, coef: image.height / 230 }));
    dispatch(cameraSlice.actions.setWidthImgCoef({ cameraIndex: cameraId, coef: image.width / 452 }));
  }, [state]);

  return (
    <>
      <Stage width={452} height={230}>
        <Layer>
          <Image width={452} height={230} image={image} />
          <DetectionAreaSpawner onPointsChange={onPointsChange} />
        </Layer>
        <Layer name="top-layer" />
      </Stage>
    </>
  );
};

export default DetectionImg;

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

import DetectionAreaSpawner from "./DetectionAreaSpawner";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { cameraSlice } from "../../store/reducers/CameraSlice";
import { IDetection } from "../../types/ICamera";
import {
  checkNestedObject,
  createArrayFromDetection,
  getInitialDetectionById,
  getInitialProductIdByCameraId,
} from "../../utils/camera";
import { ClipLoader } from "react-spinners";

interface Props {
  imgUrl: string;
  cameraId: number;
}

const DetectionImg = ({ imgUrl, cameraId }: Props) => {
  const [image, state] = useImage(imgUrl);
  const [initialPoints, setInitialPoints] = useState<Array<number[]> | null>(null);
  const [savePoints, setSavePoints] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const cameraReducer = useAppSelector((state) => state.cameraReducer);

  useEffect(() => {
    if (state === "loading") {
      dispatch(cameraSlice.actions.setloadingImg(true));
    } else {
      dispatch(cameraSlice.actions.setloadingImg(false));
    }
  }, [state]);

  useEffect(() => {
    if (state !== "loaded") return;
    if (!image) return;
    const coefHeight = image.height / 230;
    const coefWidth = image.width / 452;

    dispatch(cameraSlice.actions.setHeightImgCoef({ cameraIndex: cameraId, coef: coefHeight }));
    dispatch(cameraSlice.actions.setWidthImgCoef({ cameraIndex: cameraId, coef: coefWidth }));

    const detection = getInitialDetectionById(cameraId, cameraReducer);

    console.log(detection);
    console.log(coefHeight);
    console.log(coefWidth);

    if (!detection || !coefHeight || !coefWidth) return;
    const stateDetection = checkNestedObject(detection);
    console.log(stateDetection);

    if (stateDetection) {
      setInitialPoints(() => {
        return createArrayFromDetection(detection, coefHeight, coefWidth);
      });
    }
    setSavePoints(true);
  }, [state, cameraId]);

  const onPointsChange = (points: IDetection) => {
    if (!savePoints) return;
    dispatch(cameraSlice.actions.setDetectionPoints({ cameraIndex: cameraId, points: points }));
  };

  return (
    <>
      {state === "loading" ? (
        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 452, height: 230 }}
        >
          <ClipLoader
            color={"#605dec"}
            loading={true}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <span>Ожидайте загрузки..</span>
        </div>
      ) : (
        <Stage width={452} height={230}>
          <Layer>
            <Image width={452} height={230} image={image} />
            <DetectionAreaSpawner initialPoints={initialPoints} onPointsChange={onPointsChange} />
          </Layer>
          <Layer name="top-layer" />
        </Stage>
      )}
    </>
  );
};

export default DetectionImg;

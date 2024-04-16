import { useEffect, useState } from "react";

import { ICamera, IDetection, IInitialCameras } from "../types/ICamera";
import { useAppDispatch, useAppSelector } from "./redux";
import { cameraSlice } from "../store/reducers/CameraSlice";
import { jobSlice } from "../store/reducers/JobSlice";

function chooseCamera(id: string | undefined, reducer: IInitialCameras) {
  if (id === "1") {
    return {
      name: "camera1",
      setCamera: cameraSlice.actions.setCamera1,
      setCameraId: jobSlice.actions.setCamera1Id,
      ...reducer.camera1,
    };
  } else if (id === "2") {
    return {
      name: "camera2",
      setCamera: cameraSlice.actions.setCamera2,
      setCameraId: jobSlice.actions.setCamera2Id,
      ...reducer.camera2,
    };
  } else if (id === "3") {
    return {
      name: "camera3",
      setCamera: cameraSlice.actions.setCamera3,
      setCameraId: jobSlice.actions.setCamera3Id,
      ...reducer.camera3,
    };
  } else return null;
}

export default function useProductState(sieveId: string | undefined) {
  const [factValue, setFactValue] = useState<string>("");
  const [sensity, setSensity] = useState<string>("");
  const [cameraUrl, setCameraUrl] = useState<string>("");
  const [detection, setDetection] = useState<IDetection | null>(null);

  const dispatch = useAppDispatch();
  const cameraReducer = useAppSelector((state) => state.cameraReducer);
  const productObject = chooseCamera(sieveId, cameraReducer);

  useEffect(() => {
    if (!productObject) return;

    const localStoreData = localStorage.getItem(productObject.name);
    if (localStoreData) {
      const camera: ICamera = JSON.parse(localStoreData);
      dispatch(productObject.setCamera(camera));
      setSensity(camera.data.sensitivity);
      setFactValue(camera.data.volume);
      setCameraUrl(camera.data.url);
      setDetection(camera.detection);

      dispatch(productObject.setCameraId(camera.id));
      return;
    }

    if (productObject.data.sensitivity) {
      setSensity(productObject.data.sensitivity);
    } else {
      setSensity("");
    }
    if (productObject.data.volume) {
      setFactValue(productObject.data.volume);
    } else {
      setFactValue("");
    }
    if (productObject.data.url) {
      setCameraUrl(productObject.data.url);
    } else {
      setCameraUrl("");
    }
    if (productObject.detection) {
      setDetection(productObject.detection);
    } else {
      setDetection(null);
    }
  }, [sieveId]);

  useEffect(() => {
    dispatch(cameraSlice.actions.setCameraVolume({ cameraIndex: Number(sieveId), volume: factValue }));
  }, [factValue]);

  useEffect(() => {
    dispatch(
      cameraSlice.actions.setCameraSensitivity({ cameraIndex: Number(sieveId), sensitivity: sensity })
    );
  }, [sensity]);

  return {
    factValue: { value: factValue, setValue: setFactValue },
    sensity: { value: sensity, setValue: setSensity },
    cameraUrl: { value: cameraUrl, setValue: setCameraUrl },
    detection,
    setDetection,
  };
}

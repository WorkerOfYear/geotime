/// <reference types="vite-plugin-svgr/client" />

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Video from "../components/Video";
import Item from "../components/Item";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import CalibrateButtons from "../components/Buttons/CalibrateButtons/CalibrateButtons";
import graph from "./../assets/images/graph.png";
import DetectionImg from "../components/DetectionImg/DetectionImg";
import DetectionVideo from "../components/Video/DetectionVideo";
import useProductState from "../hooks/useProductState";
import useProductFirstImg from "../hooks/useProductFirstImg";
import BottomMenu from "../components/Product/BottomMenu";
import {
  getFirstImg,
  setCalibrationCamera,
  setStreamingCamera,
  stopDetection,
} from "../store/reducers/actions/ActionCreators";
import Params from "../components/Product/Params";
import chooseCamera from "../utils/camera";
import Stopwatch from "../components/ui/Stopwatch/Stopwatch";

const ProductPage = () => {
  const [cameraUrlInput, setCameraUrlInput] = useState<string>("");
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [showDetectinVideo, setShowDetectinVideo] = useState<boolean>(false);
  const [showTimer, setShowTimer] = useState<boolean>(false);
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false);
  const [enableStartCalibration, setEnableStartCalibration] = useState<boolean>(false);
  
  const { sieve_id: sieveId } = useParams();

  const dispatch = useAppDispatch();
  const cameraReducer = useAppSelector((state) => state.cameraReducer);
  const productObject = chooseCamera(sieveId, cameraReducer);
  const loadingImg = useAppSelector(state => state.cameraReducer.loadingImg)
  
  const { factValue, sensity, cameraUrl, detection, setDetection } = useProductState(sieveId);
  const firstImageUrl = useProductFirstImg(sieveId);

  useEffect(() => {
    setCameraUrlInput(cameraUrl.value);
  }, [cameraUrl.value]);

  useEffect(() => {
    if (!productObject) return;
    setDetection(productObject.detection);
  }, [productObject?.detection]);

  const handleSubmit = () => {
    if (!cameraUrl || !productObject) return;
    if (cameraUrl.value !== cameraUrlInput) {
      alert(
        `Камера была изменена после получения первого кадра! Калибровка выполнялась для камеры с url: ${cameraUrl.value}`
      );
      return;
    }
    dispatch(
      productObject.action.setCamera({
        id: productObject.id,
        detection: productObject.detection,
        type: productObject.type,
        data: { ...productObject.data, sensitivity: sensity.value, volume: factValue.value },
      })
    );
    dispatch(
      setStreamingCamera({
        id: productObject.id,
        type: ["streaming"],
        data: { ...productObject.data },
        detection: productObject.detection,
      })
    ).then(() => {
      dispatch(productObject.action.setCameraId(productObject.id));
      localStorage.setItem(
        productObject.name,
        JSON.stringify({
          id: productObject.id,
          type: ["streaming"],
          data: { ...productObject.data },
          detection: productObject.detection,
        })
      );
    });
  };

  const handleCameraSubmit = () => {
    if (!cameraUrlInput || !productObject) return;
    cameraUrl.setValue(cameraUrlInput);
    setShowVideo(true);
    dispatch(
      productObject.action.setCamera({
        id: productObject.id,
        detection: productObject.detection,
        type: productObject.type,
        data: { ...productObject.data, url: cameraUrlInput },
      })
    );
    dispatch(getFirstImg(Number(sieveId), cameraUrlInput)).then((respnse) => {
      if (respnse?.status === 200) {
        setEnableStartCalibration(true);
      }
    });
  };

  const handleStartCalibration = () => {
    if (!productObject || !productObject.id) return;
    dispatch(
      setCalibrationCamera({
        id: productObject.id,
        type: ["calibration"],
        data: { ...productObject.data },
        detection: productObject.detection,
      })
    );
    setShowTimer(true);
    setShowDetectinVideo(true)
  };

  const handleStopCalibration = () => {
    if (!cameraReducer.detectionProcessId) return;

    dispatch(stopDetection(cameraReducer.detectionProcessId)).then((response) => {
      if (response?.status === 200) {
        setEnableSubmit(true);
      }
    });

    setShowDetectinVideo(false)
  };

  return (
    <div className={"product"}>
      <div className="product__title">{`Окно калибровки камеры №${sieveId}`}</div>
      <div className="product__header">
        <div>
          <CalibrateButtons
            disabledStart={cameraReducer.detectionProcess || !enableStartCalibration || loadingImg}
            disabledStop={!cameraReducer.detectionProcess}
            onStart={handleStartCalibration}
            onStop={handleStopCalibration}
          />
          {showTimer ? <Stopwatch start={cameraReducer.detectionProcess} /> : null}
        </div>
      </div>
      <div className="product__body">
        <div className="product__videowrapper">
          <div className="product__url">
            <span>Введите url камеры</span>
            <div style={{ display: "flex" }}>
              <Item
                value={cameraUrlInput}
                onChange={(e) => setCameraUrlInput(e.currentTarget.value)}
                placeholder={"rtsp://host:port/path"}
              />
              <button onClick={handleCameraSubmit} className="button button--border" disabled={loadingImg}>
                Применить
              </button>
            </div>
          </div>
          <div className="product__video" style={{ backgroundImage: graph }}>
            <Video
              className={"product-video"}
              errorText={productObject?.errorText}
              cameraUrl={cameraUrl.value}
              showVideo={showVideo}
            />
          </div>
          <div className="product__video" style={{ backgroundImage: graph }}>
            {firstImageUrl && !cameraReducer.detectionProcess ? (
              <DetectionImg imgUrl={firstImageUrl} cameraId={Number(sieveId)} />
            ) : (
              <DetectionVideo
                className={"product-video"}
                errorText="Видео с детекцией"
                cameraUrl={cameraUrl.value}
                showVideo={showDetectinVideo}
              />
            )}
          </div>
        </div>
        <Params factValue={factValue} sensity={sensity} detection={detection} />
      </div>
      <BottomMenu
        disabled={!(enableSubmit && factValue.value && sensity.value && !cameraReducer.detectionProcess)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProductPage;

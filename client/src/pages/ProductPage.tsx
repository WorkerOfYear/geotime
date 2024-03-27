/// <reference types="vite-plugin-svgr/client" />

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import Video from "../components/Video";
import Item from "../components/Item";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { IInitialCameras } from "../types/ICamera";
import { cameraSlice } from "../store/reducers/CameraSlice";
import {
  getCameraData,
  getFirstImg,
  setCalibrationCamera,
  setStreamingCamera,
  stopDetection,
} from "../store/reducers/actions/ActionCreators";
import { jobSlice } from "../store/reducers/JobSlice";
import CalibrateButtons from "../components/Buttons/CalibrateButtons/CalibrateButtons";
import graph from "./../assets/images/graph.png";
import DetectionImg from "../components/DetectionImg/DetectionImg";
import DetectionVideo from "../components/Video/DetectionVideo";

function chooseCamera(id: string | undefined, reducer: IInitialCameras) {
  if (id === "1") {
    return {
      name: "camera1",
      errorText: "Видео с камеры 1",
      action: {
        setCamera: cameraSlice.actions.setCamera1,
        setCameraId: jobSlice.actions.setCamera1Id,
      },
      ...reducer.camera1,
    };
  } else if (id === "2") {
    return {
      name: "camera2",
      errorText: "Видео с камеры 2",
      action: {
        setCamera: cameraSlice.actions.setCamera2,
        setCameraId: jobSlice.actions.setCamera2Id,
      },
      ...reducer.camera2,
    };
  } else if (id === "3") {
    return {
      name: "camera3",
      errorText: "Видео с камеры 3",
      action: {
        setCamera: cameraSlice.actions.setCamera3,
        setCameraId: jobSlice.actions.setCamera3Id,
      },
      ...reducer.camera3,
    };
  } else return null;
}

const ProductPage = () => {
  const [factValue, setFactValue] = useState<string>("");
  const [sensity, setSensity] = useState<string>("");
  const [cameraUrl, setCameraUrl] = useState<string>("");
  const [cameraUrlInput, setCameraUrlInput] = useState<string>("");
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [firstImageUrl, setFirstImageUrl] = useState<string>("");

  const navigate = useNavigate();

  const { sieve_id: sieveId } = useParams();

  const dispatch = useAppDispatch();
  const cameraReducer = useAppSelector((state) => state.cameraReducer);
  const productObject = chooseCamera(sieveId, cameraReducer);

  useEffect(() => {
    if (productObject?.data.sensitivity) setSensity(productObject?.data.sensitivity);
    if (productObject?.data.volume) setFactValue(productObject?.data.volume);
  }, []);

  useEffect(() => {
    let url: string | null = null;

    if (productObject) {
      url = productObject.data.url;
      if (!url) {
        url = localStorage.getItem(productObject.name);
        if (url) console.log(`Saved camera url: ${url}`);
      }
      if (url) {
        setCameraUrl(url);
        setCameraUrlInput(url);
      }
    }
  }, []);

  const handleUrlInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCameraUrlInput(e.currentTarget.value);
  };

  const handleSubmitBtn = () => {
    if (cameraUrl && productObject) {
      if (cameraUrl !== cameraUrlInput) {
        alert("Камера была изменена после получения первого кадра!");
        return;
      }
      dispatch(
        productObject.action.setCamera({
          id: productObject.id,
          detection: productObject.detection,
          type: productObject.type,
          data: { ...productObject.data, sensitivity: sensity, volume: factValue },
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
      });
    }
  };

  useEffect(() => {
    switch (Number(sieveId)) {
      case 1:
        if (cameraReducer.detectionImg1) {
          setFirstImageUrl(cameraReducer.detectionImg1);
        }
      case 2:
        if (cameraReducer.detectionImg2) {
          setFirstImageUrl(cameraReducer.detectionImg2);
        }
      case 3:
        if (cameraReducer.detectionImg3) {
          setFirstImageUrl(cameraReducer.detectionImg3);
        }
    }
  }, [cameraReducer]);

  const handleCameraSubmit = () => {
    if (!cameraUrlInput || !productObject) return;

    setCameraUrl(cameraUrlInput);
    setShowVideo(true);
    localStorage.setItem(productObject.name, cameraUrlInput);
    dispatch(
      productObject.action.setCamera({
        id: productObject.id,
        detection: productObject.detection,
        type: productObject.type,
        data: { ...productObject.data, url: cameraUrlInput },
      })
    );

    dispatch(getFirstImg(Number(sieveId), cameraUrlInput));
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
  };

  const handleStopCalibration = () => {
    if (!cameraReducer.detectionProcessId) return;
    dispatch(stopDetection(cameraReducer.detectionProcessId));
  };

  return (
    <div className={"product"}>
      <div className="product__title">{`Окно калибровки камеры №${sieveId}`}</div>
      <div className="product__header">
        <div>
          <CalibrateButtons
            disabled={cameraReducer.detectionProcess}
            onStart={handleStartCalibration}
            onStop={handleStopCalibration}
          />
        </div>
      </div>
      <div className="product__body">
        <div className="product__videowrapper">
          <div className="product__url">
            <span>Введите url камеры</span>
            <div style={{ display: "flex" }}>
              <Item
                value={cameraUrlInput}
                onChange={handleUrlInputChange}
                placeholder={"rtsp://host:port/path"}
              />
              <button onClick={handleCameraSubmit} className="button button--border">
                Применить
              </button>
            </div>
          </div>
          <div className="product__video" style={{ backgroundImage: graph }}>
            <Video
              className={"product-video"}
              errorText={productObject?.errorText}
              cameraUrl={cameraUrl}
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
                cameraUrl={cameraUrl}
                showVideo={showVideo}
              />
            )}
          </div>
        </div>
        <div className="product__col">
          <div className="product__info">
            <span>Фактический объем, л</span>
            <Item
              type="number"
              placeholder={"0.00"}
              value={factValue}
              onChange={(e) => setFactValue(e.currentTarget.value)}
            />
          </div>
          <div className="product__info">
            <span>Чувствительность</span>
            <Item
              type="number"
              placeholder={"0.00"}
              value={sensity}
              onChange={(e) => setSensity(e.currentTarget.value)}
            />
          </div>
          <div className="product__info product__info--bg">
            <span>
              Окно <br /> детектирования:
            </span>
            <div className="product__info-wrapper">
              <div className="product__info-details">
                A
                <Item
                  placeholder={"0"}
                  label={"Координата Х"}
                  value={productObject?.detection.A.x}
                  readOnly={true}
                />
                <Item
                  placeholder={"0"}
                  label={"Координата Y"}
                  value={productObject?.detection.A.y}
                  readOnly={true}
                />
              </div>
              <div className="product__info-details">
                B
                <Item
                  placeholder={"0"}
                  label={"Координата Х"}
                  value={productObject?.detection.B.x}
                  readOnly={true}
                />
                <Item
                  placeholder={"0"}
                  label={"Координата Y"}
                  value={productObject?.detection.B.y}
                  readOnly={true}
                />
              </div>
              <div className="product__info-details">
                C
                <Item
                  placeholder={"0"}
                  label={"Координата Х"}
                  value={productObject?.detection.C.x}
                  readOnly={true}
                />
                <Item
                  placeholder={"0"}
                  label={"Координата Y"}
                  value={productObject?.detection.C.y}
                  readOnly={true}
                />
              </div>
              <div className="product__info-details">
                D
                <Item
                  placeholder={"0"}
                  label={"Координата Х"}
                  value={productObject?.detection.D.x}
                  readOnly={true}
                />
                <Item
                  placeholder={"0"}
                  label={"Координата Y"}
                  value={productObject?.detection.D.y}
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product__bottom">
        <Link className="product__link" to="/">
          На главную
        </Link>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className="button button--border" onClick={handleSubmitBtn}>
              Применить
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="AlertDialogOverlay" />
            <AlertDialog.Content className="AlertDialogContent">
              <AlertDialog.Title className="AlertDialogTitle">
                Калибровка выполнена! Перейти на главную страницу?
              </AlertDialog.Title>
              <div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
                <AlertDialog.Cancel asChild>
                  <button className="button">Остаться</button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild onClick={() => navigate("/")}>
                  <button className="button button--border">На главную</button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>
    </div>
  );
};

export default ProductPage;

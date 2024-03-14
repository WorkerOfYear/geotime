/// <reference types="vite-plugin-svgr/client" />

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

import Video from "../components/Video";
import Item from "../components/Item";
import JobProductButtons from "../components/Buttons/JobProductButtons";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { ICamera, IInitialCameras } from "../types/ICamera";
import { cameraSlice } from "../store/reducers/CameraSlice";
import { getCameraData, setCamera } from "../store/reducers/actions/ActionCreators";
import { jobSlice } from "../store/reducers/JobSlice";
import CalibrateButtons from "../components/Buttons/CalibrateButtons/CalibrateButtons";

function chooseCamera(id: string | undefined, reducer: IInitialCameras) {
  if (id === "1") {
    return {
      name: "camera1",
      errorText: "Видео с вибросито 1",
      action: {
        setCamera: cameraSlice.actions.setCamera1,
        setCameraId: jobSlice.actions.setCamera1Id,
      },
      ...reducer.camera1,
    };
  } else if (id === "2") {
    return {
      name: "camera2",
      errorText: "Видео с вибросито 2",
      action: {
        setCamera: cameraSlice.actions.setCamera2,
        setCameraId: jobSlice.actions.setCamera2Id,
      },
      ...reducer.camera2,
    };
  } else if (id === "3") {
    return {
      name: "camera3",
      errorText: "Видео с вибросито 3",
      action: {
        setCamera: cameraSlice.actions.setCamera3,
        setCameraId: jobSlice.actions.setCamera3Id,
      },
      ...reducer.camera3,
    };
  } else return null;
}

const ProductPage = () => {
  const [cameraUrl, setCameraUrl] = useState<string>("");
  const [cameraUrlInput, setCameraUrlInput] = useState<string>("");
  const [showVideo, setShowVideo] = useState<boolean>(false);

  const navigate = useNavigate();

  const { sieve_id: sieveId } = useParams();

  const dispatch = useAppDispatch();
  const cameraReducer = useAppSelector((state) => state.cameraReducer);
  const productObject = chooseCamera(sieveId, cameraReducer);

  useEffect(() => {
    let url: string | null = null;

    if (productObject) {
      url = productObject.data.url;

      if (!url) {
        const id = localStorage.getItem(productObject.name);

        if (id) {
          console.log(`Saved camera id: ${id}`);
          dispatch(getCameraData(id)).then((data) => {
            if (data) {
              dispatch(productObject.action.setCamera(data));
              dispatch(productObject.action.setCameraId(id));
              setCameraUrl(data.data.url);
              setCameraUrlInput(data.data.url);
            }
          });
        }
      }
      if (url) {
        setCameraUrl(url);
        setCameraUrlInput(url);
      }
    }
  }, []);

  const handleUrlOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setCameraUrlInput(e.currentTarget.value);
  };

  const handleSubmitBtn = () => {
    if (cameraUrlInput && productObject) {
      const newCamera: ICamera = {
        id: productObject.id,
        data: { ...productObject.data, url: cameraUrlInput },
        detection: productObject.detection,
      };
      console.log(newCamera);

      dispatch(setCamera(newCamera)).then((data) => {
        if (data?.id) {
          localStorage.setItem(productObject.name, data.id);
          dispatch(productObject.action.setCamera({ ...newCamera, id: data.id }));
          dispatch(productObject.action.setCameraId(data.id));
          console.log(`${productObject.name} with id: ${data.id} set`);
        }
      });

      setCameraUrl(cameraUrlInput);
      setCameraUrlInput(cameraUrlInput);
    }
  };

  return (
    <div className={"product"}>
      <div className="product__header">
        <div>
          <JobProductButtons
            onClickStart={() => setShowVideo(true)}
            onClickStop={() => setShowVideo(false)}
          />
        </div>
        <div>
          <CalibrateButtons/>
        </div>
        <Link className="product__link" to="/">На главную</Link>
      </div>
      <div className="product__body">
        <div className="product__videowrapper">
          <div className="product__video" style={{ backgroundImage: "/graph.png" }}>
            <Video
              className={"product-video"}
              errorText={productObject?.errorText}
              cameraUrl={cameraUrl}
              showVideo={showVideo}
            />
          </div>
          <div className="product__url">
            <span>Введите rtsp url камеры</span>
            <Item value={cameraUrlInput} onChange={handleUrlOnChange} placeholder={"rtsp://host:port/path"} />
          </div>
        </div>
        <div className="product__col">
          <div className="product__info">
            <span>Фактический объем, л</span>
            <Item placeholder={"0.00"} />
          </div>
          <div className="product__info">
            <span>Чувствительность</span>
            <Item placeholder={"0.00"} />
          </div>
          <div className="product__info product__info--bg">
            <span>
              Окно <br /> детектирования:
            </span>
            <div className="product__info-wrapper">
              <div className="product__info-details">
                A
                <Item placeholder={"0"} label={"Координата Х"} />
                <Item placeholder={"0"} label={"Координата Y"} />
              </div>
              <div className="product__info-details">
                D
                <Item placeholder={"0"} label={"Координата Х"} />
                <Item placeholder={"0"} label={"Координата Y"} />
              </div>
              <div className="product__info-details">
                B
                <Item placeholder={"0"} label={"Координата Х"} />
                <Item placeholder={"0"} label={"Координата Y"} />
              </div>
              <div className="product__info-details">
                C
                <Item placeholder={"0"} label={"Координата Х"} />
                <Item placeholder={"0"} label={"Координата Y"} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="product__bottom">
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
                Сохранено! Перейти на главную страницу?
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

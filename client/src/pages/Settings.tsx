import React, { useEffect, useState } from "react";
import Item from "../components/Item";
import SettingList from "../components/SettingList";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { witsSlice } from "../store/reducers/WitsSlice";
import { setWits } from "../store/reducers/actions/ActionCreators";
import { IWits } from "../types/IWits";
import { reportApi, witsSocket } from "../services/ReportService";


const Settings = () => {
  const [witsSettings, setWitsSettings] = useState<IWits>({
    host: "",
    port: "",
    depth: "",
    lag_depth: "",
    well_diam: "",
  });

  const [checkWits, setCheckWits] = useState<boolean>(false)

  const dispatch = useAppDispatch();
  const witsReducer = useAppSelector((state) => state.witsReducer);

  useEffect(() => {
    setWitsSettings(witsReducer.data);
  }, [witsReducer]);

  const handleHostOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setWitsSettings({ ...witsSettings, host: e.currentTarget.value });
  };

  const handlePortOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setWitsSettings({ ...witsSettings, port: e.currentTarget.value });
  };

  const handleDepthOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setWitsSettings({ ...witsSettings, depth: e.currentTarget.value });
  };

  const handleLagDepthOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setWitsSettings({ ...witsSettings, lag_depth: e.currentTarget.value });
  };

  const handleWellDiamOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    setWitsSettings({ ...witsSettings, well_diam: e.currentTarget.value });
  };

  const handleSubmitBtn = () => {
    dispatch(setWits(witsSettings)).then((data) => {
      if (data) {
        dispatch(witsSlice.actions.setWits(witsSettings));
      }
    });
  };

  const handleCheckWits = () => {
    setCheckWits(!checkWits)
    if (!checkWits) {
      dispatch(reportApi.util.resetApiState());
      dispatch(witsSlice.actions.setStream(true))
    } else {
      console.log(witsSocket)
      if (witsSocket) {
        console.log(witsSocket.readyState)
        witsSocket.close()
        console.log(witsSocket.readyState)
      }
    }
  }

  return (
    <div className={"settings"}>
      <div className="settings__header">
        <Item
          value={witsSettings.host}
          onChange={handleHostOnChange}
          label={"IP адрес источника WITS"}
          placeholder={"94.41.125.130"}
        />
        <Item
          value={witsSettings.port}
          onChange={handlePortOnChange}
          label={"Порт источника WITS"}
          placeholder={"12001"}
        />
        <button onClick={handleCheckWits} className="button button--accent">{checkWits ? 'Остановить проверку' : 'Начать проверку'}</button>
      </div>
      <div className="settings__sub-header">
        <div className="setting__sub-item sub-item">
          <Item
            value={witsSettings.depth}
            onChange={handleDepthOnChange}
            className={"sub-item__input"}
            placeholder={"0108"}
          />
          <div className="sub-item__text">Номер параметра “Глубина,м”</div>
        </div>
        <div className="setting__sub-item sub-item">
          <Item
            value={witsSettings.lag_depth}
            onChange={handleLagDepthOnChange}
            className={"sub-item__input"}
            placeholder={"1108"}
          />
          <div className="sub-item__text">Номер параметра “Глуб.шлама,м”</div>
        </div>
        <div className="setting__sub-item sub-item">
          <Item
            value={witsSettings.well_diam}
            onChange={handleWellDiamOnChange}
            className={"sub-item__input"}
            placeholder={"0844"}
          />
          <div className="sub-item__text">Номер параметра “Диам.скв.,м”</div>
        </div>
      </div>
      <div className="settings__list">
        <Link className="settings__link button" to="/">
          На главную
        </Link>
        <SettingList onSubmit={handleSubmitBtn} />
      </div>
    </div>
  );
};

export default Settings;

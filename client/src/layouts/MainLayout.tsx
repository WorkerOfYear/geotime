import React, { ReactNode, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getWitsData } from "../store/reducers/actions/ActionCreators";
import { witsSlice } from "../store/reducers/WitsSlice";
import { jobSocket, witsSocket } from "../services/ReportService";

type Props = {
  children?: ReactNode;
};
const MainLayout = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const jobReducer = useAppSelector((state) => state.jobReducer);
  const witsReducer = useAppSelector((state) => state.witsReducer);
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnload = () => {
      console.log("unload")
      // if (!jobReducer.jobState && jobSocket && (jobSocket.readyState === jobSocket.CONNECTING || jobSocket.readyState === jobSocket.OPEN)) {
      //   console.log("closing socket")
      //   jobSocket.close()
      // }
      // if (!witsReducer.stream && witsSocket && (witsSocket.readyState === witsSocket.CONNECTING || witsSocket.readyState === witsSocket.OPEN)) {
      //   console.log("closing socket")
      //   witsSocket.close()
      // }
    };
    window.addEventListener("unload", handleUnload);
    return () => {
      window.removeEventListener("unload", handleUnload);
    }
  }, []);
  
  useEffect(() => {
    if (!jobReducer.jobState && jobSocket && (jobSocket.readyState === jobSocket.CONNECTING || jobSocket.readyState === jobSocket.OPEN)) {
      console.log("closing socket")
      jobSocket.close()
    }
    if (!witsReducer.stream && witsSocket && (witsSocket.readyState === witsSocket.CONNECTING || witsSocket.readyState === witsSocket.OPEN)) {
      console.log("closing socket")
      witsSocket.close()
    }
  }, [navigate])
  
  useEffect(() => {
    if (!witsReducer.initialised) {
      dispatch(getWitsData()).then((data) => {
        if (data?.data) {
          dispatch(witsSlice.actions.setWits(data.data));
          dispatch(witsSlice.actions.setInitialised(true));
          console.log("Wits initialised")
        }
      });
    }
  }, []);

  return (
    <div className={"main"}>
      <Outlet />
      {children}
    </div>
  );
};

export default MainLayout;

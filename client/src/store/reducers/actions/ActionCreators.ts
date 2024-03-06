import axios from "axios";

import { AppDispatch } from "../../store";
import { jobSlice } from "../JobSlice";
import { IJob } from "../../../types/IJob";
import { ICamera } from "../../../types/ICamera";
import { IWits } from "../../../types/IWits";

const JOB_CHANGE_STATUS =
  String(import.meta.env.VITE_BASE_URL) +
  String(import.meta.env.VITE_CHANGE_STATUS);

const SET_CAMERA =
  String(import.meta.env.VITE_BASE_URL) + String(import.meta.env.VITE_CAMERA);

const SET_WITS =
  String(import.meta.env.VITE_BASE_URL) + String(import.meta.env.VITE_WITS);

const GET_DATA =
  String(import.meta.env.VITE_BASE_URL) + String(import.meta.env.VITE_GET_DATA);

export const startJob = (state: IJob) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(JOB_CHANGE_STATUS, {
      camera1_is_active: state.camera1_is_active,
      camera1_id: state.camera1_id,
      camera2_is_active: state.camera2_is_active,
      camera2_id: state.camera2_id,
      camera3_is_active: state.camera3_is_active,
      camera3_id: state.camera3_id,
    });

    if (response.status === 200) {
      console.log("Job started");
      dispatch(jobSlice.actions.setJobState(true));
    } else {
      console.log(`Job started status code: ${response.status}`);
    }
  } catch (e) {
    alert("Ошибка при запросе к серверу, попробуйте снова");
  }
};

export const stopJob = (state: IJob | null) => async (dispatch: AppDispatch) => {
  if (!state) {
    state = {
      camera1_id: "",
      camera1_is_active: false,
      camera2_id: "",
      camera2_is_active: false,
      camera3_id: "",
      camera3_is_active: false,
    }
  }
  
  try {
    const response = await axios.post(JOB_CHANGE_STATUS, {
      camera1_is_active: false,
      camera1_id: state.camera1_id,
      camera2_is_active: false,
      camera2_id: state.camera2_id,
      camera3_is_active: false,
      camera3_id: state.camera3_id,
    });

    if (response.status === 200) {
      console.log("Job stopped");
      dispatch(jobSlice.actions.setJobState(false));
    } else {
      console.log(`Job stopped status code: ${response.status}`);
    }
  } catch (e) {
    alert("Ошибка при запросе к серверу, попробуйте снова");
  }
};

interface ISetCameraResponse {
  id: string
}

export const setCamera = (state: ICamera) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post<ISetCameraResponse>(SET_CAMERA, {
      ...state,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`setCamera status code: ${response.status}`);
    }
  } catch (e) {
    alert("Ошибка при запросе к серверу, попробуйте снова");
  }
};

export const setWits = (state: IWits) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post(SET_WITS, {
      data: state,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`setWits status code: ${response.status}`);
    }
  } catch (e) {
    alert("Ошибка при запросе к серверу, попробуйте снова");
  }
};

export const getCameraData = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post<ICamera>(GET_DATA, {
      id: id,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`getCameraData status code: ${response.status}`);
    }
  } catch (e) {
    alert("Ошибка при запросе к серверу, попробуйте снова");
  }
};

interface IGetWitsDataResponse {
  data: IWits
}

export const getWitsData = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post<IGetWitsDataResponse>(GET_DATA, {
      id: "wits",
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.log(`getWitsData status code: ${response.status}`);
    }
  } catch (e) {
    alert("Ошибка при запросе к серверу, попробуйте снова");
  }
};



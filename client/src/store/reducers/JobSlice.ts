import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJob } from "../../types/IJob";
import { IReport } from "../../types/IReport";
import { RootState } from "../store";

interface IInitialJob {
  savedCamera1Reports: IReport[];
  savedCamera2Reports: IReport[];
  savedCamera3Reports: IReport[];
  savedResReport: IReport | null;
  jobState: boolean;
  job: IJob;
}

const initialState: IInitialJob = {
  savedCamera1Reports: [],
  savedCamera2Reports: [],
  savedCamera3Reports: [],
  savedResReport: null,
  jobState: false,
  job: {
    camera1_is_active: false,
    camera1_id: "",
    camera2_is_active: false,
    camera2_id: "",
    camera3_is_active: false,
    camera3_id: "",
  },
};

export const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    addCameraReports(state, action: PayloadAction<{ id: number; report: IReport }>) {
      switch (action.payload.id) {
        case 1:
          state.savedCamera1Reports.unshift(action.payload.report);
          break;
        case 2:
          state.savedCamera2Reports.unshift(action.payload.report);
          break;
        case 3:
          state.savedCamera3Reports.unshift(action.payload.report);
      }
    },

    addResReport(state, action: PayloadAction<IReport>) {
      state.savedResReport = action.payload;
    },

    setJobState(state, action: PayloadAction<boolean>) {
      state.jobState = action.payload;
    },

    setCamera1IsActive(state, action: PayloadAction<boolean>) {
      state.job.camera1_is_active = action.payload;
    },

    setCamera2IsActive(state, action: PayloadAction<boolean>) {
      state.job.camera2_is_active = action.payload;
    },

    setCamera3IsActive(state, action: PayloadAction<boolean>) {
      state.job.camera3_is_active = action.payload;
    },

    setCamera1Id(state, action: PayloadAction<string | null>) {
      state.job.camera1_id = action.payload;
    },

    setCamera2Id(state, action: PayloadAction<string | null>) {
      state.job.camera2_id = action.payload;
    },

    setCamera3Id(state, action: PayloadAction<string | null>) {
      state.job.camera3_id = action.payload;
    },
  },
});

export const selectCameraReports = (id: number, state: RootState) => {
  switch (id) {
    case 1:
      return state.jobReducer.savedCamera1Reports;
    case 2:
      return state.jobReducer.savedCamera2Reports;
    case 3:
      return state.jobReducer.savedCamera3Reports;
  }
};
export default jobSlice.reducer;

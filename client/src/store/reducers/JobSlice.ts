import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IJob } from "../../types/IJob";
import { IReport } from "../../types/IReport";


interface IInitialJob {
  savedReports: IReport[],
  jobState: boolean;
  job: IJob;
}

const initialState: IInitialJob = {
  savedReports: [],
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
    addSavedReports(state, action: PayloadAction<IReport>) {
      state.savedReports.push(action.payload)
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

export default jobSlice.reducer;

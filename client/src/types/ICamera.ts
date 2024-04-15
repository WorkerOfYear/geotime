interface ICoords {
  x: string;
  y: string;
}

export interface IDetection {
  A: ICoords;
  B: ICoords;
  C: ICoords;
  D: ICoords;
}

interface IData {
  url: string;
  volume: string;
  sensitivity: string;
}

export interface ICamera {
  id: string | null;
  type: Array<"calibration" | "streaming">;
  data: IData;
  detection: IDetection;
}

export interface IInitialCameras {
  detectionProcess: boolean;
  detectionProcessId: string | null;
  camera1: ICamera;
  camera2: ICamera;
  camera3: ICamera;
  detectionImg1: string;
  coef_w_1: number;
  coef_h_1: number;
  detectionImg2: string;
  coef_w_2: number;
  coef_h_2: number;
  detectionImg3: string;
  coef_w_3: number;
  coef_h_3: number;
}

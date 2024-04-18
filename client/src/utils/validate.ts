import { ICamera, ICoords, IData, IDetection } from "../types/ICamera";

export function checkCamera(obj: any): obj is ICamera {
  return (
    (typeof obj === "object" && obj.id === null) ||
    (typeof obj.id === "string" &&
      Array.isArray(obj.type) &&
      obj.type.length > 0 &&
      obj.type.every((t: any) => t === "calibration" || t === "streaming") &&
      validateData(obj.data) &&
      validateDetection(obj.detection))
  );
}

function validateData(data: any): data is IData {
  return (
    typeof data === "object" &&
    typeof data.url === "string" &&
    typeof data.volume === "string" &&
    typeof data.sensitivity === "string"
  );
}

function validateDetection(detection: any): detection is IDetection {
  return (
    typeof detection === "object" &&
    validateCoords(detection.A) &&
    validateCoords(detection.B) &&
    validateCoords(detection.C) &&
    validateCoords(detection.D)
  );
}

function validateCoords(coords: any): coords is ICoords {
  return typeof coords === "object" && typeof coords.x === "string" && typeof coords.y === "string";
}

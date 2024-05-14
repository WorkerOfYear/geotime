import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { IReport } from "../types/IReport";
import { jobSlice } from "../store/reducers/JobSlice";
import { witsSlice } from "../store/reducers/WitsSlice";
import { stopJob } from "../store/reducers/actions/ActionCreators";

export let camera1Socket: WebSocket;
export let camera2Socket: WebSocket;
export let camera3Socket: WebSocket;
function getCameraSocket(camera_id: number) {
  switch (camera_id) {
    case 1:
      camera1Socket = new WebSocket(
        String(import.meta.env.VITE_BASE_WS_URL) + String(import.meta.env.VITE_WS_CAMERA_DATA) + "1"
      );
      return camera1Socket;
    case 2:
      camera2Socket = new WebSocket(
        String(import.meta.env.VITE_BASE_WS_URL) + String(import.meta.env.VITE_WS_CAMERA_DATA) + "2"
      );
      return camera2Socket;
    case 3:
      camera3Socket = new WebSocket(
        String(import.meta.env.VITE_BASE_WS_URL) + String(import.meta.env.VITE_WS_CAMERA_DATA) + "3"
      );
      return camera3Socket;
  }
}

export let resSocket: WebSocket;
function getResSocket() {
  resSocket = new WebSocket(
    String(import.meta.env.VITE_BASE_WS_URL) + String(import.meta.env.VITE_WS_RES_DATA)
  );
  return resSocket;
}

export function closeSockets() {
  if (camera1Socket && camera1Socket.readyState === camera1Socket.OPEN) camera1Socket.close();
  if (camera2Socket && camera2Socket.readyState === camera2Socket.OPEN) camera2Socket.close();
  if (camera3Socket && camera3Socket.readyState === camera3Socket.OPEN) camera3Socket.close();
  if (resSocket && resSocket.readyState === resSocket.OPEN) resSocket.close();
}

export let witsSocket: WebSocket;
function getWitsSocket() {
  witsSocket = new WebSocket(
    String(import.meta.env.VITE_BASE_WS_URL) + String(import.meta.env.VITE_WS_WITS_DATA)
  );
  return witsSocket;
}

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getReportMessages: builder.query<IReport[], number>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(id, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        const ws = getCameraSocket(id);
        if (!ws) return;

        let listener: any;
        try {
          await cacheDataLoaded;
          ws.onopen = (message: Event) => console.log("Ws open");
          ws.onerror = (err: Event) => console.error(err);
          ws.onclose = (message: CloseEvent) => {
            console.log("Ws closed");
            dispatch(stopJob(null));
          };
          listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log(data);
            updateCachedData((draft) => {
              draft.unshift(data);
              dispatch(jobSlice.actions.addCameraReports({ id: id, report: data }));
            });
          };
          ws.addEventListener("message", listener);
        } catch {}
        await cacheEntryRemoved;
        ws.removeEventListener("message", listener);
      },
    }),

    getResReportMessages: builder.query<IReport[], any>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        const ws = getResSocket();
        let listener: any;
        try {
          await cacheDataLoaded;
          ws.onopen = (message: Event) => console.log("Ws open");
          ws.onerror = (err: Event) => console.error(err);
          ws.onclose = (message: CloseEvent) => {
            console.log("Ws closed");
            dispatch(stopJob(null));
          };

          listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log(data);
            updateCachedData((draft) => {
              draft.unshift(data);
              dispatch(jobSlice.actions.addResReport(data));
            });
          };
          ws.addEventListener("message", listener);
        } catch {}
        await cacheEntryRemoved;
        ws.removeEventListener("message", listener);
      },
    }),

    getWitsMessages: builder.query<Array<string>, any>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        const ws = getWitsSocket();
        let listener: any = () => {};
        try {
          await cacheDataLoaded;
          ws.onopen = (message: Event) => {
            console.log("Ws open");
          };
          ws.onclose = (message: CloseEvent) => {
            console.log("Ws closed");
            dispatch(witsSlice.actions.setStream(false));
          };
          ws.onerror = (err: Event) => {
            console.error(err);
          };
          listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log(data);
            updateCachedData((draft) => {
              draft.unshift(JSON.stringify(data));
            });
          };
          ws.addEventListener("message", listener);
        } catch {}
        await cacheEntryRemoved;
        ws.removeEventListener("message", listener);
      },
    }),
  }),
});

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { IReport } from "../types/IReport";
import { jobSlice } from "../store/reducers/JobSlice";
import { witsSlice } from "../store/reducers/WitsSlice";
import { stopJob } from "../store/reducers/actions/ActionCreators";


export let jobSocket: WebSocket;

function getJobSocket() {
  jobSocket = new WebSocket(String(import.meta.env.VITE_WS_RESULT));
  return jobSocket;
}

export let witsSocket: WebSocket;

function getWitsSocket() {
  witsSocket = new WebSocket(String(import.meta.env.VITE_WS_WITS_DATA));
  return witsSocket;
}

export const reportApi = createApi({
  reducerPath: "reportApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({

    getReportMessages: builder.query<IReport[], any>({
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded( arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        const ws = getJobSocket();
        let listener: any = () => {}
        try {
          await cacheDataLoaded;
          ws.onopen = (message: Event) => {
            console.log("Ws open");
          };
          ws.onclose = (message: CloseEvent) => {
            console.log( "Ws closed" );
            dispatch(stopJob(null))
          };
          ws.onerror = (err: Event) => {
            console.error(err);
          };
          listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log(data);
            updateCachedData((draft) => {
              draft.unshift(data);
              dispatch(jobSlice.actions.addSavedReports(data))
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
      async onCacheEntryAdded( arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved, dispatch }) {
        const ws = getWitsSocket()
        let listener: any = () => {}
        try {
          await cacheDataLoaded;
          ws.onopen = (message: Event) => {
            console.log("Ws open")
          }
          ws.onclose = (message: CloseEvent) => {
            console.log( "Ws closed" );
            dispatch(witsSlice.actions.setStream(false));
          };
          ws.onerror = (err: Event) => {
            console.error(err);
          };
          listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            console.log(data);
            updateCachedData(draft => {
              draft.unshift(JSON.stringify(data))
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

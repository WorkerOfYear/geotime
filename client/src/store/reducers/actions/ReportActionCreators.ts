import axios from "axios";
import { AppDispatch } from "../../store";
import { IGetReportSettings, IReport, ISaveReportSettings } from "../../../types/IReport";

const GET_REPORT = String(import.meta.env.VITE_BASE_URL) + String(import.meta.env.VITE_GET_REPORT);

const SAVE_REPORT =
  String(import.meta.env.VITE_BASE_URL) + String(import.meta.env.VITE_SAVE_REPORT);

const GET_COUNT_PAGES =
  String(import.meta.env.VITE_BASE_URL) + String(import.meta.env.VITE_GET_COUNT_PAGES);

function DateReFormatter(oldFormat: string) {
    if (oldFormat) {
      let [date, time] = oldFormat.split("T")
      let [year, mounth, day] = date.split("-")
      return year + "." + mounth + "." + day + "," + time
    }
    return ""
}

export const getReport = (ReportSettings: IGetReportSettings) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.post<IReport[]>(GET_REPORT, {
        date_from: DateReFormatter(ReportSettings.date_from),
        date_to: DateReFormatter(ReportSettings.date_to),
        page: ReportSettings.page,
        limit: ReportSettings.limit
      });
      if (response.status === 200) {
        return response.data;
      } else {
        console.log(`getReport status code: ${response.status}`);
      }
    } catch (e) {
      console.log(e)
      alert("Ошибка при запросе к серверу, попробуйте снова");
    }
};


export const saveReport = (ReportSettings: ISaveReportSettings) => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.post(SAVE_REPORT, {
          date_from: DateReFormatter(ReportSettings.date_from),
          date_to: DateReFormatter(ReportSettings.date_to),
        }, {
          responseType: 'blob',
        });
        if (response.status === 200) {
        console.log(response.data)
        return response.data;
        } else {
        console.log(`saveReport status code: ${response.status}`);
        }
    } catch (e) {
        alert("Ошибка при запросе к серверу, попробуйте снова");
    }
};

interface IGetCountPagesResponse {
  count_pages: number
}

export const getCountPages = () => async (dispatch: AppDispatch) => {
    try {
        const response = await axios.get<IGetCountPagesResponse>(GET_COUNT_PAGES);
        if (response.status === 200) {
        return response.data;
        } else {
        console.log(`getCountPages status code: ${response.status}`);
        }
    } catch (e) {
        alert("Ошибка при запросе к серверу, попробуйте снова");
    }
};
  
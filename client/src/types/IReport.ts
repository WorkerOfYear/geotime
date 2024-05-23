export interface IReport {
  created_at?: string;

  time: string;
  depth: string;
  lag_depth: string;
  well_diam: string;
  cut_plan_volume: string;
  cut_plan_volume_with_out_well: string;
  cut_plan_volume_in_well: string;
  сut_fact_volume_delta_1: string;
  сut_fact_volume_delta_2: string;
  сut_fact_volume_delta_3: string;
  cut_fact_volume_1: string;
  cut_fact_volume_2: string;
  cut_fact_volume_3: string;
  cut_fact_volume: string;
  cleaning_factor: string;
}

export interface IReportFilters {
  from: string;
  to: string;
}

export interface IGetReportSettings {
  date_from: string;
  date_to: string;
  page: number;
  limit: number;
}

export interface ISaveReportSettings {
  date_from: string;
  date_to: string;
}

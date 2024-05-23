import os
import pandas as pd

from typing import List

column_order = [
    "created_at", "depth", "lag_depth", "well_diam", 
    "cut_plan_volume", "сut_fact_volume_delta_1",
    "сut_fact_volume_delta_2", "сut_fact_volume_delta_3",
    "cut_fact_volume_1", "cut_fact_volume_2", 
    "cut_fact_volume_3", "cut_fact_volume", 
    "cleaning_factor"
]
        
column_names = {
    "created_at": "Время",
    "depth": "Глубина, мм",
    "lag_depth": "Проходка, мм",
    "well_diam": "Диам.скв, мм",
    "cut_plan_volume": "Объём план, м3",
    "cut_plan_volume_with_out_well": "Расход факт, м3/с",
    "cut_fact_volume_1": "Объем факт, м3 (1)",
    "cut_fact_volume_2": "Объем факт, м3 (2)",
    "cut_fact_volume_3": "Объем факт, м3 (3)",
    "cut_fact_volume": "Объем факт, м3",
    "cleaning_factor": "Коэф-т очистки"
}


class Saver:
    @staticmethod
    def save_excel(report_data: List[dict]):
        df = pd.DataFrame(report_data)
        df = df[column_order]
        df.rename(columns=column_names, inplace=True)
        
        path = os.path.join(os.getcwd(), "static", "report.xlsx")
        df.to_excel(path, index=False)
        return path

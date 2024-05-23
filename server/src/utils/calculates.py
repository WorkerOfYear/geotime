import time

from datetime import datetime
from loguru import logger

from src.tasks import values


def predict_data(chunks1):
    if chunks1:
        time.sleep(0.3)
        return {
            "total_shlam_square": "13",
            "total_shlam_volume": "51",
            "average_speed": "34",
        }

def pow_by_exp(value: float, exp: int = -3):
    if value == 0.0:
        return value
    else: 
        return value * pow(10, exp)

def result_process_data(prev_data: dict, current_data: list) -> dict:
    wits_data = current_data[0]
    cameras_dict = current_data[1]

    if prev_data:
        prev_depth = prev_data["depth"]
        prev_lag_depth = prev_data["lag_depth"]
        prev_cut_plan_volume = pow_by_exp(float(prev_data["cut_plan_volume"]), exp=3)
        prev_cut_plan_volume_with_out_well = pow_by_exp(float(prev_data["cut_plan_volume_with_out_well"]), exp=3)
        prev_cut_fact_volume_dict = {}
        prev_cut_fact_volume_dict["cut_fact_volume_1"] = pow_by_exp(float(prev_data["cut_fact_volume_1"]), exp=3)
        prev_cut_fact_volume_dict["cut_fact_volume_2"] = pow_by_exp(float(prev_data["cut_fact_volume_2"]), exp=3)
        prev_cut_fact_volume_dict["cut_fact_volume_3"] = pow_by_exp(float(prev_data["cut_fact_volume_3"]), exp=3)
    else:
        prev_depth = 0
        prev_lag_depth = 0
        prev_cut_plan_volume = 0
        prev_cut_plan_volume_with_out_well = 0
        prev_cut_fact_volume_dict = {"cut_fact_volume_1": 0, "cut_fact_volume_2": 0, "cut_fact_volume_3": 0}

    depth = wits_data["depth"]  # Глубина забоя текущая, мм
    lag_depth = wits_data["lag_depth"]  # Глубина выхода шлама, мм
    well_diam = wits_data["well_diam"]  # Диаметр скважины, мм

    cut_plan_volume = values.CutPlanVolume.process_value(
        cpv0=prev_cut_plan_volume, wd=well_diam, d0=prev_depth, d1=depth
    )
    cut_plan_volume_delta = values.CutPlanVolumeDelta.process_value(
        wd=well_diam, ld0=prev_lag_depth, ld1=lag_depth
    )
    cut_plan_volume_with_out_well = values.CutPlanVolumeWithOutWell.process_value(
        cpvwow0=prev_cut_plan_volume_with_out_well, cpvd=cut_plan_volume_delta
    )
    cut_plan_volume_in_well = values.CutPlanVolumeInWell.process_value(
        cpv=cut_plan_volume, cpvwow=cut_plan_volume_with_out_well
    )

    if "camera1" in cameras_dict:
        сut_fact_volume_delta_1 = pow(cameras_dict["camera1"]["total_shlam_volume"], 3)  # cm^3 -> mm^3
        cut_fact_volume_1 = values.CutFactVolume.process_value(
            cfv0=prev_cut_fact_volume_dict["cut_fact_volume_1"],
            cfvd=сut_fact_volume_delta_1
        )
    else:
        cut_fact_volume_1 = 0
        сut_fact_volume_delta_1 = 0

    if "camera2" in cameras_dict:
        сut_fact_volume_delta_2 = pow(cameras_dict["camera2"]["total_shlam_volume"], 3)  # cm^3 -> mm^3
        cut_fact_volume_2 = values.CutFactVolume.process_value(
            cfv0=prev_cut_fact_volume_dict["cut_fact_volume_2"],
            cfvd=сut_fact_volume_delta_2
        )
    else:
        cut_fact_volume_2 = 0
        сut_fact_volume_delta_2 = 0

    if "camera3" in cameras_dict:
        сut_fact_volume_delta_3 = pow(cameras_dict["camera3"]["total_shlam_volume"], 3)  # cm^3 -> mm^3
        cut_fact_volume_3 = values.CutFactVolume.process_value(
            cfv0=prev_cut_fact_volume_dict["cut_fact_volume_3"],
            cfvd=сut_fact_volume_delta_3  # cm^3 -> mm^3
        )
    else:
        cut_fact_volume_3 = 0
        сut_fact_volume_delta_3 = 0

    cut_fact_volume_sum = cut_fact_volume_1 + cut_fact_volume_2 + cut_fact_volume_3
    cleaning_factor = values.CleaningFactor.process_value(
        cpv=cut_plan_volume, cfvs=cut_fact_volume_sum
    )

    res = {
        "time": str(datetime.now()),
        "depth": round(float(depth), 2),
        "lag_depth": round(float(lag_depth), 2),
        "well_diam": round(float(well_diam), 2),
        # "cut_plan_volume": round(float(pow_by_exp(cut_plan_volume)) - float(pow_by_exp(cut_plan_volume_in_well)), 2),
        "cut_plan_volume": round(float(pow_by_exp(cut_plan_volume))),
        "cut_plan_volume_with_out_well": round(float(pow_by_exp(cut_plan_volume_with_out_well)), 2),
        "cut_plan_volume_in_well": round(float(pow_by_exp(cut_plan_volume_in_well)), 2),
        "сut_fact_volume_delta_1": round(float(pow_by_exp(сut_fact_volume_delta_1)), 2),
        "сut_fact_volume_delta_2": round(float(pow_by_exp(сut_fact_volume_delta_2)), 2),
        "сut_fact_volume_delta_3": round(float(pow_by_exp(сut_fact_volume_delta_3)), 2),
        "cut_fact_volume_1": round(float(pow_by_exp(cut_fact_volume_1)), 2),
        "cut_fact_volume_2": round(float(pow_by_exp(cut_fact_volume_2)), 2),
        "cut_fact_volume_3": round(float(pow_by_exp(cut_fact_volume_3)), 2),
        "cut_fact_volume": round(float(pow_by_exp(cut_fact_volume_sum)), 2),
        "cleaning_factor": round(float(cleaning_factor), 5),
    }
    return res

# if __name__ == "__main__":
#     current_data = [
#         {
#             "depth": "41",
#             "lag_depth": "131",
#             "well_diam": "41",
#         },
#         {
#             "camera1": {
#                 "total_shlam_square": "13",
#                 "total_shlam_volume": "51",
#                 "average_speed": "34",
#             },
#             "camera2": {
#                 "total_shlam_square": "13241",
#                 "total_shlam_volume": "5143",
#                 "average_speed": "1341",
#             },
#             "camera3": {
#                 "total_shlam_square": "13241",
#                 "total_shlam_volume": "5143",
#                 "average_speed": "1341",
#             }
#         },
#     ]
#
#     prev_data = None
#     while True:
#         res = result_process_data(prev_data, current_data)
#         logger.info(res)
#         prev_data = res
#         time.sleep(1)

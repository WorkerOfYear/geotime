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


def result_process_data(prev_data: dict, current_data: list) -> dict:
    wits_data = current_data[0]
    cameras_dict = current_data[1]
    
    cameras = []
    if "camera1" in cameras_dict:
        camera1_data = cameras_dict["camera1"]
        cameras.append(camera1_data)

    if "camera2" in cameras_dict:
        camera2_data = cameras_dict["camera2"]
        cameras.append(camera2_data)

    if "camera3" in cameras_dict:
        camera3_data = cameras_dict["camera3"]
        cameras.append(camera3_data)
    
    n_cameras = len(cameras)

    if prev_data:
        prev_depth = prev_data["depth"]
        prev_lag_depth = prev_data["lag_depth"]
        prev_cut_plan_volume = prev_data["cut_plan_volume"]
        prev_cut_plan_volume_with_out_well = prev_data["cut_plan_volume_with_out_well"]

        prev_cut_fact_volume_list = []
        prev_cut_fact_volume_list.append(prev_data["cut_fact_volume_1"])
        prev_cut_fact_volume_list.append(prev_data["cut_fact_volume_2"])
        prev_cut_fact_volume_list.append(prev_data["cut_fact_volume_3"])

    else:
        prev_depth = 0
        prev_lag_depth = 0
        prev_cut_plan_volume = 0
        prev_cut_plan_volume_with_out_well = 0
        prev_cut_fact_volume_list = [0, 0, 0]

    depth = wits_data["depth"]  # Глубина забоя текущая, м
    lag_depth = wits_data["lag_depth"]  # Глубина выхода шлама, м
    well_diam = wits_data["well_diam"]  # Диаметр скважины, м

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

    total_shlam_volume_list = []
    cut_fact_volume_list = []
    for i in range(n_cameras):
        average_speed = cameras[i]["average_speed"]
        total_shlam_square = cameras[i]["total_shlam_square"]

        total_shlam_volume = cameras[i]["total_shlam_volume"]
        total_shlam_volume_list.append(float(total_shlam_volume))

        prev_cut_fact_volume = prev_cut_fact_volume_list[i]
        cut_fact_volume = values.CutFactVolume.process_value(
            cfv0=prev_cut_fact_volume, cfvd=total_shlam_volume
        )
        cut_fact_volume_list.append(float(cut_fact_volume))

    cut_fact_volume_delta_sum = sum(total_shlam_volume_list)
    cut_fact_volume_sum = sum(cut_fact_volume_list)

    cleaning_factor = values.CleaningFactor.process_value(
        cpv=cut_plan_volume, cfvs=cut_fact_volume_sum
    )

    if n_cameras == 1:
        cut_fact_volume_1 = cut_fact_volume_list[0]
        cut_fact_volume_2 = 0
        cut_fact_volume_3 = 0
    elif n_cameras == 2:
        cut_fact_volume_1 = cut_fact_volume_list[0]
        cut_fact_volume_2 = cut_fact_volume_list[1]
        cut_fact_volume_3 = 0
    elif n_cameras == 3:
        cut_fact_volume_1 = cut_fact_volume_list[0]
        cut_fact_volume_2 = cut_fact_volume_list[1]
        cut_fact_volume_3 = cut_fact_volume_list[2]
    else:
        cut_fact_volume_1 = 0
        cut_fact_volume_2 = 0
        cut_fact_volume_3 = 0
        
    res = {
        "time": str(datetime.now()),
        "depth": round(float(depth), 2),
        "cut_plan_volume": round(float(cut_plan_volume), 2),
        "lag_depth": round(float(lag_depth), 2),
        "cut_plan_volume_with_out_well": round(float(cut_plan_volume_with_out_well), 2),
        "cut_plan_volume_in_well": round(float(cut_plan_volume_in_well), 2),
        "cut_fact_volume_1": round(float(cut_fact_volume_1), 2),
        "cut_fact_volume_2": round(float(cut_fact_volume_2), 2),
        "cut_fact_volume_3": round(float(cut_fact_volume_3), 2),
        "cut_fact_volume": round(float(cut_fact_volume), 2),
        "cleaning_factor": round(float(cleaning_factor), 5),
    }

    return res


if __name__ == "__main__":
    current_data = [
        {
            "depth": "41",
            "lag_depth": "131",
            "well_diam": "41",
        },
        {
            "camera1": {
                "total_shlam_square": "13",
                "total_shlam_volume": "51",
                "average_speed": "34",
            },
            "camera2": {
                "total_shlam_square": "13241",
                "total_shlam_volume": "5143",
                "average_speed": "1341",
            },
            "camera3": {
                "total_shlam_square": "13241",
                "total_shlam_volume": "5143",
                "average_speed": "1341",
            }
        },
    ]

    prev_data = None
    while True:
        res = result_process_data(prev_data, current_data)
        logger.info(res)
        prev_data = res
        time.sleep(1)

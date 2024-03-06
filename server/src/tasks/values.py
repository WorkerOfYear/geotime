import math


class Depth:
    """Глубина забоя текущая, м (d)"""

    def __init__(self, value=None):
        self.value = value


class LagDepth:
    """Глубина выхода шлама, м (ld)"""

    def __init__(self, value=None):
        self.value = value


class WellDiam:
    """Диаметр скважины, м (wd)"""

    def __init__(self, value=None):
        self.value = value


class CutPlanVolume:
    """Общий плановый объем выбуренного шлама с учетом шлама в скважине, м3 (cpv)"""

    def __init__(self, value=None):
        self.value = value

    @staticmethod
    def process_value(cpv0, wd, d0, d1) -> float:
        cpv1 = float(cpv0) + math.pi * pow(float(wd), 2) / 4 * (float(d1) - float(d0))

        if cpv1 < 0:
            return 0
        return float(cpv1)


class CutPlanVolumeDelta:
    """Плановый объем шлама на поверхности от предыдущей записи, м3 (cpvd)"""

    def __init__(self, value=None):
        self.value = value

    @staticmethod
    def process_value(wd, ld0, ld1) -> float:
        cpvd = math.pi * pow(float(wd), 2) / 4 * (float(ld1) - float(ld0))

        if cpvd < 0:
            return 0
        return float(cpvd)


class CutPlanVolumeWithOutWell:
    """Общий плановый объем выбуренного шлама на поверхности, м3 (cpvwow)"""

    def __init__(self, value=None):
        self.value = value

    @staticmethod
    def process_value(cpvwow0, cpvd) -> float:
        cpvwow1 = float(cpvwow0) + float(cpvd)
        return cpvwow1


class CutPlanVolumeInWell:
    """Плановый объем выбуренного шлама в скважине, м3 (cpviw)"""

    def __init__(self, value=None):
        self.value = value

    @staticmethod
    def process_value(cpv, cpvwow) -> float:
        cpviw = float(cpv) - float(cpvwow)
        return cpviw


class LagSpeed:
    "Скорость движения шлама в зоне, м/с (ls)"

    def __init__(self, value=None):
        self.value = value


class CutFuctAreaDelta:
    "Площадь шлама в зоне, м2 (cfad)"

    def __init__(self, value=None):
        self.value = value


class CutFactVolumeDelta:
    """Фактический объем шлама который появился на
    поверхности от предыдущей записи, м3 (cfvd)"""

    def __init__(self, value=None):
        self.value = value


class CutFactVolume:
    """Общий фактический объем выбуренного шлама который вышел на поверхность, м3 (cfv)"""

    def __init__(self, value=None):
        self.value = value

    @staticmethod
    def process_value(cfv0, cfvd) -> float:
        cfv1 = float(cfv0) + float(cfvd)
        return cfv1


class CutFactVolumeDeltaLSum:
    """СУММАРНЫЙ ПО ВСЕМ ВИБРОСИТАМ Фактический объем шлама
    который появился на поверхности от предыдущей записи, м3 (cfvds)"""

    def __init__(self, value=None):
        self.value = value


class CutFactVolumeSum:
    """СУММАРНЫЙ ПО ВСЕМ ВИБРОСИТАМ Общий фактический объем
    выбуренного шлама который вышел на поверхность, м3 (cfvs)"""

    def __init__(self, value=None):
        self.value = value


class CleaningFactor:
    """Коэффициент очистки ствола скважины (cf)"""

    def __init__(self, value=None):
        self.value = value

    @staticmethod
    def process_value(cpv, cfvs) -> float:
        if float(cpv) == 0:
            return 0
        return float(cfvs) / float(cpv)


calc_lits_values = [
    CutPlanVolume,
    CutPlanVolumeDelta,
    CutFactVolumeDeltaLSum,
    CutFactVolumeSum,
    CleaningFactor,
]

wits_lits_values = [
    Depth,
    LagDepth,
    WellDiam,
]

camera_list_values = [
    LagSpeed,
    CutFuctAreaDelta,
    CutFactVolume,
]

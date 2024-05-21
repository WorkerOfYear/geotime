import os
import pandas as pd

from typing import List


class Saver:
    @staticmethod
    def save_excel(report_data: List[dict]):
        df = pd.DataFrame(report_data)
        # path = os.path.join(os.getcwd(), "src", "static", "report.xlsx")
        path = os.path.join(os.getcwd(), "static", "report.xlsx")
        df.to_excel(path, index=False)
        return path

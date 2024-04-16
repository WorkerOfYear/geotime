import React from "react";
import Item from "../Item";
import { IDetection } from "../../types/ICamera";

type Props = {
  factValue: {
    value: string;
    setValue: (value: string) => void;
  };
  sensity: {
    value: string;
    setValue: (value: string) => void;
  };
  detection: IDetection | null;
};

const Params = ({ factValue, sensity, detection }: Props) => {
  return (
    <>
      <div className="product__col">
        <div className="product__info">
          <span>Фактический объем, л</span>
          <Item
            type="number"
            placeholder={"0.00"}
            value={factValue.value}
            onChange={(e) => factValue.setValue(e.currentTarget.value)}
          />
        </div>
        <div className="product__info">
          <span>Чувствительность</span>
          <Item
            type="number"
            placeholder={"0.00"}
            value={sensity.value}
            onChange={(e) => sensity.setValue(e.currentTarget.value)}
          />
        </div>
        <div className="product__info product__info--bg">
          <span>
            Окно <br /> детектирования:
          </span>
          <div className="product__info-wrapper">
            <div className="product__info-details">
              A
              <Item placeholder={"0"} label={"Координата Х"} value={detection ? detection.A.x : ""} readOnly={true} />
              <Item placeholder={"0"} label={"Координата Y"} value={detection ? detection.A.y : ""} readOnly={true} />
            </div>
            <div className="product__info-details">
              B
              <Item placeholder={"0"} label={"Координата Х"} value={detection ? detection.B.x : ""} readOnly={true} />
              <Item placeholder={"0"} label={"Координата Y"} value={detection ? detection.B.y : ""} readOnly={true} />
            </div>
            <div className="product__info-details">
              C
              <Item placeholder={"0"} label={"Координата Х"} value={detection ? detection.C.x : ""} readOnly={true} />
              <Item placeholder={"0"} label={"Координата Y"} value={detection ? detection.C.y : ""} readOnly={true} />
            </div>
            <div className="product__info-details">
              D
              <Item placeholder={"0"} label={"Координата Х"} value={detection ? detection.D.x : ""} readOnly={true} />
              <Item placeholder={"0"} label={"Координата Y"} value={detection ? detection.D.y : ""} readOnly={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Params;

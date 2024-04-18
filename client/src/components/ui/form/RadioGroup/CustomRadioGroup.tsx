import React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";

import styles from "./CustomRadioGroup.module.scss";

type Props = {
  value: string;
  handleChange: (value: string) => void;
};

function CustomRadioGroup({ value, handleChange }: Props) {
  return (
    <>
      <form>
        <RadioGroup.Root
          className={styles.RadioGroupRoot}
          value={value}
          onValueChange={handleChange}
          aria-label="View density"
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <RadioGroup.Item className={styles.RadioGroupItem} value="default" id="r1">
              <RadioGroup.Indicator className={styles.RadioGroupIndicator} />
            </RadioGroup.Item>
            <label className={styles.Label} htmlFor="r1">
              Cтадартно
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <RadioGroup.Item className={styles.RadioGroupItem} value="sesivity" id="r2">
              <RadioGroup.Indicator className={styles.RadioGroupIndicator} />
            </RadioGroup.Item>
            <label className={styles.Label} htmlFor="r2">
              Чувствительно
            </label>
          </div>
        </RadioGroup.Root>
      </form>
    </>
  );
}

export default CustomRadioGroup;

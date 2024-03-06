import React, { useEffect } from "react";
import ButtonAccent from "../ButtonAccent";
import Button from "../Button";

interface Props {
  onClickStart: any;
  onClickStop: any;
}

const JobProductButtons: React.FC<Props> = ({onClickStart, onClickStop}) => {
  return (
    <>
      <ButtonAccent onClick={onClickStart} title={"Старт"} />
      <Button onClick={onClickStop} title={"Стоп"} />
    </>
  );
};

export default JobProductButtons;

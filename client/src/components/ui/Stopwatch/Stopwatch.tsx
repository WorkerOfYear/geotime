import React, { useEffect, useState } from "react";

type Props = {
  start: boolean;
};

const Stopwatch = ({ start }: Props) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!start) return;

    const tick = (num: number) => setSeconds(seconds + num);
    const interval = setInterval(() => tick(1), 1000);

    const cleanup = () => {
      clearInterval(interval);
    };
    return cleanup;
  });

  useEffect(() => {
    if (start) {
      setSeconds(0);
    }
  }, [start]);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
        Время калибровки: <strong>{seconds}</strong> секунд(а/ы)
      </div>
    </>
  );
};

export default Stopwatch;

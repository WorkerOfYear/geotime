import React, { useEffect, useState } from "react";
import { Circle, Line, Text } from "react-konva";
import { Portal } from "react-konva-utils";
import { IDetection } from "../../types/ICamera";

interface Props {
  onPointsChange: (points: IDetection) => void;
}

const DetectionAreaSpawner = ({ onPointsChange }: Props) => {
  const [points, setPoints] = useState([
    [20, 20],
    [20, 210],
    [432, 210],
    [432, 20],
  ]);

  useEffect(() => {
    onPointsChange({
      A: { x: String(Math.round(points[0][0])), y: String(Math.round(points[0][1])) },
      B: { x: String(Math.round(points[1][0])), y: String(Math.round(points[1][1])) },
      C: { x: String(Math.round(points[2][0])), y: String(Math.round(points[2][1])) },
      D: { x: String(Math.round(points[3][0])), y: String(Math.round(points[3][1])) },
    });
  }, [points]);

  const [pointsLetters, setPointsLetters] = useState([
    {
      letter: "A",
      offsetX: 15,
      offsetY: 15,
    },
    {
      letter: "B",
      offsetX: 15,
      offsetY: -5,
    },
    {
      letter: "C",
      offsetX: -5,
      offsetY: -5,
    },
    {
      letter: "D",
      offsetX: -5,
      offsetY: 15,
    },
  ]);

  const handlePointMouseOver = (event: any) => {
    const stage = (event.target.getStage().container().style.cursor = "move");
  };

  const handlePointMouseOut = (event: any) => {
    event.target.getStage().container().style.cursor = "default";
  };

  const handlePointDragMove = (event: any, index: number) => {
    const pos = [event.target._lastPos.x, event.target._lastPos.y];
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  return (
    <>
      <Line
        strokeWidth={3}
        stroke="yellow"
        lineJoin="round"
        fill="transparent"
        closed={true}
        points={points.flatMap((point) => [point[0], point[1]])}
      />
      {points.map((point, index) => {
        return (
          <Portal key={index} selector=".top-layer">
            <Circle
              x={point[0]}
              y={point[1]}
              radius={6}
              fill="transparent"
              stroke="dodgerblue"
              strokeWidth={2}
              draggable
              onDragMove={(event) => handlePointDragMove(event, index)}
              onMouseOver={(event) => handlePointMouseOver(event)}
              onMouseOut={(event) => handlePointMouseOut(event)}
              dragBoundFunc={(pos) => {
                let x = pos.x;
                let y = pos.y;
                if (x > 452) {
                  x = 452;
                }
                if (x < 0) {
                  x = 0;
                }
                if (y > 230) {
                  y = 230;
                }
                if (y < 0) {
                  y = 0;
                }
                return { x, y };
              }}
            />
          </Portal>
        );
      })}

      {pointsLetters.map((pointLetter, index) => {
        return (
          <Text
            key={index}
            x={points[index][0]}
            y={points[index][1]}
            text={pointLetter.letter}
            stroke="yellow"
            offsetX={pointLetter.offsetX}
            offsetY={pointLetter.offsetY}
            fontSize={15}
          />
        );
      })}
    </>
  );
};

export default DetectionAreaSpawner;

import React, { useContext } from "react";
import { StateContext } from "../utils/StateContext";
import { Scatter } from "react-chartjs-2";
// import { AlarmOn } from "@material-ui/icons";
// import Icon from "@material-ui/core/Icon";

const options = {
  responsive: true,
  tooltips: {
    mode: "label"
  },
  elements: {
    line: {
      fill: false
    }
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ],
    yAxes: [
      {
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis",
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }
    ]
  }
};

export default function GameActionsChart({ deltas, actions }) {
  const [state] = useContext(StateContext);

  const dataOptions = team => {
    const isFire = team === "Fire";
    const isIce = team === "Ice";
    const isGreen = team === "Green";
    const isPlayerTeam = isFire || isIce || isGreen;

    const color = isFire
      ? state.redTeamColor
      : isIce
      ? state.blueTeamColor
      : isGreen
      ? state.greenTeamColor
      : state.nukeColor;
    return {
      fill: false,
      showLine: isPlayerTeam,
      pointRadius: 1,
      borderColor: color,
      backgroundColor: null,
      pointBorderColor: color,
      pointBackgroundColor: color,
      pointHoverBackgroundColor: color,
      pointHoverBorderColor: color
    };
  };

  // const nukeIcon = <Icon>star</Icon>;
  // const nukeImage = new Image();
  // nukeImage.src = AlarmOn;

  const deltasFire = deltas.filter(delta => delta.color_desc === "Fire");
  const deltasIce = deltas.filter(delta => delta.color_desc === "Ice");

  const ticks = new Array(15);

  const nukes = actions.filter(action => action.action_type === "0405");

  return (
    <Scatter
      data={{
        labels: ticks.map((_, index) => index),
        datasets: [
          {
            ...dataOptions("Fire"),
            label: "Fire Team",
            data: deltasFire.map(delta => ({
              x: delta.score_time,
              y: delta.sum
            }))
          },
          {
            ...dataOptions("Ice"),
            label: "Ice Team",
            data: deltasIce.map(delta => ({
              x: delta.score_time,
              y: delta.sum
            }))
          },
          {
            ...dataOptions(),
            label: "Nukes",
            data: nukes.map(action => ({
              x: action.action_time,
              y: 100
            })),
            pointRadius: 5,
            pointStyle: ["cross"]
          }
        ]
      }}
      options={options}
    />
  );
}

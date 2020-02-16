import React, { useContext, FC } from "react";
import { StateContext } from "../utils/StateContext";
import { Scatter } from "react-chartjs-2";
import { Delta, Action } from "../interfaces";

interface Props {
  deltas: Delta[]
  actions: Action[]
}

const GameActionsChart: FC<Props> = ({ deltas, actions }) => {
  const [state] = useContext(StateContext);

  const dataOptions = (team: string) => {
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

  const deltasFire = deltas.filter(delta => delta.color_desc === "Fire");
  const deltasIce = deltas.filter(delta => delta.color_desc === "Ice");

  // const ticks = new Array(15).map((_, index) => index * 1000 * 60);

  const nukes = actions.filter(action => action.action_type === "0405");
  // 1. P1 activates nuke. Mark time start.
  // 2. P1 does not detonate nuke. Mark time end.
  // 3. Find any deacs in that time gap
  const activates = actions.filter(action => action.action_type === "0404")
  const cancels = activates.filter(activation => {
    
    const startTime = activation.action_time
    const maxEndTime = startTime + 1000 * 8
    const relevantActions = actions.filter(action => 
      action.action_time > startTime 
      && action.action_time < maxEndTime 
      )

    const detonationWithinTime = relevantActions.filter(action => 
      action.action_type === "0405" 
      && action.game_team.color_desc === activation.game_team.color_desc)

      // if no matching detonation exists, then this must've been a cancel
    const isCancel = detonationWithinTime.length === 0

    if(isCancel){
      // see if we can determine the cancel reason
      const attacksOnNuker = relevantActions.filter(action => (
        // friendly/enemy resupplied/shot/missiled nuker?
        action.target_id === activation.player_id || 
        // enemy nuke dropped first?
        (action.action_type === "0405" && action.game_team.color_desc !== activation.game_team.color_desc))
        )
      
      console.log(`Found cancel against ${activation.playerByPlayerId.player_name} at time ${activation.action_time}: `, activation, 
      `\n Identified ${attacksOnNuker.length} possible cancel causes: `, attacksOnNuker)
    }

    return isCancel
  })

  console.log(`Detected nukes`, nukes)
  cancels.length && console.log(`DETECTED CANCEL(S): `, cancels)

  return (
    <Scatter
      data={{
        // labels: ticks,
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
            ...dataOptions(''),
            label: "Nukes",
            data: nukes.map(action => ({
              x: action.action_time,
              y: 100
            })),
            pointRadius: 5,
            pointStyle: nukes.map(() => "cross")
          }
        ]
      }}
      options={{
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
              },
              // type: 'time'
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
      }}
    />
  );
}

export default GameActionsChart
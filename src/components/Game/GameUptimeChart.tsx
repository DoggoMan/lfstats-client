import React, { useContext, FC, useCallback } from "react";
import { StateContext } from "../../utils/StateContext";
import { Scatter } from "react-chartjs-2";
import { Action, Scorecard, GameDetails } from "../../interfaces";
import { msToTime } from "../../helpers";
// import { Player } from "./Game";

interface ActiveStatusChange {
  team: string
  change: 'activate' | 'deactivate'
  players: number[]
  time: number
}

interface FullActiveStatusChange extends ActiveStatusChange {
  activeCount: number
}

interface TeamKey<T> {
  [team: string]: T;
}

interface Props {
  gameDetails: GameDetails;
  actions: Action[];
  scorecards: Scorecard[];
}

const GameActionsChart: FC<Props> = ({ gameDetails, actions, scorecards }) => {
  const [state] = useContext(StateContext);

  const teams = actions.reduce<TeamKey<number[]>>((tempTeams, action) => {
    const actionColour = action.game_team?.color_desc 
    if(actionColour && !tempTeams[actionColour]) tempTeams[actionColour] = scorecards.filter(card => card.game_team?.color_desc === actionColour).map(card => card.player.id)
  return tempTeams}, {})


  console.log({teams})

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

  // const redPlayers = scorecards.filter(scorecard => scorecard.team === "red").map(card => card.player.id)
  // const greenPlayers = scorecards.filter(scorecard => scorecard.team === "green").map(card => card.player.id)

  const getDeactivates = useCallback((actions: Action[]): TeamKey<ActiveStatusChange[]> => {
    return Object.keys(teams).reduce((deacsByTeam, team) => {

      const friendlyPlayers = teams[team]
      const enemyPlayers = scorecards.filter(card => card.game_team?.color_desc !== team).map(card => card.player.id)

      console.log({team, "PLAYERS": {friendlyPlayers, enemyPlayers}})

      const deacs = actions.map((action) => {    
        const friendlyTargeted = friendlyPlayers.includes(action.target_id) 
    
        const shot = friendlyTargeted && action.action_type === "0206"
        const missiled = friendlyTargeted && action.action_type === "0306"
        const nuked = enemyPlayers.includes(action.player_id) && action.action_type === "0405"
        const resupplied = friendlyTargeted && ( action.action_type === "0500" || action.action_type === "0502")
        const penalised = friendlyTargeted && action.action_type === "0600"
    
        const isDeac = shot || missiled || nuked || resupplied || penalised
    
        if(isDeac ){
          // console.log({"DEAC": action, "reason": {shot, missiled, nuked, resupplied, penalised}})

          const deactivated: ActiveStatusChange = nuked 
          // when a nuke drops, everyone on our team gets deactivated
          ? {team: team,
            change: 'deactivate', time: action.action_time, players: friendlyPlayers}
          // any other deac event, just one player gets deactivated
          : {team: team, 
          change: 'deactivate', time: action.action_time, players: [action.target_id]}
          return deactivated
        }

        return null
      })
      
      return {...deacsByTeam, [team]: deacs
        .filter(Boolean) as ActiveStatusChange[]
      }
    }, {})
  }
    , [scorecards, teams]
  )

  const getActivates = useCallback((deactivates: TeamKey<ActiveStatusChange[]>): TeamKey<ActiveStatusChange[]> => {
    return Object.keys(teams).reduce((activatesByTeam, team) => {
      const friendlyPlayers = scorecards.filter(card => card.game_team?.color_desc === team).map(card => card.player.id)

      const activates: ActiveStatusChange[] = [{
        team,
        time: 0,
        players: friendlyPlayers,
        change: 'activate'
      }]
      
        const deacs = deactivates[team]
        
        deacs.forEach((deac) => {
          const {players,time} = deac
          const reactivateTime = time + 8 * 1000
          const reactivates = players.filter(player => {
            const otherDeacs = deacs.filter(d => d.time < reactivateTime && d.time > time 
            && d.players.includes(player))
            return otherDeacs.length === 0
        })
        
        if(reactivates.length){
          // some players successfully reactivated
          activates.push({team, change: 'activate', time: reactivateTime, players: reactivates})
        }
      })
    
    return {...activatesByTeam, [team]: activates}
  }, {})
  }, [scorecards, teams])
 
  const getActiveChanges = useCallback((
    deactivates: TeamKey<ActiveStatusChange[]>, 
    activates: TeamKey<ActiveStatusChange[]>
    ):TeamKey<FullActiveStatusChange[]> => Object.keys(teams)
    .reduce((teamChanges, team ) => {
    let currentCount = 0
    const allChanges = [...deactivates[team], ...activates[team]].sort((a,b) => a.time - b.time)

    
    const changes = allChanges.map(change => {
      const isActivation = change.change === "activate"
      if(isActivation){
        return {
          ...change,
          activeCount: currentCount += change.players.length
        }
      }else{

        const actualDeacs = change.players.filter(player => {
          const alreadyDeactivated = allChanges.some(
            subchange => subchange.time < change.time && subchange.time > change.time - 8 * 1000 
            && subchange.players.includes(player) && subchange.change === 'deactivate'
          )
          return !alreadyDeactivated
        })
        return {
          ...change,
          activeCount: currentCount -= actualDeacs.length 
        }}
      }
      )

    return {...teamChanges, [team]: changes}
  }, {})
  , [teams])

  const getPlayerUptimeStat = useCallback((
    deactivates: TeamKey<ActiveStatusChange[]>, 
    activates: TeamKey<ActiveStatusChange[]>
    ) => {
      return Object.keys(teams).reduce((data, team) => {
        const players = teams[team]

        const uptimes = players.map(player => {
          const fullPlayerCard = scorecards.find(card => card.player.id === player)
          const playerDeacs = deactivates[team].filter(deac => deac.players.includes(player))
          const playerActs = activates[team].filter(act => act.players.includes(player))

          let playerUptime = 0
          playerActs.map(activation => {
            const nextDeac = playerDeacs.find(deac => deac.time > activation.time)
            if(nextDeac){
              return playerUptime += nextDeac.time - activation.time
            }else{
              // no more deacs? player was up until the end of the game end or was eliminated.
              if(!fullPlayerCard){
                throw new Error(`No player card for player ${player}`)
              }
              return playerUptime += fullPlayerCard.survived * 1000 - activation.time
            }
          })

          return ({
            name: player,
            uptime: playerUptime,
            uptimepc: ((playerUptime / (gameDetails.game_length * 1000)) * 100).toFixed(2)
          })
        })

        return {...data, [team]: uptimes}
      }, {})
  }, [gameDetails, scorecards, teams])

  const deactivates = getDeactivates(actions)
  const activates = getActivates(deactivates)
  console.log({deactivates, activates})

  const activeStatusChanges = getActiveChanges(deactivates,activates) 
  console.log({activeStatusChanges})

  const playerUptime = getPlayerUptimeStat(deactivates,activates)
  console.log({playerUptime})
  


  // const redStatusChanges: FullActiveStatusChange[] = [...redDeactivates, ...redActivates].sort((a,b) => a.time - b.time).map(change => ({
  //   ...change,
  //   activeCount: change.change === 'activate' ? currentCount += change.players.length : currentCount -= change.players.length 
  // }))
  // currentCount = 0
  // const greenStatusChanges: FullActiveStatusChange[] = [...greenDeactivates, ...greenActivates].sort((a,b) => a.time - b.time).map(change => ({
  //   ...change,
  //   activeCount: change.change === 'activate' ? currentCount += change.players.length : currentCount -= change.players.length 
  // }))

  // const activates = getTeamActivates(deactivates, teams)
  // const redDeactivates = getTeamDeactivates(actions, true)
  // const redActivates = getTeamActivates(redDeactivates, true)
  // const greenDeactivates = getTeamDeactivates(actions, false)
  // const greenActivates = getTeamActivates(greenDeactivates, false)

  // console.log({redDeactivates, redActivates})


  // console.log({redStatusChanges, greenStatusChanges})

  return (
    <Scatter
      data={{
        datasets: Object.keys(teams).map(team => ({
          ...dataOptions(team),
          label: `${team} Team`,
          data: activeStatusChanges[team].map(change => ({
            x: change.time,
            y: change.activeCount
          }))
        }))
        // [
          // {
          //   ...dataOptions("Fire"),
          //   label: "Fire Team",
          //   data: redStatusChanges
          //     .map((change) => ({
          //       x: change.time,
          //       y: change.activeCount
          //     }))
          // },
          // {
          //   ...dataOptions("Ice"),
          //   label: "Ice Team",
          //   data: greenStatusChanges
          //     .map((change) => ({
          //       x: change.time,
          //       y: change.activeCount
          //     }))
          // }
        // ]
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
              ticks: {
                callback: function(value: any, index: any, values: any) {
                  return msToTime(value, "seconds");
                }
              },
              labels: {
                show: true
              }
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
};

export default GameActionsChart;

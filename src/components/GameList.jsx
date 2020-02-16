import React, { useContext } from "react";
import { StateContext } from "../utils/StateContext";
import EuiCustomLink from "./EuiCustomLink";
import moment from "moment";
import { EuiInMemoryTable } from "@elastic/eui";

export default data => {
  const [state] = useContext(StateContext);

  const columns = [
    {
      field: "game_name",
      name: "Game",
      sortable: true,
      render: (game_name, item) => (
        <EuiCustomLink to={`/games/${item.id}`}>{game_name}</EuiCustomLink>
      )
    },
    {
      field: "game_datetime",
      name: "Time",
      sortable: true,
      render: (game_datetime, item) => {
        console.log(moment(game_datetime));
        return moment.utc(game_datetime).format("YYYY-MM-DD HH:mm");
      }
    },
    {
      field: "winner",
      name: "Winner Score",
      sortable: true,
      render: (winner, item) => {
        let score = 0;
        let teamColor = state.redTeamColor;
        if (item.winner === "red") {
          score = item.red_adj + item.red_score;
        } else {
          score = item.green_adj + item.green_score;
          teamColor = state.greenTeamColor;
        }

        return <span style={{ color: teamColor }}>{score}</span>;
      }
    },
    {
      field: "loser",
      name: "Loser Score",
      sortable: true,
      render: (loser, item) => {
        let score = 0;
        let teamColor = state.redTeamColor;
        if (item.winner !== "red") {
          score = item.red_adj + item.red_score;
        } else {
          score = item.green_adj + item.green_score;
          teamColor = state.greenTeamColor;
        }

        return <span style={{ color: teamColor }}>{score}</span>;
      }
    }
  ];

  const sorting = {
    sort: {
      field: "game_datetime",
      direction: "asc"
    },
    allowNeutralSort: false
  };

  return (
    <EuiInMemoryTable
      columns={columns}
      items={data.data}
      compressed={true}
      pagination={true}
      sorting={sorting}
    />
  );
};

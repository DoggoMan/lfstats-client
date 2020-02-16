import React, { useContext } from "react";
import PropTypes from "prop-types";
import { StateContext } from "../utils/StateContext";
import { EuiInMemoryTable } from "@elastic/eui";
import EuiCustomLink from "./EuiCustomLink";

export default function ScorecardList({ data }) {
  const [state] = useContext(StateContext);

  const columns = [
    {
      field: "player_name",
      name: "Name",
      dataType: "string",
      sortable: true,
      render: (name, item) => (
        <EuiCustomLink to={`/players/${item.player_id}`}>{name}</EuiCustomLink>
      )
    },
    {
      field: "position",
      name: "Position",
      dataType: "string",
      sortable: true,
      render: (name, item) => {
        let teamColor = state.redTeamColor;
        if (item.team === "green") teamColor = state.greenTeamColor;

        return <span style={{ color: teamColor }}>{name}</span>;
      }
    },
    {
      field: "game_name",
      name: "Game",
      dataType: "string",
      sortable: true,
      render: (name, item) => {
        return (
          <EuiCustomLink to={`/games/${item.game_id}`}>{name}</EuiCustomLink>
        );
      }
    },
    {
      field: "game_winner",
      name: "Result",
      dataType: "string",
      sortable: false,
      render: (name, item) => {
        return item.game_winner === item.team ? "W" : "L";
      }
    },
    { field: "score", name: "Score", dataType: "number", sortable: true },
    {
      field: "mvp_points",
      name: "MVP",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return Number.parseFloat(name).toFixed(2);
      }
    },
    {
      field: "hit_diff",
      name: "Hit Diff",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return (
          <span>
            {Number.parseFloat(name).toFixed(2)} ({item.shot_opponent}/
            {item.times_zapped})
          </span>
        );
      }
    },
    {
      field: "medic_hits",
      name: "Medic Hits",
      dataType: "number",
      sortable: true
    },
    {
      field: "accuracy",
      name: "Accuracy",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return <span>{Number.parseFloat(name * 100).toFixed(2)} %</span>;
      }
    },
    {
      field: "shot_team",
      name: "Shot Team",
      dataType: "number",
      sortable: true
    }
  ];

  const sorting = {
    sort: {
      field: "mvp_points",
      direction: "desc"
    },
    allowNeutralSort: false
  };

  const search = {
    box: {
      incremental: true
    },
    filters: [
      {
        type: "field_value_selection",
        field: "position",
        name: "Position",
        multiSelect: "or",
        options: [
          {
            value: "Commander"
          },
          {
            value: "Heavy Weapons"
          },
          {
            value: "Scout"
          },
          {
            value: "Ammo Carrier"
          },
          {
            value: "Medic"
          }
        ]
      }
    ]
  };

  return (
    <EuiInMemoryTable
      columns={columns}
      items={data}
      search={search}
      compressed={true}
      pagination={true}
      sorting={sorting}
    />
  );
}

ScorecardList.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      player_id: PropTypes.number,
      player_name: PropTypes.string,
      position: PropTypes.string,
      team: PropTypes.string,
      score: PropTypes.number,
      mvp_points: PropTypes.number,
      medic_hits: PropTypes.number,
      accuracy: PropTypes.number,
      shot_team: PropTypes.number,
      hit_diff: PropTypes.number,
      shot_opponent: PropTypes.number,
      times_zapped: PropTypes.number,
      game_id: PropTypes.number,
      game_name: PropTypes.string,
      game_winner: PropTypes.string
    })
  )
};

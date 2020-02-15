import React, { useContext } from "react";
import { StateContext } from "../utils/StateContext";
import { EuiInMemoryTable } from "@elastic/eui";
import EuiCustomLink from "./EuiCustomLink";

export default function ScorecardList({ scorecards }) {
  const [state] = useContext(StateContext);

  const items = scorecards.map(item => {
    return {
      game_name: item.game.game_name,
      ...item
    };
  });

  const columns = [
    {
      field: "player_name",
      name: "Name",
      dataType: "string",
      sortable: true,
      render: (player_name, item) => (
        <EuiCustomLink to={`/players/${item.player.id}`}>
          {player_name}
        </EuiCustomLink>
      )
    },
    {
      field: "position",
      name: "Position",
      dataType: "string",
      sortable: true
    },
    {
      field: "game.game_name",
      name: "Game",
      dataType: "string",
      sortable: true,
      render: (name, item) => {
        return (
          <EuiCustomLink to={`/games/${item.game.id}`}>{name}</EuiCustomLink>
        );
      }
    },
    { field: "score", name: "Score", dataType: "number", sortable: true },
    {
      field: "mvp_points",
      name: "MVP",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return (
          <span style={{ color: state.redTeamColor }}>
            {Number.parseFloat(name).toFixed(2)}
          </span>
        );
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
      items={items}
      search={search}
      compressed={true}
      pagination={true}
      sorting={sorting}
    />
  );
}

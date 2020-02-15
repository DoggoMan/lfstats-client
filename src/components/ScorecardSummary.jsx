import React from "react";
import { EuiInMemoryTable } from "@elastic/eui";
import EuiCustomLink from "./EuiCustomLink";

export default function ScorecardSummary({ data }) {
  const items = data.map(item => {
    return {
      player_name: item.player.player_name,
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
      field: "player.scorecards_aggregate.aggregate.min.score",
      name: "Min Score",
      dataType: "number",
      sortable: true
    },
    {
      field: "player.scorecards_aggregate.aggregate.avg.score",
      name: "Avg Score",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return <span>{Number.parseFloat(name).toFixed(0)}</span>;
      }
    },
    {
      field: "player.scorecards_aggregate.aggregate.max.score",
      name: "Max Score",
      dataType: "number",
      sortable: true
    },
    {
      field: "player.scorecards_aggregate.aggregate.min.mvp_points",
      name: "Min MVP",
      dataType: "number",
      sortable: true
    },
    {
      field: "player.scorecards_aggregate.aggregate.avg.mvp_points",
      name: "Avg MVP",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return <span>{Number.parseFloat(name).toFixed(2)}</span>;
      }
    },
    {
      field: "player.scorecards_aggregate.aggregate.max.mvp_points",
      name: "Max MVP",
      dataType: "number",
      sortable: true
    }
  ];

  const sorting = {
    sort: {
      field: "player.scorecards_aggregate.aggregate.avg.mvp_points",
      direction: "desc"
    },
    allowNeutralSort: false
  };

  const search = {
    box: {
      incremental: true
    }
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

import React from "react";
import { EuiInMemoryTable } from "@elastic/eui";
import EuiCustomLink from "./EuiCustomLink";

export default function MedicHitSummary({ data }) {
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
      field: "player.all.aggregate.sum.medic_hits",
      name: "Medic Hits (All)",
      dataType: "number",
      sortable: true
    },
    {
      field: "player.all.aggregate.avg.medic_hits",
      name: "Avg Medic Hits (All)",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return <span>{Number.parseFloat(name).toFixed(2)}</span>;
      }
    },
    {
      field: "player.all.aggregate.count",
      name: "Games Played (All)",
      dataType: "number",
      sortable: true
    },
    {
      field: "player.nonresup.aggregate.sum.medic_hits",
      name: "Medic Hits (Non-Resup)",
      dataType: "number",
      sortable: true
    },
    {
      field: "player.nonresup.aggregate.avg.medic_hits",
      name: "Avg Medic Hits (Non-Resup)",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return <span>{Number.parseFloat(name).toFixed(2)}</span>;
      }
    },
    {
      field: "player.nonresup.aggregate.count",
      name: "Games Played (Non-Resup)",
      dataType: "number",
      sortable: true
    }
  ];

  const sorting = {
    sort: {
      field: "player.all.aggregate.sum.medic_hits",
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

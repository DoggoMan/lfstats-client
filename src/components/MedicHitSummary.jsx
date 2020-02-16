import React from "react";
import PropTypes from "prop-types";
import { EuiInMemoryTable } from "@elastic/eui";
import EuiCustomLink from "./EuiCustomLink";

export default function MedicHitSummary({ data }) {
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
      field: "sum_all_medic_hits",
      name: "Medic Hits (All)",
      dataType: "number",
      sortable: true
    },
    {
      field: "avg_all_medic_hits",
      name: "Avg Medic Hits (All)",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return <span>{Number.parseFloat(name).toFixed(2)}</span>;
      }
    },
    {
      field: "sum_all_games_played",
      name: "Games Played (All)",
      dataType: "number",
      sortable: true
    },
    {
      field: "sum_nonresup_medic_hits",
      name: "Medic Hits (Non-Resup)",
      dataType: "number",
      sortable: true
    },
    {
      field: "avg_nonresup_medic_hits",
      name: "Avg Medic Hits (Non-Resup)",
      dataType: "number",
      sortable: true,
      render: (name, item) => {
        return <span>{Number.parseFloat(name).toFixed(2)}</span>;
      }
    },
    {
      field: "sum_nonresup_games_played",
      name: "Games Played (Non-Resup)",
      dataType: "number",
      sortable: true
    }
  ];

  const sorting = {
    sort: {
      field: "sum_all_medic_hits",
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
      items={data}
      search={search}
      compressed={true}
      pagination={true}
      sorting={sorting}
    />
  );
}

MedicHitSummary.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      player_id: PropTypes.number,
      player_name: PropTypes.string,
      sum_all_medic_hits: PropTypes.number,
      avg_all_medic_hits: PropTypes.number,
      sum_all_games_played: PropTypes.number,
      sum_nonresup_medic_hits: PropTypes.number,
      avg_nonresup_medic_hits: PropTypes.number,
      sum_nonresup_games_played: PropTypes.number
    })
  )
};

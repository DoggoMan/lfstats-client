import React, { FC } from "react";
import { EuiInMemoryTable, EuiTableFieldDataColumnType } from "@elastic/eui";
import { GAME_ACTION_TYPES, GAME_ACTIONS_TARGETS } from "../actionTypes";
import { msToTime } from "../helpers";
import { Action } from "../interfaces";

interface Props {
  actions: Action[];
}

const ACTION_OPTIONS = GAME_ACTION_TYPES.map(item => ({
  value: item.id,
  name: item.label
}));

const GameActionsList: FC<Props> = ({ actions }) => {
  const filtered = actions
    .filter(action => {
      let keep = true;
      // drop all "misses" actions
      if (["0201"].includes(action.action_type)) keep = false;

      return keep;
    })
    .map(action => ({ ...action, action_text: action.action_text.trim() }));

  console.log(`${filtered.length} Actions`, filtered);
  console.log(ACTION_OPTIONS);

  const columns: EuiTableFieldDataColumnType<Action>[] = [
    {
      field: "action_time",
      name: "Time",
      dataType: "number",
      sortable: true,
      width: "75px",
      render: (time, item) => {
        return <span>{msToTime(time)}</span>;
      }
    },
    {
      field: "playerByPlayerId",
      name: "Player",
      dataType: "string",
      sortable: item => item.playerByPlayerId?.player_name,
      render: (player, item) => {
        return <span>{player?.player_name}</span>;
      }
    },
    {
      field: "action_type",
      name: "Name",
      dataType: "string",
      sortable: item => {
        return item.action_type;
      },
      render: (_, item) => {
        return (
          <span>
            {item.action_text === "zaps"
              ? item.action_type === "0205"
                ? "zaps >"
                : "zaps x"
              : item.action_text}
          </span>
        );
      }
    },
    {
      field: "playerByTargetId",
      name: "Target",
      dataType: "string",
      sortable: item => item?.playerByTargetId?.player_name,
      render: (target, item) => {
        return (
          <span>
            {!item.target_id
              ? GAME_ACTIONS_TARGETS.includes(item.action_type)
                ? "Base"
                : "None"
              : item.playerByTargetId.player_name}
          </span>
        );
      }
    }
  ];

  return (
    <EuiInMemoryTable
      columns={columns}
      items={filtered}
      search={{
        box: {
          incremental: true,
          schema: true
        },
        filters: [
          {
            type: "field_value_selection",
            field: "action_type",
            name: "Action",
            multiSelect: "or",
            options: ACTION_OPTIONS
          }
        ]
      }}
      compressed={true}
      pagination={true}
      sorting={{
        sort: {
          field: "action_time",
          direction: "asc"
        }
      }}
      responsive={true}
    />
  );
};

export default GameActionsList;

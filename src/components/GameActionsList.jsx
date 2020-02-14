import React from 'react';
import { EuiInMemoryTable } from '@elastic/eui';
import { GAME_ACTION_TYPES } from '../actionTypes';
import { msToTime } from '../helpers';

export default function GameActionsList({ actions }) {
  const filtered = actions.filter(action => {
    let keep = true;
    if (action.action_type === '0201') keep = false;

    return keep;
  });

  const columns = [
    {
      field: 'playerByPlayerId',
      name: 'Player',
      dataType: 'string',
      sortable: true,
      render: (player, item) => {
        return <span>{player && player.player_name}</span>;
      },
    },
    {
      field: 'action_text',
      name: 'Name',
      dataType: 'string',
      sortable: true,
      render: (action_text, item) => {
        return <span>{action_text}</span>;
      },
    },
    {
      field: 'playerByTargetId',
      name: 'Target',
      dataType: 'string',
      sortable: true,
      render: (target, item) => {
        return <span>{target && target.player_name}</span>;
      },
    },
    {
      field: 'action_time',
      name: 'Time',
      dataType: 'number',
      sortable: true,
      render: (time, item) => {
        return <span>{msToTime(time)}</span>;
      },
    },
  ];

  const sorting = {
    sort: {
      field: 'action_time',
      direction: 'asc',
    },
    allowNeutralSort: false,
  };

  const search = {
    box: {
      incremental: true,
    },
    filters: [
      {
        type: 'field_value_selection',
        field: 'action_text',
        name: 'Action',
        multiSelect: 'or',
        options: GAME_ACTION_TYPES.map(item => ({ value: item.label })),
      },
    ],
  };

  return (
    <EuiInMemoryTable
      columns={columns}
      items={filtered}
      search={search}
      compressed={true}
      pagination={true}
      sorting={sorting}
    />
  );
}

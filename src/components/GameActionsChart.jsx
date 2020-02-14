import React from 'react';
import { Scatter } from 'react-chartjs-2';

const options = {
  responsive: true,
  tooltips: {
    mode: 'label',
  },
  elements: {
    line: {
      fill: false,
    },
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: false,
        },
        labels: {
          show: true,
        },
      },
    ],
    yAxes: [
      {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis',
        gridLines: {
          display: false,
        },
        labels: {
          show: true,
        },
      },
    ],
  },
};

const dataOptions = team => {
  const colour =
    team === 'Fire' ? '#EC932F' : team === 'Ice' ? '#AABBFF' : '#ada';
  return {
    fill: true,
    borderColor: colour,
    backgroundColor: colour,
    pointBorderColor: colour,
    pointBackgroundColor: colour,
    pointHoverBackgroundColor: colour,
    pointHoverBorderColor: colour,
  };
};

export default function GameActionsChart({ deltas, actions }) {
  console.log(`Deltas`, deltas);
  console.log(`Actions`, actions);
  const deltasFire = deltas.filter(delta => delta.color_desc === 'Fire');
  const deltasIce = deltas.filter(delta => delta.color_desc === 'Ice');

  const ticks = new Array(15);

  const nukes = actions.filter(action => action.action_type === '0405');

  return (
    <Scatter
      data={{
        labels: ticks.map((_, index) => index),
        datasets: [
          {
            ...dataOptions('Fire'),
            label: 'Fire Team',
            data: deltasFire.map(delta => ({
              x: delta.score_time,
              y: delta.sum,
            })),
          },
          {
            ...dataOptions('Ice'),
            label: 'Ice Team',
            data: deltasIce.map(delta => ({
              x: delta.score_time,
              y: delta.sum,
            })),
          },
          {
            ...dataOptions(),
            label: 'Nukes',
            data: nukes.map(action => ({
              x: action.action_time,
              y: 100,
            })),
          },
        ],
      }}
      options={options}
    />
  );
}

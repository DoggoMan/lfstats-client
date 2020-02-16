import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { EuiLoadingSpinner } from "@elastic/eui";
import LoadError from "./LoadError";
import MedicHitSummary from "./MedicHitSummary";

const GET_MEDIC_HIT_STATS = gql`
  query GetMedicHitStats($id: bigint) {
    events(where: { id: { _eq: $id } }) {
      scorecards(distinct_on: player_id) {
        player {
          id
          player_name
          nonresup: scorecards_aggregate(
            where: {
              event_id: { _eq: $id }
              _and: {
                position: { _neq: "Ammo Carrier" }
                _and: { position: { _neq: "Medic" } }
              }
            }
          ) {
            aggregate {
              avg {
                medic_hits
              }
              sum {
                medic_hits
              }
              count
            }
          }
          all: scorecards_aggregate(where: { event_id: { _eq: $id } }) {
            aggregate {
              avg {
                medic_hits
              }
              sum {
                medic_hits
              }
              count
            }
          }
        }
      }
    }
  }
`;

export default function EventMedicHitSummaryContainer({ eventId }) {
  const { data, loading, error } = useQuery(GET_MEDIC_HIT_STATS, {
    variables: { id: eventId * 1 }
  });

  if (loading) return <EuiLoadingSpinner size="xl" />;
  if (error) return <LoadError />;

  const medic_hits = data.events[0].scorecards.map(item => {
    return {
      player_id: item.player.id,
      player_name: item.player.player_name,
      sum_all_medic_hits: item.player.all.aggregate.sum.medic_hits,
      avg_all_medic_hits: item.player.all.aggregate.avg.medic_hits,
      sum_all_games_played: item.player.all.aggregate.count,
      sum_nonresup_medic_hits: item.player.nonresup.aggregate.sum.medic_hits,
      avg_nonresup_medic_hits: item.player.nonresup.aggregate.avg.medic_hits,
      sum_nonresup_games_played: item.player.nonresup.aggregate.count
    };
  });

  return <MedicHitSummary data={medic_hits} />;
}

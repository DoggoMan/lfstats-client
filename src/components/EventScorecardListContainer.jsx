import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { EuiLoadingSpinner } from "@elastic/eui";
import LoadError from "./LoadError";
import ScorecardList from "./ScorecardList";

const GET_EVENT_SCORECARDS = gql`
  query GetEventScorecards($id: bigint) {
    events(where: { id: { _eq: $id } }) {
      scorecards {
        id
        player_name
        position
        team
        score
        mvp_points
        medic_hits
        accuracy
        shot_team
        hit_diff
        shot_opponent
        times_zapped
        game {
          id
          game_name
          winner
        }
        player {
          id
          player_name
        }
      }
    }
  }
`;

export default function EventScorecardListContainer({ eventId }) {
  const { data, loading, error } = useQuery(GET_EVENT_SCORECARDS, {
    variables: { id: eventId * 1 }
  });

  if (loading) return <EuiLoadingSpinner size="xl" />;
  if (error) return <LoadError />;

  const scorecards = data.events[0].scorecards.map(item => {
    return {
      id: item.id,
      player_id: item.player.id,
      player_name: item.player_name,
      position: item.position,
      team: item.team,
      score: item.score,
      mvp_points: item.mvp_points,
      medic_hits: item.medic_hits,
      accuracy: item.accuracy,
      shot_team: item.shot_team,
      hit_diff: item.hit_diff,
      shot_opponent: item.shot_opponent,
      times_zapped: item.times_zapped,
      game_id: item.game.id,
      game_name: item.game.game_name,
      game_winner: item.game.winner
    };
  });

  return <ScorecardList data={scorecards} />;
}

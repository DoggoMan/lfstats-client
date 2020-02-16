import React from "react";
import { EuiLoadingSpinner } from "@elastic/eui";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import LoadError from "./LoadError";
import GameList from "./GameList";

const GET_EVENT_GAMES = gql`
  query GetEvent($id: bigint) {
    events(where: { id: { _eq: $id } }) {
      name
      games {
        game_name
        game_datetime
        game_length
        green_score
        green_adj
        red_score
        red_team_id
        green_team_id
        red_adj
        pdf_id
        winner
        id
      }
    }
  }
`;

export default function EventGameListContainer({ eventId }) {
  const { data, loading, error } = useQuery(GET_EVENT_GAMES, {
    variables: { id: eventId * 1 }
  });

  if (loading) return <EuiLoadingSpinner size="xl" />;
  if (error) return <LoadError />;

  return <GameList data={data.events[0].games} />;
}

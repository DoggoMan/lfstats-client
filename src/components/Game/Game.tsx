import React, { Fragment } from "react";
import {
  EuiPageContent,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiTitle,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLoadingSpinner,
  EuiHorizontalRule
} from "@elastic/eui";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import LoadError from "../LoadError";
import GameActionsChart from "./GameActionsChart";
import GameUptimeChart from "./GameUptimeChart";
import GameActionsList from "./GameActionsList";
import { GameTeam, GameDetails } from "../../interfaces";

const GET_GAME_DETAILS = gql`
  query GetGameDetails($id: bigint){
    games (where: {id: { _eq: $id}}){
      game_length
    }
  }
`

const GET_GAME_ACTIONS = gql`
  query GetGameActions($id: bigint) {
    game_actions(
      order_by: { action_time: asc_nulls_last }
      where: { game_id: { _eq: $id } }
    ) {
      id
      action_text
      action_time
      action_type
      game_id
      game_team {
        color_desc
      }
      team_index
      player_id
      playerByPlayerId {
        player_name
      }
      target_id
      playerByTargetId {
        player_name
      }
    }
  }
`;

const GET_GAME_PLAYERS = gql`
  query getGamePlayers($id: bigint!) {
    scorecards(where: { game_id: { _eq: $id } }) {
      game_team {
        color_desc
      }
      survived
      player {
        id
        ipl_id
        player_name
      }
    }
  }
`;

interface GetGamePlayersResult {
  scorecards: {
    game_team: GameTeam
    survived: number
    player: Player
  }[]
}

export interface Player {
      id: number
      ipl_id: string
      player_name: string
}


const GET_TEAM_DELTAS = gql`
  query GetTeamDeltas($id: bigint) {
    team_deltas(
      order_by: { score_time: asc_nulls_last }
      where: { game_id: { _eq: $id } }
    ) {
      score_time
      delta
      sum
      team_id
      color_desc
    }
  }
`;

export default function Game() {
  const { gameId } = useParams();

  const {
    data: deltasData,
    loading: deltasLoading,
    error: deltasError
  } = useQuery(GET_TEAM_DELTAS, {
    variables: { id: Number(gameId
      )}
  });

  const {
    data: actionsData,
    loading: actionsLoading,
    error: actionsError
  } = useQuery(GET_GAME_ACTIONS, {
    variables: { id: Number(gameId)}
  });

  const {
    data: playersData,
    loading: playersLoading,
    error: playersError
  } = useQuery<GetGamePlayersResult>(GET_GAME_PLAYERS, {
    variables: { id: Number(gameId)}
  });

  const {
    data: gameDetailsData,
    loading: gameDetailsLoading,
    error: gameDetailsError
  } = useQuery<{games: GameDetails[]}>(GET_GAME_DETAILS, {
    variables: { id: Number(gameId)}
  });

  return (
    <Fragment>
      <EuiPageHeader>
        <EuiPageHeaderSection>
          <EuiTitle size="l">
            <h1>Game Summary</h1>
          </EuiTitle>
        </EuiPageHeaderSection>
      </EuiPageHeader>
      <EuiPageContent>
        <EuiPageContentHeader>
          <EuiPageContentHeaderSection>
            <EuiTitle>
              <h2>Score Chart</h2>
            </EuiTitle>
          </EuiPageContentHeaderSection>
        </EuiPageContentHeader>
        <EuiPageContentBody>
          <EuiFlexGroup justifyContent="center">
            <EuiFlexItem grow={true}>
              {(deltasLoading || actionsLoading) && (
                <EuiLoadingSpinner size="xl" />
              )}
              {(deltasError || actionsError) && <LoadError />}
              {deltasData && actionsData && (
                <GameActionsChart
                  deltas={deltasData.team_deltas}
                  actions={actionsData.game_actions}
                />
              )}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageContentBody>
        <EuiHorizontalRule margin="xxl" />
         <EuiPageContentHeader>
          <EuiPageContentHeaderSection>
            <EuiTitle>
              <h2>Uptime Chart</h2>
            </EuiTitle>
          </EuiPageContentHeaderSection>
        </EuiPageContentHeader>
        <EuiPageContentBody>
          <EuiFlexGroup justifyContent="center">
            <EuiFlexItem grow={true}>
              {(gameDetailsLoading || playersLoading || actionsLoading) && (
                <EuiLoadingSpinner size="xl" />
              )}
              {(gameDetailsError || playersError || actionsError) && <LoadError />}
              {(gameDetailsData && playersData && actionsData) && (
                <GameUptimeChart
                  gameDetails={gameDetailsData.games[0]}
                  actions={actionsData.game_actions}
                  scorecards={playersData.scorecards}
                />
              )}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageContentBody>
        <EuiHorizontalRule margin="xxl" />
        <EuiPageContentHeader>
          <EuiPageContentHeaderSection>
            <EuiTitle>
              <h2>Actions Log</h2>
            </EuiTitle>
          </EuiPageContentHeaderSection>
        </EuiPageContentHeader>
        <EuiPageContentBody>
          <EuiFlexGroup justifyContent="center">
            <EuiFlexItem grow={false}>
              {actionsLoading && <EuiLoadingSpinner size="xl" />}
              {actionsError && <LoadError />}
              {actionsData && (
                <GameActionsList actions={actionsData.game_actions} />
              )}
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiPageContentBody>
      </EuiPageContent>
    </Fragment>
  );
}

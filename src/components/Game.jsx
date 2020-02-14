import React, { Fragment } from 'react';
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
  EuiHorizontalRule,
} from '@elastic/eui';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useParams } from 'react-router-dom';
import LoadError from './LoadError';
import GameActionsChart from './GameActionsChart';
import GameActionsList from './GameActionsList';

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
      playerByPlayerId {
        player_name
      }
      playerByTargetId {
        player_name
      }
    }
  }
`;

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
    error: deltasError,
  } = useQuery(GET_TEAM_DELTAS, {
    variables: { id: gameId * 1 },
  });

  const {
    data: actionsData,
    loading: actionsLoading,
    error: actionsError,
  } = useQuery(GET_GAME_ACTIONS, {
    variables: { id: gameId * 1 },
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
              Test
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

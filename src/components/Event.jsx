import React, { Fragment, useState } from "react";
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
  EuiHorizontalRule,
  EuiLoadingSpinner,
  EuiTabbedContent,
  EuiSpacer
} from "@elastic/eui";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useParams } from "react-router-dom";
import LoadError from "./LoadError";
import EventScorecardListContainer from "./EventScorecardListContainer";
import EventScorecardSummaryContainer from "./EventScorecardSummaryContainer";
import EventMedicHitSummaryContainer from "./EventMedicHitSummaryContainer";
import EventGameListContainer from "./EventGameListContainer";

const GET_EVENT = gql`
  query GetEvent($id: bigint) {
    events(where: { id: { _eq: $id } }) {
      id
      name
      description
      is_comp
      games_aggregate {
        aggregate {
          max {
            game_datetime
          }
        }
      }
      center {
        name
      }
    }
  }
`;

export default function Event() {
  const { eventId } = useParams();

  const [tabs] = useState([
    {
      id: "stats",
      name: "Stats",
      content: (
        <Fragment>
          <EuiSpacer />
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle>
                  <h2>Scorecards</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiPageContentBody>
              <EuiFlexGroup justifyContent="center">
                <EuiFlexItem grow={false}>
                  <EventScorecardListContainer eventId={eventId} />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContentBody>
            <EuiHorizontalRule margin="xxl" />
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle>
                  <h2>Summary Stats</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiPageContentBody>
              <EuiFlexGroup justifyContent="center">
                <EuiFlexItem grow={false}>
                  <EventScorecardSummaryContainer eventId={eventId} />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContentBody>
            <EuiHorizontalRule margin="xxl" />
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle>
                  <h2>Medic Hits</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiPageContentBody>
              <EuiFlexGroup justifyContent="center">
                <EuiFlexItem grow={false}>
                  <EventMedicHitSummaryContainer eventId={eventId} />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContentBody>
          </EuiPageContent>
        </Fragment>
      )
    },
    {
      id: "games",
      name: "Games",
      content: (
        <Fragment>
          <EuiSpacer />
          <EuiPageContent>
            <EuiPageContentHeader>
              <EuiPageContentHeaderSection>
                <EuiTitle>
                  <h2>Games Played</h2>
                </EuiTitle>
              </EuiPageContentHeaderSection>
            </EuiPageContentHeader>
            <EuiPageContentBody>
              <EuiFlexGroup justifyContent="center">
                <EuiFlexItem grow={false}>
                  <EventGameListContainer eventId={eventId} />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPageContentBody>
          </EuiPageContent>
        </Fragment>
      )
    }
  ]);

  const { data, loading, error } = useQuery(GET_EVENT, {
    variables: { id: eventId * 1 }
  });

  if (loading) return <EuiLoadingSpinner size="xl" />;
  if (error) return <LoadError />;

  return (
    <Fragment>
      <EuiPageHeader>
        <EuiPageHeaderSection>
          <EuiTitle size="l">
            <h1>{`${data.events[0].name} @ ${data.events[0].center.name}`}</h1>
          </EuiTitle>
        </EuiPageHeaderSection>
      </EuiPageHeader>
      <EuiTabbedContent
        tabs={tabs}
        initialSelectedTab={tabs[0]}
        autoFocus="selected"
      />
    </Fragment>
  );
}

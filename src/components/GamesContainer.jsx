import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Game from './Game/Game';

export default function GamesContainer() {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${match.path}/:gameId`}>
        <Game />
      </Route>
      {/* <Route path={`${match.path}/:gameId/actions`}>
        <GameActionsChart />
      </Route> */}
      <Route path={match.path}>
        <h3>Please select a Game</h3>
      </Route>
    </Switch>
  );
}

import React from "react";
import { EuiPage, EuiPageBody, EuiSpacer } from "@elastic/eui";
import LFHeader from "./LFHeader";
import { Route, Switch } from "react-router-dom";
import Landing from "./Landing";
import EventsContainer from "./EventsContainer";
import PlayersContainer from "./PlayersContainer";
import CentersContainer from "./CentersContainer";
import Footer from "./Footer";
import { BrowserRouter as Router } from "react-router-dom";

import "@elastic/eui/dist/eui_theme_light.css";

export default () => (
  <Router>
    <LFHeader />
    <EuiPage restrictWidth={true}>
      <EuiPageBody>
        <Switch>
          <Route exact path="/">
            <Landing />
          </Route>
          <Route path="/events">
            <EventsContainer />
          </Route>
          <Route path="/players">
            <PlayersContainer />
          </Route>
          <Route path="/centers">
            <CentersContainer />
          </Route>
        </Switch>
        <EuiSpacer />
        <Footer />
      </EuiPageBody>
    </EuiPage>
  </Router>
);

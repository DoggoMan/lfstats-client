import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { StateProvider } from "./utils/StateContext";
import LFApp from "./components/LFApp";

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URI
});

function LFStats() {
  return (
    <ApolloProvider client={client}>
      <StateProvider>
        <LFApp />
      </StateProvider>
    </ApolloProvider>
  );
}

export default LFStats;

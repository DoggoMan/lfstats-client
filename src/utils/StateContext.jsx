import React, { useState } from "react";
import { euiPaletteColorBlind } from "@elastic/eui/lib/services";

const StateContext = React.createContext([{}, () => {}]);

const StateProvider = props => {
  const palette = euiPaletteColorBlind();
  const [state, setState] = useState({
    selectedEvent: null,
    selectedCenter: null,
    typeFilter: "all",
    redTeamColor: palette[9],
    greenTeamColor: palette[0]
  });

  return (
    <StateContext.Provider value={[state, setState]}>
      {props.children}
    </StateContext.Provider>
  );
};

export { StateContext, StateProvider };

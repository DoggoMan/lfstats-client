import React, { useState, FC, Dispatch, SetStateAction } from "react";
import { euiPaletteColorBlind } from "@elastic/eui/lib/services";
import { ContextType } from "../interfaces";

const StateContext = React.createContext<[Partial<ContextType>,Dispatch<SetStateAction<ContextType>>]>([{}, () => {}]);


const StateProvider: FC = props => {
  const palette = euiPaletteColorBlind();
  const [state, setState] = useState<ContextType>({
    selectedEvent: null,
    selectedCenter: null,
    typeFilter: "all",
    redTeamColor: palette[9],
    greenTeamColor: palette[0],
    blueTeamColor: palette[1],
    nukeColor: palette[7]
  });

  return (
    <StateContext.Provider value={[state, setState]}>
      {props.children}
    </StateContext.Provider>
  );
};

export { StateContext, StateProvider };

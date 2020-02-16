export const GAME_ACTIONS_TARGETS = ["0202", "0203", "0204", "0303"];

export const GAME_ACTION_TYPES: {
  label: string,
  value: string,
  id: string
}[] = [
  // MISSION EVENTS //
  {
    label: "Mission Start",
    value: "* Mission Start *",
    id: "0100"
  },
  {
    label: "Mission End",
    value: "* Mission End *",
    id: "0101"
  },

  // ZAP EVENTS //
  {
    label: "shot, missed anything",
    value: "misses",
    id: "0201" // # NpbXzq  misses
  },
  {
    label: "shot, missed target",
    value: "misses",
    id: "0202" // # fW6rXgn  misses  @178
  },
  {
    label: "shot target",
    value: "zaps",
    id: "0203" // # fW6rXgn  zaps  @178
  },
  {
    label: "destroyed target with a shot",
    value: "destroys",
    id: "0204" // # fW6rXgn  destroys  @178
  },
  {
    label: "zapped player (no-deac)",
    value: "zaps",
    id: "0205" // # fW6rXgn  zaps  #jtdSRJs
  },
  {
    label: "zapped player (deac)",
    value: "zaps",
    id: "0206" // # 5rmpgTL  zaps  #txGrFdM
  },
  // MISSILE EVENTS //

  {
    label: "missile locking player",
    value: "locking",
    id: "0300" // # rgzB9p7  locking  #78QYSKb
  },
  {
    label: "destroyed target with a missile",
    value: "destroys",
    id: "0303" // # txGrFdM  destroys  @4414
  },
  {
    label: "missiled a player",
    value: "missiles",
    id: "0306" // # rgzB9p7  missiles  #txGrFdM
  },

  // SPECIALS EVENTS //
  {
    label: "activated rapid fire",
    value: "activates rapid fire",
    id: "0400" // # SJ39pC  activates rapid fire
  },
  {
    label: "activated a nuke",
    value: "activates nuke",
    id: "0404" // # txGrFdM  activates nuke
  },
  {
    label: "detonated a nuke",
    value: "detonates nuke",
    id: "0405" // # txGrFdM  detonates nuke
  },

  // RESUPPLY EVENTS //
  {
    label: "resupplied ammunition",
    value: "resupplies",
    id: "0500" // # KQxFLK  resupplies  #5rmpgTL
  },
  {
    label: "resupplied lives",
    value: "resupplies",
    id: "0502" // # NpbXzq  resupplies  #5rmpgTL
  },
  {
    label: "boosted ammunition",
    value: "resupplies team",
    id: "0510" // # spFbw  resupplies team
  },
  {
    label: "boosted lives",
    value: "resupplies team",
    id: "0512" // # NpbXzq  resupplies team
  },

  // PENALTY EVENTS //
  {
    label: "is penalised",
    value: "is penalised",
    id: "0600" // # rgzB9p7 is penalised
  },

  // MISC EVENTS //
  {
    label: "awarded generator (elimination)",
    value: "is awarded 	@176",
    id: "0B03" // # fW6rXgn is awarded 	@176
  }
];

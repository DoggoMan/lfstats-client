// TODO: add another key 'text' with the actual textual value
export const GAME_ACTION_TYPES = [
  // MISSION EVENTS //
  {
    label: 'Mission Start',
    id: '0100',
  },
  {
    label: 'Mission End',
    id: '0101',
  },

  // ZAP EVENTS //
  {
    label: 'shot, missed anything',
    id: '0201', // # NpbXzq  misses
  },
  {
    label: 'shot, missed target',
    id: '0202', // # fW6rXgn  misses  @178
  },
  {
    label: 'shot target',
    id: '0203', // # fW6rXgn  zaps  @178
  },
  {
    label: 'destroyed target with a shot',
    id: '0204', // # fW6rXgn  destroys  @178
  },
  {
    label: 'zapped player (no-deac)',
    id: '0205', // # fW6rXgn  zaps  #jtdSRJs
  },
  {
    label: 'zapped player (deac)',
    id: '0206', // # 5rmpgTL  zaps  #txGrFdM
  },
  // MISSILE EVENTS //

  {
    label: 'missile locking player',
    id: '0300', // # rgzB9p7  locking  #78QYSKb
  },
  {
    label: 'destroyed target with a missile',
    id: '0303', // # txGrFdM  destroys  @4414
  },
  {
    label: 'missiled a player',
    id: '0306', // # rgzB9p7  missiles  #txGrFdM
  },

  // SPECIALS EVENTS //
  {
    label: 'activated rapid fire',
    id: '0400', // # SJ39pC  activates rapid fire
  },
  {
    label: 'activated a nuke',
    id: '0404', // # txGrFdM  activates nuke
  },
  {
    label: 'detonated a nuke',
    id: '0405', // # txGrFdM  detonates nuke
  },

  // RESUPPLY EVENTS //
  {
    label: 'resupplied ammunition',
    id: '0500', // # KQxFLK  resupplies  #5rmpgTL
  },
  {
    label: 'resupplied lives',
    id: '0502', // # NpbXzq  resupplies  #5rmpgTL
  },
  {
    label: 'boosted ammunition',
    id: '0510', // # spFbw  resupplies team
  },
  {
    label: 'boosted lives',
    id: '0512', // # NpbXzq  resupplies team
  },

  // PENALTY EVENTS //
  {
    label: 'is penalised',
    id: '0600', // # rgzB9p7 is penalised
  },

  // MISC EVENTS //
  {
    label: 'awarded generator (elimination)',
    id: '0B03', // # fW6rXgn is awarded 	@176
  },
];

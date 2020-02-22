
export type ContextType = {
  selectedEvent: number | null
  selectedCenter: number | null
  typeFilter: "all" | string
  redTeamColor: string
  greenTeamColor: string
  blueTeamColor: string
  nukeColor: string
}

export interface Delta {
  score_time: string
  delta: number
  sum: number
  team_id: number
  color_desc: string
} 

export interface Action {
  id: number
  action_text: string
  action_time: number
  action_type: string
  game_id: number
  game_team: {
    color_desc: string
  }
  team_index: number
  player_id: number
  playerByPlayerId: {
    player_name: string
  }
  target_id: number
  playerByTargetId: {
    player_name: string
  }
}

export interface GameDetails {
  game_length: number
}

export interface GameTeam {
    color_desc: string
  }

export interface Scorecard {
  game_team: GameTeam
  survived: number
  player: {
    id: number
    ipl_id: string
    player_name: string
  }
}
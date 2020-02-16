
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
  action_time: string
  action_type: string
  game_id: number
  game_team: {
    color_desc: string
  }
  team_index: number
  player_id: string
  playerByPlayerId: {
    player_name: string
  }
  target_id: string
  playerByTargetId: {
    player_name: string
  }
}
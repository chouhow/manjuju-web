export type Sender = 'user' | 'ai' | 'workspace'

export type MessageType =
  | 'user_text'
  | 'user_file'
  | 'ai_text'
  | 'think'
  | 'avatar'
  | 'task'
  | 'options'
  | 'handover'
  | 'stop_reason'
  | 'style'
  | 'style_select'
  | 'film_config_request'
  | 'workspace_character'
  | 'workspace_scene'
  | 'workspace_script'
  | 'workspace_storyboard'
  | 'workspace_all'
  | 'error'

export type MessageRole = 'director' | 'character' | 'scene' | 'storyboard' | 'script'

export interface SSEMessage {
  id?: string
  conversation_id?: string
  component_id: number | null
  sender: Sender
  msg_type: MessageType
  text: string | null
  content: Record<string, unknown> | null
  role?: MessageRole | string
  created_at?: string
  updated_at?: string
}

export interface ChatMessage extends SSEMessage {
  isStreaming?: boolean
}

export interface TaskContent {
  title: string
  status: 'in_progress' | 'completed' | 'failed' | 'cancelled'
}

export interface OptionsContent {
  items: string[]
  selectable: boolean
  selected_index: number | null
}

export interface HandoverContent {
  inviter: string
  invitee: string
}

export interface StyleContent {
  style_type: 'system' | 'custom' | 'upload' | 'text'
  style_name: string | null
  image_url: string | null
  style_prompt: string | null
}

export interface StyleSelectContent {
  styles: Array<{
    uid: string
    name: string
    image_url: string
  }>
}

export interface FilmConfigRequestContent {
  // 仅作为信号，无具体字段；前端固定渲染表单
}

export interface WorkspaceCharacterContent {
  characters: Array<{
    name: string
    background?: string
    portrait_prompt?: string
    portrait_image_url?: string
    concept_image_url?: string
  }>
}

export interface WorkspaceSceneContent {
  scenes: Array<{
    name: string
    description?: string
    prompt?: string
    url?: string
  }>
}

export interface WorkspaceStoryboardContent {
  storyboard_id?: number
  title?: string
  action?: string
}

export interface WorkspaceScriptContent {
  title?: string
  action?: string
}

export interface AssetReference {
  type: string
  source: 'asset_library' | 'project'
  uid: string
  name: string
  url?: string
  summary?: string
}

export interface UserTextContent {
  references?: AssetReference[]
}

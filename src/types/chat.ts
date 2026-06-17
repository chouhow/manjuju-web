export interface FilmConfig {
  film_ratio?: '16:9' | '9:16'
  dialogue_language?: 'zh' | 'en'
  image_model?: 'gemini' | 'gpt' | 'seedream'
  video_model?: 'seedance' | 'sora-2' | 'kling-v3' | 'vidu-q2'
}

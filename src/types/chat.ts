export interface FilmConfig {
  film_length?: '<=120s' | '>120s'
  film_ratio?: '16:9' | '9:16'
  dialogue_language?: 'zh' | 'en'
  image_model?: 'gemini' | 'gpt' | 'seedream'
}

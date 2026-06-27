export type DetektifDifficulty = 'easy' | 'medium' | 'hard';

export interface DetektifRequest {
  difficulty?: DetektifDifficulty;
}

export interface DetektifResponse {
  text?: string;
  standart_vocabulary?: string[];
  standard_vocabulary?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T | null;
  error?: string | null;
}


export interface Question {
  id: string;
  question: string;
  options: string[] | string;
  level: string;
}

export interface AnswerResult {
  is_correct: boolean;
  explanation: string;
  example: string;
  level_signal: string;
}

export interface ChatMessageDto {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequestDto {
  messages: ChatMessageDto[];
  lang?: string;
}

export interface ChatSourceDto {
  title: string;
  sourceType: string;
  sourceKey: string;
  score: number;
}

export interface ChatResponseDto {
  reply: string;
  model: string;
  sources?: ChatSourceDto[] | null;
  handoffRequested?: boolean;
}

export interface ChatErrorDto {
  error: string;
  detail?: string | null;
}

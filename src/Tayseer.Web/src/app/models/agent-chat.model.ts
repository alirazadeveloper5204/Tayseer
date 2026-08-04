export interface AgentMessage {
  id: string;
  sender: string;
  body: string;
  adminDisplayName?: string | null;
  createdAt: string;
}

export interface AgentConversationSummary {
  id: string;
  status: string;
  lang: string;
  visitorName?: string | null;
  visitorEmail?: string | null;
  subject?: string | null;
  assignedAdminName?: string | null;
  createdAt: string;
  updatedAt: string;
  lastVisitorMessageAt?: string | null;
  unreadForAdminHint: number;
}

export interface AgentConversationDetail {
  id: string;
  status: string;
  lang: string;
  visitorName?: string | null;
  visitorEmail?: string | null;
  subject?: string | null;
  assignedAdminUserId?: string | null;
  assignedAdminName?: string | null;
  createdAt: string;
  updatedAt: string;
  messages: AgentMessage[];
}

export interface StartAgentChatRequest {
  lang?: string;
  visitorName?: string;
  visitorEmail?: string;
  initialMessage?: string;
  transcriptSummary?: string;
}

export interface StartAgentChatResponse {
  conversationId: string;
  visitorKey: string;
  status: string;
  messages: AgentMessage[];
}

export interface AgentNotificationPayload {
  type: string;
  title: string;
  body: string;
  conversationId: string;
  createdAt: string;
}

export interface AdminMessageCreatedPayload {
  conversationId: string;
  message: AgentMessage;
}

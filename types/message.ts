export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  isRead: boolean
  expiresAt: string | null
  createdAt: string
}

export interface MessageThread {
  participantId: string
  participantName: string
  participantAvatar: string | null
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  messages: Message[]
}

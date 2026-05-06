export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isAudio?: boolean;
  audioDuration?: number; // in seconds
}

export interface UserInfo {
  name: string;
  avatar?: string;
}
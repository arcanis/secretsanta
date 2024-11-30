export interface Rule {
  type: 'must' | 'mustNot';
  targetParticipantId: string;
}

export interface Participant {
  id: string;
  name: string;
  hint?: string;
  rules: Rule[];
}

export type Participants = Record<string, Participant>;

// New type for encrypted data
export interface ReceiverData {
  name: string;
  hint?: string;
}

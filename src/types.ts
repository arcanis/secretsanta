export interface Rule {
  type: 'must' | 'mustNot';
  targetParticipantId: string;
}

export interface Participant {
  id: string;
  name: string;
  rules: Rule[];
}

export type Participants = Record<string, Participant>;

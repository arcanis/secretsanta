export interface Participant {
  name: string;
  rules: Rule[];
}

export interface Rule {
  type: 'must' | 'mustNot';
  targetParticipant: string;
}
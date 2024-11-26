import { Participant } from "../types";

export type GeneratedPairs = {
  hash: string;
  pairings: {
    giver: {id: string; name: string};
    receiver: {id: string; name: string};
  }[];
};

export function generateGenerationHash(participants: Record<string, Participant>): string {
  return JSON.stringify(Object.values(participants).map(p => ({rules: p.rules})));
}

export function generatePairs(participants: Record<string, Participant>): GeneratedPairs | null {
  const participantsList = Object.values(participants);
  
  if (participantsList.length < 2) {
    return null;
  }

  // First, check if the rules are valid
  if (participantsList.some(p => p.rules.some(r => {
    if (r.type === 'must' && !participants[r.targetParticipantId]) {
      return true; // Invalid target
    }
    return false;
  }))) {
    return null;
  }

  // Initialize sets of available givers and receivers using IDs
  let availableGivers = new Set(Object.keys(participants));
  let availableReceivers = new Set(Object.keys(participants));
  
  // Initialize the final pairs
  const pairs: Map<string, string> = new Map();

  // First, handle all MUST rules
  for (const participant of participantsList) {
    const mustRule = participant.rules.find(r => r.type === 'must');
    if (mustRule) {
      if (!availableReceivers.has(mustRule.targetParticipantId)) {
        return null; // Impossible to satisfy MUST rules
      }

      pairs.set(participant.id, mustRule.targetParticipantId);
      availableGivers.delete(participant.id);
      availableReceivers.delete(mustRule.targetParticipantId);
    }
  }

  // Convert remaining available participants to arrays for shuffling
  let remainingGivers = Array.from(availableGivers);
  let remainingReceivers = Array.from(availableReceivers);

  // Try to match remaining participants
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    // Shuffle remaining receivers
    for (let i = remainingReceivers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingReceivers[i], remainingReceivers[j]] = 
        [remainingReceivers[j], remainingReceivers[i]];
    }

    // Try this combination
    const tempPairs = new Map(pairs);
    let isValid = true;

    for (let i = 0; i < remainingGivers.length; i++) {
      const giverId = remainingGivers[i];
      const receiverId = remainingReceivers[i];
      
      // Check for self-assignment
      if (giverId === receiverId) {
        isValid = false;
        break;
      }

      // Check MUST NOT rules
      const mustNotViolation = participants[giverId].rules
        .some(rule => rule.type === 'mustNot' && rule.targetParticipantId === receiverId);

      if (mustNotViolation) {
        isValid = false;
        break;
      }

      tempPairs.set(giverId, receiverId);
    }

    if (isValid) {
      const pairings = [...tempPairs].map(([giverId, receiverId]) => ({
        giver: {id: giverId, name: participants[giverId].name},
        receiver: {id: receiverId, name: participants[receiverId].name},
      }));

      return {
        hash: generateGenerationHash(participants),
        pairings,
      };
    }

    attempts++;
  }

  return null;
} 
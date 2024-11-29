import { Participant, Rule } from "../types";

export function checkRules(rules: Rule[]): string | null {
  const mustRules = rules.filter(r => r.type === 'must');
  if (mustRules.length > 1) {
    return 'errors.multipleMustRules';
  } else if (mustRules.length === 1) {
    if (rules.some(r => r.type === 'mustNot' && r.targetParticipantId === mustRules[0].targetParticipantId)) {
      return 'errors.conflictingRules';
    }
  }

  return null;
}

export function generateGenerationHash(participants: Record<string, Participant>): string {
  return JSON.stringify(Object.values(participants).map(p => ({rules: p.rules})));
}

export type GeneratedPairs = {
  hash: string;
  pairings: {
    giver: {id: string; name: string};
    receiver: {id: string; name: string};
  }[];
};

export function generatePairs(participants: Record<string, Participant>): GeneratedPairs | null {
  const participantIds = Object.keys(participants);
  
  if (participantIds.length < 2) {
    return null;
  }

  // Validate rules
  for (const participant of Object.values(participants)) {
    if (checkRules(participant.rules)) {
      return null;
    }
  }

  // Initialize candidate receivers for each giver
  const initialCandidateReceivers = new Map<string, Set<string>>();

  for (const giverId of participantIds) {
    const giver = participants[giverId];
    
    // Start with all participants except self as potential receivers
    const candidates = new Set(participantIds.filter(id => id !== giverId));
    
    // Handle MUST rules
    const mustRule = giver.rules.find(r => r.type === 'must');
    if (mustRule) {
      // If there's a MUST rule, this is the only possible receiver
      candidates.clear();
      candidates.add(mustRule.targetParticipantId);
    } else {
      // Remove MUST NOT targets from candidates
      giver.rules
        .filter(r => r.type === 'mustNot')
        .forEach(r => candidates.delete(r.targetParticipantId));
    }

    initialCandidateReceivers.set(giverId, candidates);
  }

  // Find next giver with fewest options
  const findNextGiver = (candidateReceivers: Map<string, Set<string>>): string | null => {
    let minOptions = Infinity;
    let result: string | null = null;

    for (const [giverId, candidates] of candidateReceivers) {
      if (candidates.size < minOptions) {
        minOptions = candidates.size;
        result = giverId;
      }
    }

    return result;
  };

  pairingGenerations:
  for (let t = 0; t < 10; t++) {
    // Generate pairings
    const finalPairs = new Map<string, string>();
    const candidateReceivers = structuredClone(initialCandidateReceivers);

    while (candidateReceivers.size > 0) {
      const giverId = findNextGiver(candidateReceivers);
      if (!giverId) break;

      const candidates = candidateReceivers.get(giverId)!;
      if (candidates.size === 0) {
        continue pairingGenerations; // No valid receivers left for this giver
      }

      // Randomly select a receiver from candidates
      const receiverId = Array.from(candidates)[Math.floor(Math.random() * candidates.size)];
      finalPairs.set(giverId, receiverId);

      // Remove this receiver as an option for all remaining givers
      candidateReceivers.delete(giverId);
      for (const candidates of candidateReceivers.values()) {
        candidates.delete(receiverId);
      }
    }

    if (finalPairs.size !== participantIds.length) {
      continue pairingGenerations; // Not everyone got paired
    }

    const pairings = Array.from(finalPairs).map(([giverId, receiverId]) => ({
      giver: {
        id: giverId,
        name: participants[giverId].name
      },
      receiver: {
        id: receiverId,
        name: participants[receiverId].name
      }
    }));

    return {
      hash: generateGenerationHash(participants),
      pairings
    };
  }

  return null;
} 
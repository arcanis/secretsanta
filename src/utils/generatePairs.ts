interface Rule {
  type: 'must' | 'mustNot';
  targetParticipant: string;
}

interface Participant {
  name: string;
  rules: Rule[];
}

export function generatePairs(participants: Participant[]): [string, string][] | null {
  if (participants.length < 2) {
    return null;
  }

  // Initialize arrays of available givers and receivers
  let availableGivers = new Set(participants.map(p => p.name));
  let availableReceivers = new Set(participants.map(p => p.name));
  
  // Initialize the final pairs
  const pairs: Map<string, string> = new Map();

  // First, handle all MUST rules
  for (const participant of participants) {
    const mustRule = participant.rules.find(r => r.type === 'must');
    if (mustRule) {
      // Check if this pairing is possible
      if (!availableReceivers.has(mustRule.targetParticipant)) {
        return null; // Impossible to satisfy MUST rules
      }

      // Add the required pairing
      pairs.set(participant.name, mustRule.targetParticipant);
      availableGivers.delete(participant.name);
      availableReceivers.delete(mustRule.targetParticipant);
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
      const giver = remainingGivers[i];
      const receiver = remainingReceivers[i];
      
      // Check for self-assignment (not allowed unless specified by MUST rule)
      if (giver === receiver) {
        isValid = false;
        break;
      }

      // Check MUST NOT rules
      const giverRules = participants.find(p => p.name === giver)?.rules || [];
      const mustNotViolation = giverRules.some(rule => 
        rule.type === 'mustNot' && rule.targetParticipant === receiver
      );

      if (mustNotViolation) {
        isValid = false;
        break;
      }

      tempPairs.set(giver, receiver);
    }

    if (isValid) {
      // Verify no self-assignments in final result (except for MUST rules)
      const finalPairs = Array.from(tempPairs);
      const hasSelfAssignment = finalPairs.some(([giver, receiver]) => {
        if (giver === receiver) {
          // Check if this self-assignment was required by a MUST rule
          const participant = participants.find(p => p.name === giver);
          const mustRule = participant?.rules.find(r => r.type === 'must');
          return !mustRule || mustRule.targetParticipant !== giver;
        }
        return false;
      });

      if (!hasSelfAssignment) {
        return finalPairs;
      }
    }

    attempts++;
  }

  return null;
} 
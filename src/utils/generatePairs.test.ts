import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { generatePairs } from './generatePairs';
import { Participant } from '../types';

describe('generatePairs', () => {
  // Arbitrary to generate valid participant names (non-empty strings)
  const nameArb = fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0);

  // Arbitrary to generate a valid participant
  const participantArb = fc.record({
    name: nameArb,
    rules: fc.array(
      fc.record({
        type: fc.constantFrom<'must' | 'mustNot'>('must', 'mustNot'),
        targetParticipantIndex: fc.nat()
      }),
      { maxLength: 3 }
    )
  });

  // Updated participantsArb to generate valid rule combinations
  const participantsArb = fc.array(participantArb, { minLength: 2, maxLength: 10 })
    .map(participants => {
      // Fix rule indexes and ensure rule consistency
      return participants.map(p => {
        const rules = p.rules
          // Remove duplicate rules for the same target
          .filter((rule, index, self) => 
            index === self.findIndex(r => r.targetParticipantIndex === rule.targetParticipantIndex)
          )
          // Ensure valid indexes
          .map(r => ({
            ...r,
            targetParticipantIndex: r.targetParticipantIndex % participants.length
          }));

        // Ensure no more than one MUST rule
        const mustRules = rules.filter(r => r.type === 'must');
        const validRules = mustRules.length > 1 
          ? [mustRules[0], ...rules.filter(r => r.type === 'mustNot')]
          : rules;

        // Remove conflicting MUST/MUST NOT rules
        const mustRule = validRules.find(r => r.type === 'must');
        const finalRules = mustRule
          ? validRules.filter(r => 
              r.type === 'must' || 
              r.targetParticipantIndex !== mustRule.targetParticipantIndex
            )
          : validRules;

        return {
          ...p,
          rules: finalRules
        };
      });
    });

  it('should always return valid pairings or null', () => {
    fc.assert(
      fc.property(participantsArb, (participants) => {
        const result = generatePairs(participants);
        
        if (result === null) {
          return true; // Null is a valid result
        }

        // Properties that must hold for valid pairings:
        expect(result).toHaveLength(participants.length);
        
        const givers = new Set(result.map(([giver]) => giver));
        const receivers = new Set(result.map(([_, receiver]) => receiver));
        
        // Everyone gives exactly once
        expect(givers.size).toBe(participants.length);
        // Everyone receives exactly once
        expect(receivers.size).toBe(participants.length);
        
        // All MUST rules are respected
        result.forEach(([giver, receiver]) => {
          const mustRules = giver.rules.filter(r => r.type === 'must');
          
          mustRules.forEach(rule => {
            expect(receiver).toBe(participants[rule.targetParticipantIndex]);
          });
        });

        // All MUST NOT rules are respected
        result.forEach(([giver, receiver]) => {
          const mustNotRules = giver.rules.filter(r => r.type === 'mustNot');
          
          mustNotRules.forEach(rule => {
            expect(receiver).not.toBe(participants[rule.targetParticipantIndex]);
          });
        });

        // No self-assignments unless required by MUST rule
        result.forEach(([giver, receiver]) => {
          if (giver === receiver) {
            const giverParticipant = participants.find(p => p === giver)!;
            const selfAssignmentRequired = giverParticipant.rules.some(
              r => r.type === 'must' && 
              participants[r.targetParticipantIndex].name === giver.name
            );
            expect(selfAssignmentRequired).toBe(true);
          }
        });
      })
    );
  });

  it('should return null for impossible configurations', () => {
    // Test case: everyone MUST NOT give to everyone else
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 5 }), (size) => {
        const participants: Participant[] = Array.from({ length: size }, (_, i) => ({
          name: `Person${i}`,
          rules: Array.from({ length: size }, (_, j) => ({
            type: 'mustNot' as const,
            targetParticipantIndex: j
          }))
        }));

        const result = generatePairs(participants);
        expect(result).toBeNull();
      })
    );
  });

  it('should handle circular MUST rules correctly', () => {
    // Test case: A must give to B, B must give to C, C must give to A
    const participants: Participant[] = [
      { name: 'A', rules: [{ type: 'must', targetParticipantIndex: 1 }] },
      { name: 'B', rules: [{ type: 'must', targetParticipantIndex: 2 }] },
      { name: 'C', rules: [{ type: 'must', targetParticipantIndex: 0 }] },
    ];

    const result = generatePairs(participants);
    expect(result).toEqual([
      [participants[0], participants[1]],
      [participants[1], participants[2]],
      [participants[2], participants[0]],
    ]);
  });

  it('should return null for invalid rule configurations', () => {
    // Test multiple MUST rules
    const multiMustParticipants: Participant[] = [
      { 
        name: 'A', 
        rules: [
          { type: 'must', targetParticipantIndex: 1 },
          { type: 'must', targetParticipantIndex: 2 }
        ] 
      },
      { name: 'B', rules: [] },
      { name: 'C', rules: [] },
    ];
    expect(generatePairs(multiMustParticipants)).toBeNull();

    // Test conflicting MUST/MUST NOT rules
    const conflictingRulesParticipants: Participant[] = [
      { 
        name: 'A', 
        rules: [
          { type: 'must', targetParticipantIndex: 1 },
          { type: 'mustNot', targetParticipantIndex: 1 }
        ] 
      },
      { name: 'B', rules: [] },
    ];
    expect(generatePairs(conflictingRulesParticipants)).toBeNull();
  });
}); 
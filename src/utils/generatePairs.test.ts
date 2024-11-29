import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { GeneratedPairs, generatePairs } from './generatePairs';
import { Participant, Rule } from '../types';
import { parseParticipantsText, ParseSuccess } from './parseParticipants';

describe('generatePairs', () => {
  // Arbitrary to generate valid participant names (non-empty strings)
  const nameArb = fc.string({ minLength: 1 }).map(s => s.trim()).filter(s => s.length > 0);

  // Arbitrary to generate a valid participant
  const participantArb = fc.record({
    id: fc.string(),
    name: nameArb,
    rules: fc.array(
      fc.record({
        type: fc.constantFrom<'must' | 'mustNot'>('must', 'mustNot'),
        targetParticipantId: fc.integer({ min: 0 })
      }),
      { maxLength: 3 }
    )
  });

  // Updated participantsArb to generate valid rule combinations
  const participantsArb = fc.dictionary(
    fc.string(),
    participantArb,
    { minKeys: 2, maxKeys: 10 }
  ).map(participants => {
    // Fix rule IDs and ensure rule consistency
    return Object.fromEntries(
      Object.entries(participants).map(([id, participant]) => {
        const rules = participant.rules
          // Remove duplicate rules for the same target
          .filter((rule, index, self) => 
            index === self.findIndex(r => r.targetParticipantId === rule.targetParticipantId)
          )
          // Ensure valid IDs
          .map(r => ({
            ...r,
            targetParticipantId: Object.keys(participants)[
              r.targetParticipantId % Object.keys(participants).length
            ]
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
              r.targetParticipantId !== mustRule.targetParticipantId
            )
          : validRules;

        return [id, {
          ...participant,
          id,
          rules: finalRules
        }];
      })
    );
  });

  it('should always return valid pairings or null', () => {
    fc.assert(
      fc.property(participantsArb, (participants) => {
        const result = generatePairs(participants);
        
        if (result === null) {
          return true; // Null is a valid result
        }

        // Properties that must hold for valid pairings:
        expect(result.pairings).toHaveLength(Object.keys(participants).length);
        
        const givers = new Set(result.pairings.map(({giver}) => giver.id));
        const receivers = new Set(result.pairings.map(({receiver}) => receiver.id));
        
        // Everyone gives exactly once
        expect(givers.size).toBe(Object.keys(participants).length);
        // Everyone receives exactly once
        expect(receivers.size).toBe(Object.keys(participants).length);
        
        // All MUST rules are respected
        result.pairings.forEach(({giver, receiver}) => {
          const mustRules = participants[giver.id].rules.filter(r => r.type === 'must');
          
          mustRules.forEach(rule => {
            expect(receiver.id).toBe(rule.targetParticipantId);
          });
        });

        // All MUST NOT rules are respected
        result.pairings.forEach(({giver, receiver}) => {
          const mustNotRules = participants[giver.id].rules.filter(r => r.type === 'mustNot');
          
          mustNotRules.forEach(rule => {
            expect(receiver.id).not.toBe(rule.targetParticipantId);
          });
        });

        // No self-assignments unless required by MUST rule
        result.pairings.forEach(({giver, receiver}) => {
          if (giver.id === receiver.id) {
            const selfAssignmentRequired = participants[giver.id].rules.some(
              (r: Rule) => r.type === 'must' && r.targetParticipantId === giver.id
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
        const participants: Record<string, Participant> = {};
        for (let i = 0; i < size; i++) {
          const id = `person${i}`;
          participants[id] = {
            id,
            name: `Person${i}`,
            rules: Object.keys(participants).map(targetId => ({
              type: 'mustNot' as const,
              targetParticipantId: targetId
            }))
          };
        }

        const result = generatePairs(participants);
        expect(result).toBeNull();
      })
    );
  });

  it('should handle circular MUST rules correctly', () => {
    const participants: Record<string, Participant> = {
      'A': { id: 'A', name: 'A', rules: [{ type: 'must', targetParticipantId: 'B' }] },
      'B': { id: 'B', name: 'B', rules: [{ type: 'must', targetParticipantId: 'C' }] },
      'C': { id: 'C', name: 'C', rules: [{ type: 'must', targetParticipantId: 'A' }] },
    };

    const result = generatePairs(participants);
    expect(result?.pairings.map(({giver, receiver}) => [
      participants[giver.id],
      participants[receiver.id],
    ])).toEqual([
      [participants['A'], participants['B']],
      [participants['B'], participants['C']],
      [participants['C'], participants['A']],
    ]);
  });

  it('should return null for invalid rule configurations', () => {
    // Test multiple MUST rules
    const multiMustParticipants: Record<string, Participant> = {
      'A': { 
        id: 'A',
        name: 'A', 
        rules: [
          { type: 'must', targetParticipantId: 'B' },
          { type: 'must', targetParticipantId: 'C' }
        ] 
      },
      'B': { id: 'B', name: 'B', rules: [] },
      'C': { id: 'C', name: 'C', rules: [] },
    };

    expect(generatePairs(multiMustParticipants)).toBeNull();

    // Test conflicting MUST/MUST NOT rules
    const conflictingRulesParticipants: Record<string, Participant> = {
      'A': { 
        id: 'A',
        name: 'A', 
        rules: [
          { type: 'must', targetParticipantId: 'B' },
          { type: 'mustNot', targetParticipantId: 'B' }
        ] 
      },
      'B': { id: 'B', name: 'B', rules: [] },
    };

    expect(generatePairs(conflictingRulesParticipants)).toBeNull();
  });

  it('should support generating complex configurations', () => {
    const parseResult = parseParticipantsText(`
      Alice !Brian !Claire
      Brian !Alice !Claire
      Claire !Brian !Alice
      Ethan !Fiona !Grace !Hannah !Ivy !Jack !Kyle
      Fiona !Ethan !Grace !Hannah !Ivy !Jack !Kyle
      Grace !Fiona !Ethan !Hannah !Ivy !Jack !Kyle
      Hannah !Fiona !Grace !Ethan !Ivy !Jack !Kyle
      Ivy !Fiona !Grace !Hannah !Ethan !Jack !Kyle
      Kyle !Fiona !Grace !Hannah !Ethan !Jack !Ivy
      Logan !Sophie
      Sophie !Logan
      Matthew !Nina !Olivia !Paige !Quinn !Ryan
      Nina !Matthew !Olivia !Paige !Quinn !Ryan
      Olivia !Nina !Matthew !Paige !Quinn !Ryan
      Paige !Nina !Olivia !Matthew !Quinn !Ryan
      Jack !Fiona !Grace !Hannah !Ethan !Ivy !Kyle
      Quinn !Matthew !Nina !Olivia !Paige !Ryan
      Ryan !Quinn !Matthew !Nina !Olivia !Paige
    `);

    expect(parseResult.ok).toBe(true);
    const parseOk = parseResult as ParseSuccess;

    const result = generatePairs(parseOk.participants);
    expect(result).not.toBeNull();
  });

  it('should generate valid pairings for a given complex configuration', () => {
    const parseResult = parseParticipantsText(`
      Alice !Brian !Claire
      Brian !Alice !Claire
      Claire !Brian !Alice
      Ethan !Fiona !Grace !Hannah !Ivy !Jack !Kyle
      Fiona !Ethan !Grace !Hannah !Ivy !Jack !Kyle
      Grace !Fiona !Ethan !Hannah !Ivy !Jack !Kyle
      Hannah !Fiona !Grace !Ethan !Ivy !Jack !Kyle
      Ivy !Fiona !Grace !Hannah !Ethan !Jack !Kyle
      Kyle !Fiona !Grace !Hannah !Ethan !Jack !Ivy
      Logan !Sophie
      Sophie !Logan
      Matthew !Nina !Olivia !Paige !Quinn !Ryan
      Nina !Matthew !Olivia !Paige !Quinn !Ryan
      Olivia !Nina !Matthew !Paige !Quinn !Ryan
      Paige !Nina !Olivia !Matthew !Quinn !Ryan
      Jack !Fiona !Grace !Hannah !Ethan !Ivy !Kyle
      Quinn !Matthew !Nina !Olivia !Paige !Ryan
      Ryan !Quinn !Matthew !Nina !Olivia !Paige
    `);

    expect(parseResult.ok).toBe(true);
    const parseOk = parseResult as ParseSuccess;

    for (let t = 0; t < 100; t++) {
      const generationResult = generatePairs(parseOk.participants);

      expect(generationResult).not.toBeNull();
      const {pairings} = generationResult as GeneratedPairs;

      // Verify each participant gives and receives exactly once
      const givers = new Set(pairings.map(p => p.giver.id));
      const receivers = new Set(pairings.map(p => p.receiver.id));
      expect(givers.size).toBe(Object.keys(parseOk.participants).length);
      expect(receivers.size).toBe(Object.keys(parseOk.participants).length);

      // Verify no self-assignments
      for (const {giver, receiver} of pairings) {
        expect(giver.id).not.toBe(receiver.id);
      }

      // Verify all MUST NOT rules are respected
      for (const {giver, receiver} of pairings) {
        const participant = parseOk.participants[giver.id];
        const mustNotRules = participant.rules.filter(r => r.type === 'mustNot');
        
        for (const rule of mustNotRules) {
          expect(receiver.id).not.toBe(rule.targetParticipantId);
        }
      }

      // Verify all MUST rules are respected
      for (const {giver, receiver} of pairings) {
        const participant = parseOk.participants[giver.id];
        const mustRules = participant.rules.filter(r => r.type === 'must');

        for (const rule of mustRules) {
          expect(receiver.id).toBe(rule.targetParticipantId);
        }
      }
    }
  });
}); 

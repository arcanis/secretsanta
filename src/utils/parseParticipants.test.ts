import { describe, it, expect } from 'vitest';

import { parseParticipantsText, formatParticipantText } from './parseParticipants';
import { Participant } from '../types';

describe('parseParticipantsText', () => {
  it('should parse basic participant list', () => {
    const input = `
      Alice
      Bob
      Charlie
    `;

    const result = parseParticipantsText(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const participants = Object.values(result.participants);
    expect(participants).toHaveLength(3);
    expect(participants.map(p => p.name)).toEqual(['Alice', 'Bob', 'Charlie']);
    expect(participants.every(p => p.rules.length === 0)).toBe(true);
  });

  it('should parse participants with hints', () => {
    const input = `
      Alice (likes cats)
      Bob (allergic to chocolate)
      Charlie
    `;

    const result = parseParticipantsText(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const participants = Object.values(result.participants);
    expect(participants).toHaveLength(3);
    expect(participants.find(p => p.name === 'Alice')?.hint).toBe('likes cats');
    expect(participants.find(p => p.name === 'Bob')?.hint).toBe('allergic to chocolate');
    expect(participants.find(p => p.name === 'Charlie')?.hint).toBeUndefined();
  });

  it('should parse participants with rules', () => {
    const input = `
      Alice =Bob !Charlie
      Bob =Alice
      Charlie !Alice
    `;

    const result = parseParticipantsText(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const participants = Object.values(result.participants);
    const alice = participants.find(p => p.name === 'Alice');
    const bob = participants.find(p => p.name === 'Bob');
    const charlie = participants.find(p => p.name === 'Charlie');

    expect(alice?.rules).toHaveLength(2);
    expect(bob?.rules).toHaveLength(1);
    expect(charlie?.rules).toHaveLength(1);

    expect(alice?.rules[0]).toEqual({
      type: 'must',
      targetParticipantId: bob?.id
    });
    expect(alice?.rules[1]).toEqual({
      type: 'mustNot',
      targetParticipantId: charlie?.id
    });
  });

  it('should handle empty lines', () => {
    const input = `
      Alice

      Bob

      Charlie
    `;

    const result = parseParticipantsText(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const participants = Object.values(result.participants);
    expect(participants).toHaveLength(3);
  });

  it('should detect duplicate names', () => {
    const input = `
      Alice
      Bob
      Alice
    `;

    const result = parseParticipantsText(input);
    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.key).toBe('errors.duplicateName');
    expect(result.values?.name).toBe('Alice');
  });

  it('should detect unknown participants in rules', () => {
    const input = `
      Alice =Bob
      Bob !David
    `;

    const result = parseParticipantsText(input);
    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.key).toBe('errors.unknownParticipant');
    expect(result.values?.name).toBe('David');
  });

  it('should preserve existing IDs when provided', () => {
    const existingParticipants: Record<string, Participant> = {
      'Alice': {
        id: 'existing-alice-id',
        name: 'Alice',
        rules: []
      }
    };

    const input = `
      Alice
      Bob
    `;

    const result = parseParticipantsText(input, existingParticipants);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const alice = Object.values(result.participants).find(p => p.name === 'Alice');
    expect(alice?.id).toBe('existing-alice-id');
  });
});

describe('formatParticipantText', () => {
  it('should format participants back to text', () => {
    const participants: Record<string, Participant> = {
      'id1': {
        id: 'id1',
        name: 'Alice',
        hint: 'likes cats',
        rules: [
          { type: 'must', targetParticipantId: 'id2' },
          { type: 'mustNot', targetParticipantId: 'id3' }
        ]
      },
      'id2': {
        id: 'id2',
        name: 'Bob',
        rules: []
      },
      'id3': {
        id: 'id3',
        name: 'Charlie',
        rules: []
      }
    };

    const result = formatParticipantText(participants);
    expect(result).toBe(
      'Alice (likes cats) =Bob !Charlie\n' +
      'Bob\n' +
      'Charlie\n'
    );
  });
}); 
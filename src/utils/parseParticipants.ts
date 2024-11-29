import { Participant, Rule } from '../types';
import { checkRules } from './generatePairs';

export interface ParseSuccess {
  ok: true;
  participants: Record<string, Participant>;
}

export interface ParseError {
  ok: false;
  line: number;
  key: string;
  values?: Record<string, string>;
}

export type ParseResult = ParseSuccess | ParseError;

export function formatParticipantText(participants: Record<string, Participant>): string {
  return Object.values(participants).map(participant => {
    const mustRules = participant.rules
      .filter(r => r.type === 'must')
      .map(r => `=${participants[r.targetParticipantId]?.name ?? ''}`);

    const mustNotRules = participant.rules
      .filter(r => r.type === 'mustNot')
      .map(r => `!${participants[r.targetParticipantId]?.name ?? ''}`);

    return `${[participant.name, ...mustRules, ...mustNotRules].join(' ')}\n`;
  }).join('');
}

export function parseParticipantsText(input: string): ParseResult {
  const lines = input.split('\n').map(line => line.trim());
  const result: Record<string, Participant> = {};
  const nameToId: Record<string, string> = {};

  const parsedLines: {
    line: number,
    name: string,
    extra: string[],
  }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') continue;

    const parts = line
      .split(/([!=])/)
      .map(part => part.trim());

    const [name, ...extra] = parts;
    if (!name) {
      return { ok: false, line: i + 1, key: 'errors.emptyName' };
    }

    parsedLines.push({ line: i + 1, name, extra });
  }

  // First pass: create participants and build name-to-id mapping
  for (const {line, name} of parsedLines) {
    if (nameToId[name]) {
      return { 
        ok: false, 
        line,
        key: 'errors.duplicateName',
        values: { name } 
      };
    }

    const id = crypto.randomUUID();
    nameToId[name] = id;
    result[id] = { id, name, rules: [] };
  }

  // Second pass: process rules
  for (const {line, name, extra} of parsedLines) {
    const id = nameToId[name];
    const rules: Rule[] = [];

    for (let j = 0; j + 1 < extra.length; j += 2) {
      const targetName = extra[j + 1];
      if (!targetName) {
        continue;
      }

      const targetId = nameToId[targetName];
      if (!targetId) {
        return { 
          ok: false, 
          line,
          key: 'errors.unknownParticipant',
          values: { name: targetName } 
        };
      }

      rules.push({
        type: extra[j] === '=' ? 'must' : 'mustNot',
        targetParticipantId: targetId
      });
    }

    const validationError = checkRules(rules);
    if (validationError) {
      return { 
        ok: false, 
        line,
        key: validationError 
      };
    }

    result[id].rules = rules;
  }

  return { ok: true, participants: result };
} 
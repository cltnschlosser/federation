import { assert, MultiMap } from '@apollo/federation-internals';
import { HintCodeDefinition, HintLevel, HINTS } from './hints';

const header = `---
title: Federation Hints
sidebar_title: Hints
---

When you successfully [compose](./federated-types/composition) the schemas provided by your [subgraphs](./subgraphs/) into a **supergraph schema**, "hints" may provide additional information about the composition. Hints are first and foremost informative and don't necessarily correspond to a problem to be fixed.

Hints are categorized under the following levels:
1. WARN: indicates a situation that may be expected but is usually temporary and should be double-checked. Typically, composition might have had to ignore some elements from some subgraph when creating the supergraph.
2. INFO: information that may hint at some improvements or highlight noteworthy resolution made by composition but can otherwise be ignored.
3. DEBUG: lower-level information that gives insights into the composition but of lesser importance/impact.

Note that hints are first and foremost informative and don't necessarily correspond to a problem to be fixed.

This document lists the hints that can be generated for each level, with a description of why they are generated.
`;

function makeMarkdownArray(
  headers: string[],
  rows: string[][]
): string {
  const columns = headers.length;
  let out = '| ' + headers.join(' | ') + ' |\n';
  out += '|' + headers.map(_ => '---').join('|') + '|\n';
  for (const row of rows) {
    assert(row.length <= columns, `Row [${row}] has too columns (expect ${columns} but got ${row.length})`);
    const frow = row.length === columns
      ? row
      : row.concat(new Array<string>(columns - row.length).fill(''));
    out += '| ' + frow.join(' | ') + ' |\n'
  }
  return out;
}

const byLevel = Object.values(HINTS)
  .reduce(
    (acc, def) => {
      acc.add(def.level.value, def);
      return acc;
    },
    new MultiMap<HintLevel, HintCodeDefinition>(),
  );


const rows = Object.values(HINTS).map(def => [
  '`' + def.code + '`',
  def.description,
]);

const sortRowsByCode = (r1: string[], r2: string[]) => r1[0].localeCompare(r2[0]);

rows.sort(sortRowsByCode);

const hintsSectionHeader = `## Hints

The following hints might be generated during composition:`;

const hintsByLevel = [];

for (const level of [HintLevel.WARN, HintLevel.INFO, HintLevel.DEBUG]) {
  const levelName = HintLevel[level];
  const defs = byLevel.get(level);
  if (!defs) {
    continue
  }

  const rows = defs.map(def => [
    '`' + levelName + '`',
    '`' + def.code + '`',
    def.description,
  ]);
  hintsByLevel.push(`### ${levelName}`
    + '\n\n'
    + makeMarkdownArray(
      [ 'Level', 'Code', 'Description' ],
      rows,
    ));
}

console.log(
  header + '\n\n'
  + hintsSectionHeader + '\n\n'
  + hintsByLevel.join('\n\n')
);


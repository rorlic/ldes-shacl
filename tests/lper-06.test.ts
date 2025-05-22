import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectInfo, ExpectedResult, expectViolation, expectNoResult
} from './utilities';
import { maxCountConstraint } from './constraints';

describe('Test LPER-06 (ldes:versionOfPath usage)', async () => {
  const validator = await createValidator(['ldes-shapes.ttl']);
  const versionOfPathSuggested = 'https://w3id.org/ldes#EventStreamVersionOfPathSuggestedShape';
  const versionOfPathLimited = 'https://w3id.org/ldes#EventStreamVersionOfPathLimitedShape';
  const ldesVersionOfPath = 'https://w3id.org/ldes#versionOfPath';
  const exampleCollection = 'http://example.org/EventStream1';

  it('may have zero ldes:versionOfPath predicates', async () => {
    expectInfo({ sourceShape: versionOfPathSuggested, path: ldesVersionOfPath, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/lper-06/no-ldes-versionOf.ttl', validator));
  });

  it('may have a single ldes:versionOfPath predicate', async () => {
    const report = await validateFile('./tests/lper-06/single-ldes-versionOf.ttl', validator)
    expectNoResult(versionOfPathSuggested, report);
  });

  it('must not have multiple tree:Collection entities', async () => {
    expectViolation({ sourceShape: versionOfPathLimited, focusNode: exampleCollection, constraint: maxCountConstraint } as ExpectedResult,
      await validateFile('./tests/lper-06/multiple-ldes-versionOf.ttl', validator));
  });

});

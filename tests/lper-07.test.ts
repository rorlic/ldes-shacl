import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectInfo, ExpectedResult, expectViolation, expectNoResult
} from './utilities';
import { maxCountConstraint } from './constraints';

describe('Test LPER-07 (ldes:timestampPath usage)', async () => {
  const validator = await createValidator(['ldes-shapes.ttl']);
  const timestampPathSuggested = 'https://w3id.org/ldes#EventStreamTimestampPathSuggestedShape';
  const timestampPathLimited = 'https://w3id.org/ldes#EventStreamTimestampPathLimitedShape';
  const ldesTimestampPath = 'https://w3id.org/ldes#timestampPath';
  const exampleCollection = 'http://example.org/EventStream1';

  it('may have zero ldes:timestampPath predicates', async () => {
    expectInfo({ sourceShape: timestampPathSuggested, path: ldesTimestampPath, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/lper-07/no-ldes-timestampPath.ttl', validator));
  });

  it('may have a single ldes:timestampPath predicate', async () => {
    const report = await validateFile('./tests/lper-07/single-ldes-timestampPath.ttl', validator)
    expectNoResult(timestampPathSuggested, report);
  });

  it('must not have multiple tree:Collection entities', async () => {
    expectViolation({ sourceShape: timestampPathLimited, focusNode: exampleCollection, constraint: maxCountConstraint } as ExpectedResult,
      await validateFile('./tests/lper-07/multiple-ldes-timestampPath.ttl', validator));
  });

});

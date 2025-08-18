import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectWarning, ExpectedResult, expectViolation, expectNoResult
} from './utilities';
import { maxCountConstraint } from './constraints';

describe('Test LR2.2 (ldes:timestampPath usage)', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'LR2.2-ldes-timestampPath-usage.ttl']);
  const suggestedShape = 'https://w3id.org/ldes#EventStreamTimestampPathSuggestedShape';
  const limitedShape = 'https://w3id.org/ldes#EventStreamTimestampPathLimitedShape';
  const ldesTimestampPath = 'https://w3id.org/ldes#timestampPath';
  const exampleCollection = 'http://example.org/EventStream1';

  it('may have zero ldes:timestampPath predicates', async () => {
    expectWarning({ sourceShape: suggestedShape, path: ldesTimestampPath, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/LR2.2/no-ldes-timestampPath.ttl', validator));
  });

  it('may have a single ldes:timestampPath predicate', async () => {
    const report = await validateFile('./tests/LR2.2/single-ldes-timestampPath.ttl', validator)
    expectNoResult(suggestedShape, report);
  });

  it('must not have multiple ldes:timestampPath predicates', async () => {
    expectViolation({ sourceShape: limitedShape, focusNode: exampleCollection, constraint: maxCountConstraint } as ExpectedResult,
      await validateFile('./tests/LR2.2/multiple-ldes-timestampPath.ttl', validator));
  });

});

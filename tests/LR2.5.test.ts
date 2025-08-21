import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectInfo, ExpectedResult, expectViolation, expectNoResult
} from './utilities';
import { maxCountConstraint } from './constraints';

describe('Test LR2.5 (ldes:versionTimestampPath usage)', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'LR2.5-ldes-versionTimestampPath-usage.ttl']);
  const suggestedShape = 'https://w3id.org/ldes#EventStreamVersionTimestampPathSuggestedShape';
  const limitedShape = 'https://w3id.org/ldes#EventStreamVersionTimestampPathLimitedShape';
  const ldesSequencePath = 'https://w3id.org/ldes#versionTimestampPath';
  const exampleCollection = 'http://example.org/EventStream1';

  it('may have zero ldes:versionTimestampPath predicates', async () => {
    expectInfo({ sourceShape: suggestedShape, path: ldesSequencePath, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/LR2.5/no-ldes-versionTimestampPath.ttl', validator));
  });

  it('may have a single ldes:versionTimestampPath predicate', async () => {
    expectNoResult(suggestedShape, 
      await validateFile('./tests/LR2.5/single-ldes-versionTimestampPath.ttl', validator));
  });

  it('must not have multiple ldes:versionTimestampPath predicates', async () => {
    expectViolation({ sourceShape: limitedShape, focusNode: exampleCollection, constraint: maxCountConstraint } as ExpectedResult,
      await validateFile('./tests/LR2.5/multiple-ldes-versionTimestampPath.ttl', validator));
  });

});

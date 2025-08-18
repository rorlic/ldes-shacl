import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectInfo, ExpectedResult, expectViolation, expectNoResult
} from './utilities';
import { maxCountConstraint } from './constraints';

describe('Test LR2.3 (ldes:sequencePath usage)', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'LR2.3-ldes-sequencePath-usage.ttl']);
  const suggestedShape = 'https://w3id.org/ldes#EventStreamSequencePathSuggestedShape';
  const limitedShape = 'https://w3id.org/ldes#EventStreamSequencePathLimitedShape';
  const ldesSequencePath = 'https://w3id.org/ldes#sequencePath';
  const exampleCollection = 'http://example.org/EventStream1';

  it('may have zero ldes:sequencePath predicates', async () => {
    expectInfo({ sourceShape: suggestedShape, path: ldesSequencePath, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/LR2.3/no-ldes-sequencePath.ttl', validator));
  });

  it('may have a single ldes:sequencePath predicate', async () => {
    const report = await validateFile('./tests/LR2.3/single-ldes-sequencePath.ttl', validator)
    expectNoResult(suggestedShape, report);
  });

  it('must not have multiple ldes:sequencePath predicates', async () => {
    expectViolation({ sourceShape: limitedShape, focusNode: exampleCollection, constraint: maxCountConstraint } as ExpectedResult,
      await validateFile('./tests/LR2.3/multiple-ldes-sequencePath.ttl', validator));
  });

});

import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectWarning, ExpectedResult, expectViolation, expectNoResult
} from './utilities';
import { maxCountConstraint } from './constraints';

describe('Test LR2.4 (ldes:versionOfPath usage)', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'LR2.4-ldes-versionOfPath-usage.ttl']);
  const suggestedShape = 'https://w3id.org/ldes#EventStreamVersionOfPathSuggestedShape';
  const limitedShape = 'https://w3id.org/ldes#EventStreamVersionOfPathLimitedShape';
  const ldesVersionOfPath = 'https://w3id.org/ldes#versionOfPath';
  const exampleCollection = 'http://example.org/EventStream1';

  it('may have zero ldes:versionOfPath predicates', async () => {
    expectWarning({ sourceShape: suggestedShape, path: ldesVersionOfPath, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/LR2.4/no-ldes-versionOfPath.ttl', validator));
  });

  it('may have a single ldes:versionOfPath predicate', async () => {
    const report = await validateFile('./tests/LR2.4/single-ldes-versionOfPath.ttl', validator)
    expectNoResult(suggestedShape, report);
  });

  it('must not have multiple ldes:versionOfPath predicate', async () => {
    expectViolation({ sourceShape: limitedShape, focusNode: exampleCollection, constraint: maxCountConstraint } as ExpectedResult,
      await validateFile('./tests/LR2.4/multiple-ldes-versionOfPath.ttl', validator));
  });

});

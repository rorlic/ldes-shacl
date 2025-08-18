import { it, describe } from 'vitest';
import {
  expectMissingEntityViolation, expectViolation, expectNoViolation, validateFile,
  ExpectedResult, createValidator, expectWarning,
} from './utilities';

describe('Test LR2.1 (contains ldes:EventStream)', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'LR2.1-contains-ldes-EventStream.ttl']);
  const requiredShape = 'https://w3id.org/ldes#EventStreamTypeRequiredShape';
  const doubledTypedShape = 'https://w3id.org/ldes#EventStreamDoubleTypeShape';
  const focusNode = 'https://w3id.org/ldes#EventStream';
  const exampleNode = 'http://example.org/EventStream1';

  it('must not have zero ldes:EventStream entities', async () => {
    expectMissingEntityViolation(requiredShape,
      await validateFile('./tests/LR2.1/no-ldes-eventstream.ttl', validator));
  });

  it('must not have multiple ldes:EventStream entities', async () => {
    expectViolation({ sourceShape: requiredShape, focusNode: focusNode, path: undefined } as ExpectedResult,
      await validateFile('./tests/LR2.1/multiple-ldes-eventstreams.ttl', validator));
  });

  it('must have a single ldes:EventStream entity', async () => {
    expectNoViolation(requiredShape,
      await validateFile('./tests/LR2.1/single-ldes-eventstream.ttl', validator));
  });

  it('should not be double-typed with tree:Collection', async () => {
    expectWarning({ sourceShape: doubledTypedShape, focusNode: exampleNode },
      await validateFile('./tests/LR2.1/double-typed.ttl', validator));
  });
});

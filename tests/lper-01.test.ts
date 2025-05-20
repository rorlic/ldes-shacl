import { it, describe } from 'vitest';
import { 
  expectMissingEntityViolation, expectViolation, expectNoViolation, validateFile, 
  ExpectedResult, createValidator, 
} from './utilities';

describe('Test LPER-01 (contains ldes:EventStream)', async () => {
  const validator = await createValidator(['ldes-shapes.ttl']);
  const nodeShape = 'https://w3id.org/ldes#EventStreamTypeRequiredShape';
  const focusNode = 'https://w3id.org/ldes#EventStream';

  it('must not have zero ldes:EventStream entities', async () => {
    expectMissingEntityViolation(nodeShape, 
      await validateFile('./tests/lper-01/no-ldes-eventstream.ttl', validator));
  });

  it('must not have multiple ldes:EventStream entities', async () => {
    expectViolation({ sourceShape: nodeShape, focusNode: focusNode, path: undefined} as ExpectedResult, 
      await validateFile('./tests/lper-01/multiple-ldes-eventstreams.ttl', validator));
  });

  it('must have a single ldes:EventStream entity', async () => {
    expectNoViolation(nodeShape, 
      await validateFile('./tests/lper-01/single-ldes-eventstream.ttl', validator));
  });
});

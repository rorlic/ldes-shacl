import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectWarning, expectNoWarning, ExpectedResult
} from './utilities';

describe('Test LPER-04 (tree:shape usage)', async () => {
  const validator = await createValidator(['ldes-shapes.ttl']);
  const nodeShape = 'https://w3id.org/ldes#EventStreamShapeRecommendedShape';
  const exampleCollection = 'http://example.org/EventStream1';
  const treeShape = 'https://w3id.org/tree#shape';

  it('may have zero tree:shape predicates', async () => {
    expectWarning({ sourceShape: nodeShape, path: treeShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/lper-04/no-tree-shape.ttl', validator));
  });

  it('may have a single tree:shape predicate', async () => {
    const report = await validateFile('./tests/lper-04/single-tree-shape.ttl', validator)
    expectNoWarning(nodeShape, report);
  });

});

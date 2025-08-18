import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectWarning, expectNoWarning, ExpectedResult
} from './utilities';

describe('Test LR2.7 (tree:shape usage)', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'LR2.7-tree-shape-usage.ttl']);
  const nodeShape = 'https://w3id.org/ldes#EventStreamShapeRecommendedShape';
  const exampleCollection = 'http://example.org/EventStream1';
  const treeShape = 'https://w3id.org/tree#shape';

  it('may have zero tree:shape predicates', async () => {
    expectWarning({ sourceShape: nodeShape, path: treeShape, focusNode: exampleCollection } as ExpectedResult, 
      await validateFile('./tests/LR2.7/no-tree-shape.ttl', validator));
  });

  it('may have a single tree:shape predicate', async () => {
    expectNoWarning(nodeShape, 
      await validateFile('./tests/LR2.7/single-tree-shape.ttl', validator));
  });

});

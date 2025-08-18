import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectViolation, expectNoViolation
} from './utilities';

describe('Test LR2.9 (tree:member usage)', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'LR2.9-tree-member-usage.ttl']);
  const nodeShape = 'https://w3id.org/ldes#EventStreamMemberNodeKindShape';
  const focusNode = 'http://example.org/EventStream1';

  it('must not refer to blank node', async () => {
    expectViolation({ sourceShape: nodeShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.9/invalid-tree-member.ttl', validator));
  });

  it('must refer to named node', async () => {
    expectNoViolation(nodeShape,
      await validateFile('./tests/LR2.9/valid-tree-member.ttl', validator));
  });

});

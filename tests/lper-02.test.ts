import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectWarning, 
} from './utilities';

describe('Test LPER-02 (not double-typed)', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'ldes-LPER-02-not-double-typed.ttl']);
  const nodeShape = 'https://w3id.org/ldes#EventStreamDoubleTypeShape';
  const focusNode = 'http://example.org/EventStream1';

  it('should not be double-typed with tree:Collection', async () => {
    expectWarning({ sourceShape: nodeShape, focusNode: focusNode }, 
      await validateFile('./tests/lper-02/double-typed.ttl', validator));
  });

});

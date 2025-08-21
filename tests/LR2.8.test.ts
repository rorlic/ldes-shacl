import { it, describe } from 'vitest';
import { 
  validateFile, createValidator, expectViolation, expectWarning, expectNoResult, expectInfo
} from './utilities';

describe('Test LR2.8 (ldes:retentionPolicy usage) - in root node', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'LR2.8-ldes-retentionPolicy-usage-in-root-node.ttl']);
  const focusNode = 'http://example.org/view1';
  const suggestedShape = 'https://w3id.org/ldes#RetentionPolicySuggestedShape';
  const invalidShape = 'https://w3id.org/ldes#RetentionPolicyInvalidShape';
  const preferredShape = 'https://w3id.org/ldes#RetentionPolicyPreferredShape';

  it('should not contain no retention policy', async () => {
    expectWarning({ sourceShape: suggestedShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.8/no-retention-policy.ttl', validator));
  });

  it('should contain a retention policy', async () => {
    const report = await validateFile('./tests/LR2.8/single-retention-policy.ttl', validator);
    expectNoResult(suggestedShape, report);
    expectNoResult(invalidShape, report);
  });

  it('should preferably contain a retention policy on tree:view iso. on tree:viewDescription', async () => {
    const report = await validateFile('./tests/LR2.8/single-retention-policy-on-view-description.ttl', validator);
    expectNoResult(suggestedShape, report);
    expectNoResult(invalidShape, report);
    expectInfo({ focusNode: focusNode, sourceShape: preferredShape }, report)
  });

  it('must not contain multiple retention policies', async () => {
    expectViolation({ sourceShape: invalidShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.8/multiple-retention-policies.ttl', validator));
  });

  it('must not contain multiple retention policies on tree:viewDescription', async () => {
    expectViolation({ sourceShape: invalidShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.8/multiple-retention-policies-on-view-description.ttl', validator));
  });

  it('must not contain invalid retention policy', async () => {
    expectViolation({ sourceShape: invalidShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.8/invalid-retention-policy.ttl', validator));
  });

  it('must not contain invalid retention policy on tree:viewDescription', async () => {
    expectViolation({ sourceShape: invalidShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.8/invalid-retention-policy-on-view-description.ttl', validator));
  });

});

describe('Test LR2.8 (ldes:retentionPolicy usage) - in subsequent node', async () => {
  const validator = await createValidator(['ldes-common.ttl', 'LR2.8-ldes-retentionPolicy-usage-in-subsequent-node.ttl']);
  const focusNode = 'http://example.org/view1';
  const invalidShape = 'https://w3id.org/ldes#RetentionPolicyInvalidShape';

  it('must not contain multiple retention policies', async () => {
    expectViolation({ sourceShape: invalidShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.8/multiple-retention-policies.ttl', validator));
  });

  it('must not contain multiple retention policies on tree:viewDescription', async () => {
    expectViolation({ sourceShape: invalidShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.8/multiple-retention-policies-on-view-description.ttl', validator));
  });

  it('must not contain invalid retention policy', async () => {
    expectViolation({ sourceShape: invalidShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.8/invalid-retention-policy.ttl', validator));
  });

  it('must not contain invalid retention policy on tree:viewDescription', async () => {
    expectViolation({ sourceShape: invalidShape, focusNode: focusNode }, 
      await validateFile('./tests/LR2.8/invalid-retention-policy-on-view-description.ttl', validator));
  });

});

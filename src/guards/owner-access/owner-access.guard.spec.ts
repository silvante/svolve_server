import { OwnerAccessGuard } from './owner-access.guard';

describe('OwnerAccessGuard', () => {
  it('should be defined', () => {
    expect(new OwnerAccessGuard()).toBeDefined();
  });
});

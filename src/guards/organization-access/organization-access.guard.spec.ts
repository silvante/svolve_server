import { OrganizationAccessGuard } from './organization-access.guard';

describe('OrganizationAccessGuard', () => {
  it('should be defined', () => {
    expect(new OrganizationAccessGuard()).toBeDefined();
  });
});

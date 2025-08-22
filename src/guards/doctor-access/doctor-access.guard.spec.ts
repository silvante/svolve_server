import { DoctorAccessGuard } from './doctor-access.guard';

describe('DoctorAccessGuard', () => {
  it('should be defined', () => {
    expect(new DoctorAccessGuard()).toBeDefined();
  });
});

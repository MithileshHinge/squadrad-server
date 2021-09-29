import ValidationError from '../../common/errors/ValidationError';
import profilePicBuilder from '../../profile-pic/entity';

describe('Profile Pic Entity', () => {
  it('src file must exist', () => {
    const src = 'src/__tests__/__mocks__/profile-pic/sample-profile-pic.jpg';
    expect(profilePicBuilder.build(src)).toBeTruthy();

    const srcNonExisting = 'src/__tests__/__mocks__/profile-pic/non-existing-sample-profile-pic.jpg';
    expect(() => profilePicBuilder.build(srcNonExisting)).toThrow(ValidationError);
  });
});

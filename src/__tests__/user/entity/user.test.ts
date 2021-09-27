import faker from '../../../api/common/faker';
import userBuilder from '../../../api/user/entity';
import ValidationError from '../../../api/common/errors/ValidationError';

const validUserParams = {
  fullName: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(8),
};

describe('User entity', () => {
  describe('User Id validation', () => {
    it('User must have a userId', () => {
      expect(userBuilder.build(validUserParams).getId()).toBeTruthy();
      expect(() => userBuilder.build({ userId: '', ...validUserParams })).toThrow(ValidationError);
    });

    it('userID must be unique', () => {
      const userIdSet = new Set();
      for (let i = 0; i < 5; i += 1) {
        userIdSet.add(userBuilder.build(validUserParams).getId());
      }
      expect(userIdSet.size).toBe(5);
    });
  });

  describe('Full name validation', () => {
    describe('Full name must be >= 3 letters', () => {
      ['', 'a', 'ab', 'a ', 'a    ', '     a'].forEach((fullName) => {
        it(`should throw error for "${fullName}"`, () => {
          expect(() => userBuilder.build({
            ...validUserParams,
            fullName,
          })).toThrow(ValidationError);
        });
      });
    });

    describe('Full name must only contain alphabet and spaces', () => {
      ['1', '2', '0', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '_', '\'', '"', ';', '.', '/', '\\', '?', '!'].forEach((char) => {
        it(`should throw error for "asd${char}"`, () => {
          expect(() => userBuilder.build({ ...validUserParams, fullName: `asdfg${char}` })).toThrow(ValidationError);
          expect(() => userBuilder.build({ ...validUserParams, fullName: `asd ${char}` })).toThrow(ValidationError);
          expect(() => userBuilder.build({ ...validUserParams, fullName: `as${char}` })).toThrow(ValidationError);
        });
      });
    });

    describe('Full name must only single spaces between words', () => {
      ['as  dfg', 'as df  g', 'as  df   g'].forEach((fullName) => {
        it(`should throw error for "${fullName}"`, () => {
          expect(() => userBuilder.build({
            ...validUserParams,
            fullName,
          })).toThrow(ValidationError);
        });
      });
    });

    describe('Full name must be <= 50 characters', () => {
      ['asdfghjklqwertyuioplkjhgfdsazxcvbnmlkjhgfdsaqwertyq', 'asdfghjklq wertyuioplkjhgfdsa zxcvbnmlkjhg fdsaqwertyq'].forEach((fullName) => {
        it(`should throw error for ${fullName}`, () => {
          expect(() => userBuilder.build({
            ...validUserParams,
            fullName,
          })).toThrow(ValidationError);
        });
      });
    });
  });

  describe('User must have a valid email address', () => {
    ['', ' ', 'mithihi', 'mihbhg@', 'mibg hv nv@gmail.com', '@gmail.com', 'vghjhb@gmail'].forEach((email) => {
      it(`Should throw error for "${email}"`, () => {
        expect(() => userBuilder.build({ ...validUserParams, email })).toThrow(ValidationError);
      });
    });
  });

  describe('Password should be >= 8 characters', () => {
    ['', ' ', 'asa', 'as afsf', 'asf  '].forEach((password) => {
      it(`Should throw error for ${password}`, () => {
        expect(() => userBuilder.build({ ...validUserParams, password })).toThrow(ValidationError);
      });
    });
  });

  it('User must be built if valid (sanity check)', () => {
    const user = userBuilder.build(validUserParams);
    expect(user).toBeTruthy();
    expect(user.getId()).toBeTruthy();
    expect(user.getFullName()).toBeTruthy();
    expect(user.getEmail()).toBeTruthy();
    expect(user.getPassword()).toBeTruthy();
  });
});

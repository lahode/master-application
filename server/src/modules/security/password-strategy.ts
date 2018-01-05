import * as passwordValidator from 'password-validator';
import * as argon2 from 'argon2';

// Create a schema
const schema = new passwordValidator();

// Add properties to it
schema
  .is().min(10)                                   // Minimum length 10
  .has().uppercase()                              // Must have uppercase letters
  .has().lowercase()                              // Must have lowercase letters
  .has().digits()                                 // Must have digits
  .has().not().spaces()                           // Should not have spaces
  .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

/* Validate password strategy */
export class PasswordStrategy {
  public static validate(password:string) {
    return schema.validate(password, {list:true});
  }

  public static async getPasswordDigest(password: string) {
    console.log('PASSTOCREATE', password);
    return await argon2.hash(password);
  }
}

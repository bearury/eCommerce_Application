export function validationPassword(value: string): string[] {
  const resultMessages: string[] = [];

  const isLengthValid = value.length >= 8;
  const hasUppercaseLetter = /[A-Z]/.test(value);
  const hasLowercaseLetter = /[a-z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasNoWhitespace = value.trim() === value;

  const passMinLengthError = 'Password must be at least 8 characters long.';
  const oneUppercaseError = 'Password must contain at least one uppercase letter (A-Z).';
  const oneLowerCaseError = 'Password must contain at least one lowercase letter (a-z).';
  const oneDigitError = 'Password must contain at least one digit (0-9).';
  const passNoWhiteSpaceError = 'Password must not contain leading or trailing whitespace.';

  if (!isLengthValid) resultMessages.push(passMinLengthError);
  if (!hasUppercaseLetter) resultMessages.push(oneUppercaseError);
  if (!hasLowercaseLetter) resultMessages.push(oneLowerCaseError);
  if (!hasDigit) resultMessages.push(oneDigitError);
  if (!hasNoWhitespace) resultMessages.push(passNoWhiteSpaceError);

  return resultMessages;
}

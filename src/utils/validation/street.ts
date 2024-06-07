export function validationBase(value: string): string[] {
  const resultMessages: string[] = [];

  const regexFirstLetter = /^[A-Z]/;
  const isFirstLetterUppercase = regexFirstLetter.test(value);

  const isValidStreet = value.trim().length > 0;

  const textError = 'Must contain at least one character';
  const textErrorBegin = 'Must begin with a uppercase letter.';

  if (!isValidStreet) resultMessages.push(textError);
  if (!isFirstLetterUppercase) resultMessages.push(textErrorBegin);

  return resultMessages;
}

export function validationName(value: string): string[] {
  const resultMessages: string[] = [];

  const nameRegex = /^[a-zA-Z]+$/;
  const regexFirstLetter = /^[A-Z]/;

  const isValidName = nameRegex.test(value);
  const isFirstLetterUppercase = regexFirstLetter.test(value);

  const textError = 'Must contain at least one character and no special characters or numbers.';
  const textErrorBegin = 'Must begin with a uppercase letter.';

  if (!isValidName) resultMessages.push(textError);
  if (!isFirstLetterUppercase) resultMessages.push(textErrorBegin);

  return resultMessages;
}

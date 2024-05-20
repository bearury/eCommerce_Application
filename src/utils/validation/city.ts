export function validationCity(value: string): string[] {
  const resultMessages: string[] = [];

  const regexFirstLetter = /^[A-Z]/;
  const isFirstLetterUppercase = regexFirstLetter.test(value);
  const cityRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;
  const isValidCity = cityRegex.test(value);

  const textError = 'Must contain at least one character and no special characters or numbers';
  const textErrorBegin = 'Must begin with a uppercase letter.';

  if (!isValidCity) resultMessages.push(textError);
  if (!isFirstLetterUppercase) resultMessages.push(textErrorBegin);

  return resultMessages;
}

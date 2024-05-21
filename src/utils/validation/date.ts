export function validationDate(value: string): string[] {
  const resultMessages: string[] = [];
  const userDate = new Date(value);
  const currentDate = new Date();
  const minAge = 13;
  const userAge = currentDate.getFullYear() - userDate.getFullYear();
  const isBirthdayPassed =
    currentDate.getMonth() > userDate.getMonth() ||
    (currentDate.getMonth() === userDate.getMonth() && currentDate.getDate() >= userDate.getDate());
  const isValidAge = userAge > minAge || (userAge === minAge && isBirthdayPassed);

  const textError = 'You must be 13 years old or older.';

  if (!isValidAge) resultMessages.push(textError);

  return resultMessages;
}

export function validationEmail(value: string): string[] {
  const resultMessages: string[] = [];
  const emailRegex =
    /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const isValidEmailInput = emailRegex.test(value);
  const noWhiteSpace = value.trim() === value;
  const domainRegex = /@[^\s@]+\.[^\s@]{2,}$/;
  const hasDomain = domainRegex.test(value);
  const atIndex = value.indexOf('@');
  const dotIndex = value.lastIndexOf('.');
  const hasValidAtSymbol = atIndex > 0 && dotIndex > atIndex;

  const messageIsValidEmailInput = 'Email address must be properly formatted (e.g., user@example.com).';
  const messageNoWhiteSpace = 'Email address must not contain leading or trailing whitespace.';
  const messageHasDomain = 'Email address must contain a domain name (e.g., example.com).';
  const messageHasValidAtSymbol = 'Email address must contain an "@" symbol separating local part and domain name.';

  if (!noWhiteSpace) {
    resultMessages.push(messageNoWhiteSpace);
  }
  if (!hasDomain) {
    resultMessages.push(messageHasDomain);
  }
  if (!hasValidAtSymbol) {
    resultMessages.push(messageHasValidAtSymbol);
  }

  if (!isValidEmailInput && !resultMessages.length) {
    resultMessages.push(messageIsValidEmailInput);
  }

  return resultMessages;
}

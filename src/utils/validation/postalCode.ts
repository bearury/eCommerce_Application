import { ItemDropdownTitle } from '../../components/dropdown/dropdown';

export function validationPostalCode({ value, country }: { value: string; country: ItemDropdownTitle }): string[] {
  const resultMessages: string[] = [];

  let regex: RegExp;
  let isValid: boolean = false;
  let textError: string;

  switch (country) {
    case ItemDropdownTitle.USA:
      regex = /^\d{5}(?:[-\s]\d{4})?$/;
      textError = 'Must follow the format: e.g., 12345 or 12345-6789';
      break;
    case ItemDropdownTitle.DE:
      regex = /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/;
      textError = 'Must follow the format: e.g., 12345';
      break;
    default:
      regex = /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/i;
      textError = 'Must follow the format: e.g., SW1W 0NY';
      break;
  }

  isValid = regex.test(value);

  if (!isValid) resultMessages.push(textError);

  return resultMessages;
}

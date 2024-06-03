import { TypedMoney } from '@commercetools/platform-sdk/dist/declarations/src/generated/models/common';

export default function converterPrice(value: TypedMoney): string {
  const { centAmount, fractionDigits } = value;
  return (centAmount / 100).toFixed(fractionDigits);
}

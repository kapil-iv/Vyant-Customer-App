import { formatCurrency } from "../utils/currency";

export function Price({ value }) {
  return <span>{formatCurrency(value)}</span>;
}

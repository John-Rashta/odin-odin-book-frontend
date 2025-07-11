import { AmountOptions } from "./interfaces";
import { enIN } from "date-fns/locale";
import { Locale } from "date-fns/locale";

const getProperQuery = function getQueryFromAmountAndSkip(
  options: AmountOptions,
) {
  return `${options.amount || options.skip ? "?" : ""}${options.amount ? `&amount=${options.amount}` : ""}${options.skip ? `&skip=${options.skip}` : ""}`;
};

const formatRelativeLocale = {
  lastWeek: "'Last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'Today at' p",
  tomorrow: "'Tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "Pp",
};

const locale: Locale = {
  ...enIN,
  formatRelative: (token) => formatRelativeLocale[token],
};

export { getProperQuery, locale };

import { AmountOptions } from "./interfaces";

const getProperQuery = function getQueryFromAmountAndSkip(options: AmountOptions) {
    return `${options.amount ? `&amount=${options.amount}` : ""}${options.skip ? `&skip=${options.skip}` : ""}`;
};

export {
    getProperQuery,
};
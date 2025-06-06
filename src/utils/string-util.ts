export const extractThinkContent = (input: string): string => {
  const regex = /<think>(.*?)<\/think>/gs;
  const match = input.match(regex);
  return match ? match[0] : '';
};

export const extractNormalContent = (input: string): string => {
  const regex = /<think>(.*?)<\/think>/gs;
  return input.replace(regex, '');
};

export const extractLocaleRuleContent = (input: string): string => {
  const regex = /<locale_rule>(.*?)<\/locale_rule>/gs;
  const match = input.match(regex);
  return match ? match[0] : '';
};

export const extractUserContent = (input: string): string => {
  const regex = /<locale_rule>(.*?)<\/locale_rule>/gs;
  return input.replace(regex, '');
};
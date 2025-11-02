import emojiRegex from "emoji-regex";

export function formatMessageTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export const isSingleEmoji = (text: string): boolean | null => {
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;

  const matches = trimmed.match(emojiRegex());

  return matches && matches.length === 1 && matches[0] === trimmed;
};

export const RENN_X_URL = "https://x.com/RennFinance";

export const RENN_TWEET_URL_ERROR =
  "Please paste a link to the latest Renn Finance tweet to join the whitelist.";

// Check the account and post-link format, not a specific post or its publication date.
const RENN_TWEET_URL_RE =
  /^(?:https?:\/\/)?(?:www\.)?x\.com\/rennfinance\/status\/[^/?#\s]+(?:[/?#][^\s]*)?$/i;

export function isRennTweetUrl(value: string): boolean {
  return RENN_TWEET_URL_RE.test(value.trim());
}

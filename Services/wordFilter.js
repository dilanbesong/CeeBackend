function replaceWordsWithEmpty(inputString, wordsToReplace) {
  // Create a regular expression pattern by joining array elements with '|'
  const pattern = new RegExp(wordsToReplace.join("|"), "gi");

  // Replace the matched words with an empty string
  const replacedString = inputString.replace(pattern, "");

  return replacedString;
}

// Example usage
const input = "Hello, this is a test string containing some unnecessary words.";
const wordsToRemove = ["is", "a", "some"];

const result = replaceWordsWithEmpty(input, wordsToRemove);
export { replaceWordsWithEmpty }

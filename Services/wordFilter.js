function filterWords(text) {
  const wordSize = text.split(" ");
  const newWord = wordSize.reduce((str, word) => {
    if (forbiddenWords.includes(word)) {
      return text.replace(word, "xxx");
    }
    return text;
  }, "");

  return newWord;
}
 export { filterWords }
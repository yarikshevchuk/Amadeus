let defaultTokens = 448;
let randNumbers = [
  34, 51, 151, 134, 122, 84, 75, 200, 212, 43, 5, 18, 183, 240,
];
let limit = 125000;
let promptTokens = 448;
let totalTokens = 0;
let requests = 0;
let totalUse = 0;

while (totalUse <= limit) {
  let completionTokens =
    randNumbers[Math.floor(Math.random() * randNumbers.length)];

  totalTokens += completionTokens;
  totalTokens += promptTokens;

  totalUse += completionTokens;
  totalUse += promptTokens;

  promptTokens += completionTokens;
  requests++;

  if (totalTokens >= 2096) {
    promptTokens = 448 + 300;
    totalTokens = promptTokens + completionTokens;
  }
}

console.log(`Total use: ${totalUse}`);
console.log(`Requests: ${requests}`);

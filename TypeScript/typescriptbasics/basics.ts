// The core primitive types in TypeScript are all lowercase!

function add(n1: number, n2: number, showResult: boolean, phrase: string) {
  //   if (typeof n1 !== "number" || typeof n2 !== "number") {
  //     throw new Error("Incorrect input!");
  //   }
  const result = n1 + n2;
  if (showResult) {
    console.log(phrase, result);
  } else {
    return result;
  }
}

//type inference: typescript knows and tries it's best to 'infer' what type belongs to a nonstrictly typed variable

//redundant👇
let number1: number;
number1 = 5;

const number2 = 2.8;
const printResult = true;
let resultPhrase = "Result is: ";

add(number1, number2, printResult, resultPhrase);

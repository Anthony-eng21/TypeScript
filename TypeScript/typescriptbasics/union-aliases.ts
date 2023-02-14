//type alias with some union type
//nice for being clear with our intentions and is nice for auto-completion
type Combinable = number | string;

//could also use this in place of : 'as-number' | 'as-text'
// type ConversionDescriptor = "as-number" | "as-text";

function combine(
  //union types
  input1: Combinable,
  input2: Combinable,
  //using this in the context of a literal/inference and union type simultaneously in our logic😶‍🌫️
  resultConversion: "as-number" | "as-text"
) {
  let result;
  if (
    (typeof input1 === "number" && typeof input2 === "number") ||
    resultConversion === "as-number"
  ) {
    //number logic true for 'as-number' when called
    result = +input1 + +input2;
  } else {
    //otherwise string logic for 'as-text' when called
    result = input1.toString() + input2.toString();
  }
  return result;
  // if(resultConversion === 'as-number'){
  //   return parseFloat(result);
  // } else  {
  //   return result.toString();
  // }
}

//nums
const combineAges = combine(30, 26, "as-number");

console.log(combineAges);

//still executes as a number
const combineStringAges = combine("30", "26", "as-number");
console.log(combineStringAges + " dis a string homes");

//strings
const combineNames = combine("Tony", " & Hailey", "as-text");

//possible because of union types
console.log(combineNames);

//magic of the type keyword
// function greet(user: { name: string; age: number }) {
//   console.log('Hi, I am ' + user.name);
// }

// function isOlder(user: { name: string; age: number }, checkAge: number) {
//   return checkAge > user.age;
// }
// To:

// type User = { name: string; age: number };

// function greet(user: User) {
//   console.log('Hi, I am ' + user.name);
// }

// function isOlder(user: User, checkAge: number) {
//   return checkAge > user.age;
// }

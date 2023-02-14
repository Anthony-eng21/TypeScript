// const userName = "Tony";
// userName = 't'
// let age = 20;

// age = 19;

function add(a: number, b: number) {
  let result;
  result = a + b;
  return result;
}

// if (age > 20) {
//   let isOld = true;
// }
// console.log(isOld);

//b with a default value
//! default arguments are not skipped when you call an argument
//this will break our code 👇
//i.e const add2 = (a: number = 1, b: number) => a + b;
// const add2 = (a: number, b: number = 1) => a + b;

// console.log(add2(1, 2));

//function types but in arrow() syntax
// const printOutput: (a: string | number) => void = (output) =>
//   console.log(output);

// const button = document.querySelector("button")! as HTMLButtonElement;

// if (button) {
//   button.addEventListener("click", (event) => {
//     console.log(event);
//   });
// }

// //this function takes in returned result of add2()
// //only need to pass one arg because we have some default
// //params for the second arg in add2()
// printOutput(add2(10));

//spread on reference types
const hobbies = ["Sports", "Cooking", "cheetah"];

const activeHobbies = ["Hiking"];

activeHobbies.push(...hobbies);

const person = {
  firstName: "Tony",
  age: 19,
};

//good copy of that object with same key: value types intead of a pointer at it in memory
const copiedPerson = { ...person };

//rest parameters: add as many arguments you want on the CB or set as many as you want with the tuple syntax
const add2 = (...numbers: number[]) => {
  return numbers.reduce((curResult, curValue) => {
    return curResult + curValue;
  }, 0);
};

const addedNumbers = add2(5, 10, 12, 35);

console.log(addedNumbers);

//destructuring

// const hobby1 = hobbies[0];
// const hobby2 = hobbies[1];
// that but shorter 👆 w destructuring

//destructuring doesn't change the original array in address nor memory just makes a copy of said arr
const [hobby1, hobby2, ...remainingHobbies] = hobbies;

console.log(hobbies, hobby1, hobby2);

const { firstName: userName, age } = person;

console.log(userName, age, person);

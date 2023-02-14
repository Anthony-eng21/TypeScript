//function types (the type we want to return from this function)
// function add(n1: number, n2: number): number{
//     return n1 + n2;
// }

function add(n1: number, n2: number) {
  return n1 + n2;
}

//void means this function does not return anything but IS NOT NULL
function printResult(num: number): void {
  console.log("Result is: " + num);
}

//the call back has to meet this condition of haaving a number as an arg/param
function addAndHandle(n1: number, n2: number, callBack: (num: number) => void) {
  const result = n1 + n2;
  callBack(result);
}

printResult(add(5, 12));

//creating a function type (similiar to => ())
//we're saying combine values wil take in any function that has two arguments and will return a number👇
let combineValues: (a: number, b: number) => number;

combineValues = add;
// combineValues = printResult;
// combineValues = 5;

console.log(combineValues(8, 8));

//undefined is a valid type in typescript is nice if you return without
//value like quitting some execution(guard action)
// let someValue: undefined;

//ts knows that result is a number because we strictly said so in the callBack that it would get a number for an arg
addAndHandle(10, 20, (result) => {
  console.log(result);
});

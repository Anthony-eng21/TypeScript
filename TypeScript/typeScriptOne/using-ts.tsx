//! at the end of some expression means that "this" will never yield null
// as HTMLInputElement === type casting

var button = document.querySelector("button")!;
var input1 = document.getElementById("num1")! as HTMLInputElement;
var input2 = document.getElementById("num2")! as HTMLInputElement;

function add(num1: number, num2: number) {
  return num1 + num2;
}

button.addEventListener("click", function () {
  console.log(add(+input1.value, +input2.value));
});
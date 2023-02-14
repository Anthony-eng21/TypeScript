//watchmode tsc app.ts --watch && -w to watch one file

//dont need the if check if we have the exclamation mark at the end of this nullish expression
const button = document.querySelector("button")! as HTMLButtonElement;

function clickHandler(message: string){
  console.log('Clicked!' + message)
}

//this condition checks for button's truthy value
if (button) {
  button?.addEventListener("click", clickHandler.bind(null, 'clicked'));
}

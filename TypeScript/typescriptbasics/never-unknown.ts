//unknown type better than any (ensures extra type checks and availability)
let userInput: unknown;
let userName: string;

(userInput = 5), (userInput = "Tony"), (userInput = "Hailey");

//extra type check with unknown to be able to assign an unknown value to a value with a fixed type to the same type
if (typeof userInput === "string") {
  userName = userInput;
}

//never type newer but void is typically assumed. never returns nothing and is meant to break prod
function generateError(message: string, code: number): never {
    throw {
      message: message,
      code: code,
    };
//   while (true) {}
}

const result = generateError("An error occurred!", 500);

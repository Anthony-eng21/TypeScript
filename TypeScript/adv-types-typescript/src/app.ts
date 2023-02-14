//intersection operator for objects =>
//intersection types allow us to combine types
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

//close to interface inheritance
// i.e interface ElevatedEmployee extends Employee, Admin {}

//gets both type properties
type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "tony",
  privileges: ["create-server"],
  startDate: new Date(),
};

//intersection operator for union types =>
type Combinable = string | number;
type Numeric = number | boolean;

//Universal's type: number because union types here intersect on number
type Universal = Combinable & Numeric;

//function overloads
//this add() works when we call with two matching primitive types or make a combination
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: Combinable, b: Combinable) {
  //type guard for this union type(!needed)
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  } //number type
  return a + b;
}

const result = add("max", "shwarz");
result.split(" ");

//optional chaining checking if some property is set or undefined

const fetchedUserData = {
  id: "u1",
  name: "Tony",
  job: { title: "CEO", description: "My own company" },
};

//avoid runtime errors in js common practice
//basically checks if the previous thing is defined if true returns it and keeps digging
console.log(fetchedUserData?.job?.title);

//nullish coalescing helps with nullish and undefined values 

const userInput = null;

//if right operand is null || undefined use the left as the fallback
const storedData = userInput ?? "Default";

console.log(storedData);

// type UnknownEmployee = Employee | Admin;

// function printEmployeeInfo(emp: UnknownEmployee) {
//   console.log("Name: " + emp.name);
//   //"in" key-word checks if a property is in this object
//   if ("privileges" in emp) {
//     console.log("Privileges: " + emp.privileges);
//   }
//   //"in" key-word checks if a property is in this object
//   if ("startDate" in emp) {
//     console.log("Start Date: " + emp.startDate);
//   }
// }

// // printEmployeeInfo(e1);

// printEmployeeInfo({
//   name: "Hailey",
//   startDate: new Date(),
//   privileges: ["create-admin"],
// });

// class Car {
//   drive() {
//     console.log("Driving... ");
//   }
// }

// class Truck {
//   drive() {
//     console.log("Trucking...");
//   }

//   loadCargo(amount: number) {
//     console.log("Loading Cargo... " + amount + " Pounds");
//   }
// }

// type Vehicle = Car | Truck;

// const v1 = new Car();
// const v2 = new Truck();

// const useVehicle = (vehicle: Vehicle) => {
//   vehicle.drive();
//   //add type guard because this method isnt available without it
//   // if ("loadCargo" in vehicle) {
//   //   vehicle.loadCargo(2000);
//   // }
//   if (vehicle instanceof Truck) {
//     //true if vehicle was created and used as a truck contructor function
//     vehicle.loadCargo(2000);
//   }
// };

// useVehicle(v1);
// useVehicle(v2);

// //interface discriminated unions

// interface Bird {
//   //literal type assignment shows what object we want to work with
//   type: "bird";
//   flyingSpeed: number;
// }

// interface Horse {
//   type: "horse";
//   runningSpeed: number;
// }

// type Animal = Bird | Horse;

// //very useful pattern when working with objects and union types
// function moveAnimal(animal: Animal) {
//   let speed;
//   switch (animal.type) {
//     case "bird":
//       speed = animal.flyingSpeed;
//       break;
//     case "horse":
//       speed = animal.runningSpeed;
//   }
//   console.log("Moving at speed: " + speed);
// }

// //now sensitive to travel '{type}' thanks to discriminated unions
// moveAnimal({ type: "bird", flyingSpeed: 10 });

// // type casts makes it so that this will never yield null

// // const userInputElement = <HTMLInputElement>document.getElementById("user-id")

// const userInputElement = document.getElementById("cheese");

// if (userInputElement) {
//   (userInputElement! as HTMLInputElement).value = "hi there";
// }

// //index properties

// //good for not knowing what we want the properties to be called just their types
// interface ErrorContainer {
//   // { email: 'not a valid email', username: 'Must Start with a letter' }
//   //multiple objects props where the index name is a string and the value is a string
//   [prop: string]: string;
// }

// const errorBag: ErrorContainer = {
//   email: "not a valid email!",
//   username: "must start with a capital letter",
// };

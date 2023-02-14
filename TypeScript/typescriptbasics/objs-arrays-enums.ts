//TS does this behind the scenes to infer what type object or values you could be using in our code
// const person: {
//   name: string;
//   age: number;
// } = {;
// const person: {
//   name: string;
//   age: number,
//   hobbies: string[];
//   //tuple: An arr with fixed length and types👇
//   role: [number, string]
// } = {
//   name: "Tony",
//   age: 30,
//   hobbies: ["Sports", "Cooking"],
//   role: [2, "author"],
// };


// enums to the rescue
//enums are enumerable this means they keep count of each 'member'
//great contructs when we need identifiers that are ezReadable 

// global variables in js😶 
// const ADMIN = 0;
// const READ_ONLY = 1;
// const AUTHOR = 2;

enum Role {
  ADMIN = "ADMIN",
  READ_ONLY = 100,
  AUTHOR = 'AUTHOR',
}

const person = {
  name: "Tony",
  age: 30,
  hobbies: ["Sports", "Cooking"],
  role: Role.AUTHOR,
};

// person.role.push("admin"); how come this works? Push is an exception because we mutate instead of replace?
// person.role[1] = 10; //ERROR

// person.role = [0, 'admin', 'user'] //ERROR

let favoriteActivities: string[];
favoriteActivities = ["Sports"];

console.log(person.name);

for (const hobby of person.hobbies) {
  //typescript infers a string array so we can use this string method here
  console.log(hobby.toUpperCase());
  // console.log(hobby.map()); // !!ERROR!!(map doesn't exits on type 'string')
}

if (person.role === Role.AUTHOR) {
  console.log('isAuthor');
}

// //!any type! doesn't make sense to use in ts because we want more strict type data and management

// let favoriteActivities: any[];
// favoriteActivities = ["Sports", 63];
// console.log(person.name);

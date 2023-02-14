//they give us flexibility and strong type safety with generics //Godly

// //type that uses another type and we pass one type to another like here in this string[]
// const names: Array<string> = []; //string[]
// // names[0].split(' '); //now we can use some string methods here because the assignment was to string[]

// //this is a generic string passed into a main Promise type
// //we get really good type safety with generic types super super configurable
// const promise: Promise<string> = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("Hailey💖");
//   }, 2000);
// });

// promise.then((data) => {
//   data.split(" ");
// });

//generic functions

//this helps us narrow down the object we want to return instead of casting to a new anonymous object w/o type safe props
//pass extra info to the merge() this helps us work better with the result of the merge() //META
//type constraints after extends keyword kinda like class based react. adds very good type safety
function merge<T extends object, U extends object>(objA: T, ObjB: U) {
  return { ...objA, ...ObjB };
}

//stores intersected data of these two inputs and is set dynamically for configurability
const mergedObj = merge(
  { name: "🌸Hailey💖", hobbies: ["snowboarding🏂", "Running🏃‍♀️"] },
  { age: 19 }
);
const mergedObj2 = merge(
  { name: "🤯Tony🤑", hobbies: ["Coding👨‍💻", "snowboarding🏂"] },
  { age: 19 }
);

console.table(mergedObj);
console.table(mergedObj2);

//this insures we get a length prop on element
interface lenghty {
  length: number;
}

//we dont really care what kind of data we get here we just want to make some length property accessible
function countAndDescribe<T extends lenghty>(element: T): [T, string] {
  let descriptionText = "Got no value.";
  if (element.length === 1) {
    descriptionText = "Got 1 element";
  } else if (element.length > 1) {
    descriptionText = "Got " + element.length + " element.";
  }
  return [element, descriptionText];
}

console.log(countAndDescribe(["grime"]));

//guaranteeds a key of our object in our T type in the U param
function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return "Value: " + obj[key];
}

//ensures that we try to access a property we are sure that exists in this object
extractAndConvert({ name: "🌸Hailey💖" }, "name")

//generic classes make classes super strongly typed in terms of type assignment when instanciated
//constraints for checking implicitily for primitive types in our generic class(not rn tho)
class DataStorage<T extends string | number | boolean | object> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  //most common practice to avoid weird js behavior with ref types and memory
  removeItem(item: T) {
    //this happens because when we called this before, the delete process
    //wouldn't delete the selected obj but the last added element to the array
    if (this.data.indexOf(item) - 1) {
      return;
    }
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

//different dataStorage based on types thanks to generic Classes
// const textStorage = new DataStorage<string>();

// textStorage.addItem("🌸Hailey💖");
// textStorage.addItem("Tony");
// textStorage.removeItem("Tony");
// console.log(textStorage.getItems());

// const numberStorage = new DataStorage<number>();

const objectStorage = new DataStorage<object>();

const tonyObject = { name: "Tony" };
objectStorage.addItem(tonyObject);
objectStorage.addItem({ name: "🌸Hailey💖" });
//...
// have to make this a constant variable because we need it to remain the same object in memory
objectStorage.removeItem(tonyObject);
console.log(objectStorage.getItems());

//Generic Utility Types: take something of any type and do something with it

interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

//Partial wraps our custom type makes it so all the properties are optional
function createCourseGoal(
  title: string,
  description: string,
  completeUntil: Date
): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {};
  courseGoal.title = title;
  courseGoal.description = description;
  courseGoal.completeUntil = completeUntil;
  return courseGoal as CourseGoal;
}

//this tells ts we have a readonly immutable string[]
const names: Readonly<string[]> = ["🌸Hailey💖", "Tony👨‍💻"];
// name.push("Tiny");

console.log(
  createCourseGoal("Journal Entry", "something happened today", new Date())
);

//generic types lock in on the type flexible in construction 
//union types are used for flexibility for using different types more frequently in our code for various tasks 
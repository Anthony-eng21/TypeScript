// type AddFn = (a: number, b: number) => number; interfaces to the rescue(interface FN type)

//using an interface as a function type
interface AddFn {
  //anon function in our interface
  (a: number, b: number): number;
}

let add: AddFn;

add = (n1: number, n2: number) => {
  return n1 + n2;
};

//describes the structure of an object
//cant have any initial value with its properties
//used to share functionality over many classes
interface Named {
  //optional property of an interface(?) before type assignment
  readonly name?: string;
  outputName?: string;
}

//extending an interface: inherit from multiple interfaces to make a joined interface unlike classes
interface Greetable extends Named {
  greet(phrase: string): void;
}

//unlike parent classes you can implement multiple interfaces for some class
//but have to set the conditions sepcified by the interface
class Person implements Greetable {
  name?: string;
  age = 30;

  //constructor() opt param allows us to set undefined for this Class's Instance
  constructor(n?: string) {
    if (n) {
      this.name = n;
    } else {
      console.log("Undefined argument");
    }
  }

  greet(phrase: string) {
    console.log(phrase + " " + this.name);
  }
}

//use the interface as a type because the Person object we store in the user1 obj implements the Greetable interface
let user1: Greetable;

user1 = new Person();

user1.greet("hi there i am -");

console.log(user1);

// //decorators are just functions you can add to something
// //adding this decorator to the class as a whole

// //pass the constructor as the whole which is the target
// function Logger(constructor: Function) {
//   console.log("Logging...");
//   console.log(constructor); // Classes are just syntatic sugar for constructor();
// }

// //@ symbole before the function we point to
// //decorators execute when are classes are defined and not when instanciated
// @Logger
// class Person {
//   name = "Tony";

//   constructor() {
//     console.log("Creating person object...");
//   }
// }

// // const pers = new Person();

function Logger(logString: string) {
  //this is the same as before but in a function factory
  //we have to call the decorator now as a function instead of pointing at it
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

//new decorator factory //template of html, where we want to render it into the DOM
//this decorator is a tool that other devs are forced to use when working with this class(es) that it's assigned to
function withTemplate(template: string, hookId: string) {
  //this is the actual decorator (constructor)
  return function <T extends { new (...args: any[]): { name: string } }>( //instance oriented
    originalConstructor: T
  ) {
    console.log("Rendering Template");
    //Class and method decorators are capable of returning something
    //returning a new class/contructor based on the orginal constructor function prototype?
    return class extends originalConstructor {
      //args isn't really available here so we use this default is not null _ common practice as many params as possible
      constructor(..._: any[]) {
        //logic for this returned(new) class constructor
        super(); //saves the orginal class
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          //assuming we always find an h1 element render this property on the instance of this object
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

//this is nice so we can pass our own custom values to the decorator
//more power and possibility with decorator factories that return a function (very nice)

//stacked decorator factories run from the bottom up
@Logger("LOGGING")
@withTemplate("<h1>My Person Object</h1>", "app") //First arg is what we inject(HTML).
//Second arg is where it gets passed into on the dom.(<div id="app"></>)
class Person {
  name = "🌸Hailey Baby🌸";

  constructor() {
    console.log("Creating a Person Object");
  }
}

//we have instanciate this class because w/o it
const me = new Person();
console.log(me);

// ---

//add a decorator to a property =  "title"
//target is either the prototype or whatever this target it is so we set to any
//propertyName is for the title prop on this product class
function Log(target: any, propertyName: string | Symbol) {
  console.log("Property decorator!"); //executes when our class definition is registered by js i.e when we call this property here for the title prop
  console.log(target, propertyName); //sets the target for this and the property
}

//decorator on an accesory type
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("ACCESSOR DECORATOR!");
  console.log(target); //prototype we are targeting
  console.log(name); //price
  console.log(descriptor); //gives us a detailed description of this property
}

//target: instance ? when we want to use this on some instance else it's any
//returns writeable and value unlike the accessory type since this is a js difference in types
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("METHOD DECORATOR!");
  console.log(target); //prototype we are targeting
  console.log(name); //price
  console.log(descriptor); //gives us a detailed description of this property
}

function Log4(target: any, name: string | Symbol, position: number) {
  console.log("PARAMETER DECORATOR!");
  console.log(target); //prototype we are targeting
  console.log(name); //getPriceWithTax
  console.log(position); // 0
}

//adding decorators to properties of this class // register immediately after they're made
class Product {
  @Log
  title: string;
  private _price: number;

  @Log2 //decorator with an accessor (setters/getters)
  set price(val: number) {
    //checks against negative prices
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Invalid Price - Should be positive!");
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

// ---

const p1 = new Product("Cheetos", -3.52);

console.log(p1);

//creating an autobinding decorator for this class and methods

function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  //we dont care about the target or method name here so _ convention
  //o.g method we want to work with
  const originalMethod = descriptor.value;
  //the object we want to return
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    //helps us get the method/property we want to mutate (descriptor.value),
    //helps us do some work before we want to execute the function
    get() {
      //.bind(this) is whatever is responsible for triggering the getter function
      //It's the object that this getter was set on through this decorator
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  //this descriptor obj will overwrite the old one returning this new descriptor with this new config with a getter method
  return adjDescriptor;
}

class Printer {
  message = "this Works!";

  @AutoBind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector("button")!;

//bind p to the show message to ensure we get the function or method we want with the right this value
//this extra getter on our decorator really ensures the binding process before instanciating so we can have really
//good access to properties w/o bind here or any other calls
button?.addEventListener("click", p.showMessage);

// --- validation decorators

//configuration of the storage we want to work with here
interface ValidatorConfig {
  [property: string]: {
    //name of the validator / decorator
    [validatableProp: string]: string[]; //['Required', 'PositiveNumber']
  };
}

//initially empty storage: type validatorconfig
const registeredValidators: ValidatorConfig = {};

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    //if theres any other existing objects of this class name add those first then our new one
    ...registeredValidators[target.constructor.name],
    [propName]: [ 
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "required",
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [ 
      //this helps us store multiple validator values into this class
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "positive",
    ],
  };
}

function validate(obj: any) {
  //access proto of object and get it's name prop thanks to prototype
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    //if theres nohting to validate return true
    return true;
  }

  //enhance our validator loop status to ensure we return true and dont have mishap truthy/falsey values
  //that dont get executed properly or in order
  let isValid = true;
  //otherwise if it is valid i want to loop over the properties of this object that registers validators
  for (const prop in objValidatorConfig) {
    // console.log(prop); price is the first property that gets evaluated
    //gets the concrete validator on this property either required or positive which gets stored into this validator const
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case "required":
          isValid = isValid && !!obj[prop]; //double bang truthy memberrrr
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0; //property has to be greater than 0
          break;
      }
    }
  }
  return isValid; //return isValid on default/ all properties are good and checked
}

class Course {
  @Required
  title: string;

  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

//cute lil form in ts
const courseForm = document.querySelector("form")!;
courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    alert("Invalid input, please try again");
    return;
  }

  console.log(createdCourse);
});

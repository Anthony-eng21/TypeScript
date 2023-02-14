abstract class Department {
  static fiscalYear: number = 2023;
  //   private id: string;
  //   private name: string;
  //emplyees is now only local to the class/object so cant access this array anywhere but in our methods in this use case
  //protected is like private but it is accesible to extended/descendants of this Department class
  protected employees: string[] = [];

  //method for instanciating a class like so 👇
  //access modifier instead of having to assign the types over and over we can just do it like this👇
  constructor(protected readonly id: string, public name: string) {
    // this.id = id;
    // this.name = name;
  }

  //creates a nameSpace for this property/method making it globally available without having to instanciate a new dept
  static createEmployee(name: string) {
    return { name: name };
  }

  //methods
  //this as a param should always refer to an instance that refers back to the Department Class
  //abstract empty method for polymorphism within our extended classes(ensures all inherited classes share this method)
  abstract describe(this: Department): void;

  //push an employee on to the employees arr
  addEmployee(this: Department, employee: string) {
    //validation etc
    this.employees.push(employee);
  }

  printEmployeeInfo() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

//class inheritance wtih extends and super
class ITDepartment extends Department {
  public admins: string[];
  constructor(id: string, admins: string[]) {
    super(id, "IT");
    this.admins = admins;
  }
  describe() {
    console.log("IT Department - ID: " + this.id)
  }
}

class AccountingDepartment extends Department {
  private lastReport: string;
  //singleton: stores an accounting instance and the type is the value of the class itself
  private static instance: AccountingDepartment

  //getter that method a value via method making it publically accesible throught method acting as a property
  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }
    throw new Error("No report found!");
  }
  set mostRecentReport(value: string) {
    if (!value) {
      throw new Error("No Valid reports found!");
    }
    this.addReport(value);
  }

  //singleton: ensures only one instance of this class by making a private constructor
  private constructor(id: string, private reports: string[]) {
    super(id, "Accounting");
    this.lastReport = reports[0];
  }

  //checks if we already have an instance of this class and if not return a new one 
  static getInstance() {
    if(AccountingDepartment.instance){
      return this.instance;
    }
    this.instance = new AccountingDepartment('d2', [])
    return this.instance
  }

  //overwrite this method from it's inheritance with this new method
  describe() {
    console.log("Accounting Department - ID: " + this.id);
  }

  addEmployee(name: string) {
    if (name === "Tony") {
      return;
    }
    this.employees.push(name);
  }

  addReport(text: string) {
    this.reports.push(text);
    this.lastReport = text;
  }

  printReport() {
    console.log(this.reports);
  }
}

//call it directly on the parent class without new kw and use the class as a grouping property of that class
const employee1 = Department.createEmployee("John");
console.log(employee1, Department.fiscalYear);

const IT = new ITDepartment("a2", ["Tony"]);

IT.addEmployee("Tony");
IT.addEmployee("Hailey");

// accounting.employees[2] = 'john' //bad don't use this to add/push to arrays. Set up some sort of method for it(private/protected fields to the rescue)

IT.describe();
IT.printEmployeeInfo();

console.log(IT);

//Singleton: returns an instance of the accounting department without new keyword
const accounting = AccountingDepartment.getInstance();

//just point at the method that will get executed here(like how we point at properties)
// console.log(accounting.mostRecentReport);

//setting this like a property
accounting.mostRecentReport = "Year End Report";

accounting.addReport("Something Went Wrong Today!");

accounting.addEmployee("Tony");
accounting.addEmployee("Hailey");

accounting.describe();

// accounting.printReport();
// accounting.printEmployeeInfo();

//adding a describe prop to an object describe through some obj literal based on this class
// const accountingCopy = { name: "Finances", describe: accounting.describe };

// //this executes the method but 'this' doesn't refer to the method exactly but it refers to the thing responsible for calling the method(accountingCopy)
// //we get an error because accountingCopy has no this keyword
// accountingCopy.describe();

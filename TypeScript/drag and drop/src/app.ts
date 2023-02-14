//Drag and Drop Interfaces
interface Draggable {
  //want to use this to describe project items
  dragStartHandler(event: DragEvent): void; //registers event doesn't return anything
  dragEndHandler(event: DragEvent): void; //registers event doesn't return anything
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void; //permits drop
  dropHandler(event: DragEvent): void; //handles drop
  dragLeaveHandler(event: DragEvent): void; //for visual feedback and fallback leave animation on !drop
}

//status enum for drag and drop
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

//Project State Management Classes

//function that receives our items in an array of objects we dont care about what we return
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  // listeners: Listener[] = [];
  private projects: Project[] = [];
  private static instance: ProjectState;

  //making a singleton class
  private constructor() {
    super();
  }

  //making instances with this method
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // addListener(listenerFn: Listener) {
  //   this.listeners.push(listenerFn);
  // }

  addProject(title: string, description: string, numOfPeople: number) {
    //stored obj
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    //add this new object to private this.projects arr
    this.projects.push(newProject);
    this.updateListeners();
  }

  //switches the status of our project
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    //whenever something changes(add a new project) listen to all of it's listeners
    for (const listenerFn of this.listeners) {
      //makes a copy of this array and add slice so that the array isn't editable from where it comes from
      listenerFn(this.projects.slice());
    }
  }
}

//pass this proj state instance into this new constant that is available globally
const projectState = ProjectState.getInstance(); //guranteeds the exact in time object

//---

//validation logic
//defineing the structure of the object we want to return on validate()
interface Validatable {
  // ? we want each of these property types set as optional
  value: string | number;
  required: boolean | undefined; //equivalent to ?:
  minLength?: number; //for string inputs
  maxLength?: number;
  min?: number; //for number inputs
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true; //set this to false if one of our checks fails
  if (validatableInput.required) {
    //if this isn't zero return true
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  //minlength and maxlength
  if (
    //makes sure it isnt zero - checks if this is here at all by checking against null.
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    //dont care abt numbers here
    isValid =
      isValid && validatableInput.value.length > validatableInput.minLength;
  }

  if (
    //makes sure it isnt zero - checks if this is here at all by checking against null. truthy values and working with zero
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    //we care abt numbers here
    isValid =
      isValid && validatableInput.value.length < validatableInput.maxLength;
  }

  //min & max
  if (
    validatableInput.min != null && //makes sure it isnt zero with truthy/falsey guard
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }

  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}

//auto bind decorator

//method decorator
function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

//Component Based Class dont want mutations of this class so it's abstract
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    inserAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById(templateId)
    );
    this.hostElement = <T>document.getElementById(hostElementId)!;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }
    this.attach(inserAtStart);
  }

  //method private attach()
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  //solely for future inheritance setup ("META - PROGRAMMING")
  abstract configure?(): void;
  abstract renderContent(): void;
}

//ProjectItem class

//first generic type is the parent el then second is the ele we want to render
//implementing this insterface to this class responsible for rendering the items
class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  // use this getter for the right jargin/text for the returned persons number input
  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} people`;
    }
  }

  constructor(hostId: string, project: Project) {
    //hostId is the id i want to forward to the base class constructor
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  //drag events have a dataTransfer property on it's chain
  @AutoBind //gets our obj data when we drag and prints on drop
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id); //transfer the id which points to specific items in memory
    event.dataTransfer!.effectAllowed = "move"; //effects our cursor and allows us to move it smoother
  }

  dragEndHandler(_: DragEvent) {
    console.log("Dragend");
  }

  //on instance execution we want to be able to drag our returned element items
  // and use method callback and these handler  callbacks and listeners to do so
  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned"; //this is where we trigger the getter for the returned string (person count)
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

//ProjectList Class that inherits from Component very nice

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  // templateElement: HTMLTemplateElement;
  // hostElement: HTMLDivElement;
  // element: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    // this.templateElement = <HTMLTemplateElement>(
    //   document.getElementById("project-list")! //template
    // );
    // this.hostElement = <HTMLDivElement>document.getElementById("app")!; //div app renderer

    this.assignedProjects = [];

    //import children elements of the template tags and render it to the dom by some instance
    //pass a pointer to our template element via importNode()
    //1st arg is the reference to the children content of our template tags
    // 2nd deep clone?: boolean
    // const importedNode = document.importNode(
    //   this.templateElement.content, //content of template
    //   true
    // );
    // this.element = importedNode.firstElementChild as HTMLElement;
    // this.element.id = `${this.type}-projects`; //adds nice styling from our css to this NEW node

    //overwriting the assigned projects with the new projects

    // projectState.addListener((projects: Project[]) => {
    //   const relevantProjects = projects.filter((prj) => {
    //     if (this.type === "active") {
    //       return prj.status === ProjectStatus.Active;
    //     }
    //     return prj.status === ProjectStatus.Finished;
    //   });
    //   this.assignedProjects = relevantProjects;
    //   this.renderProjects();
    // });

    // this.attach();

    this.configure(); //safer to have inherited class call these methods than the base class because of how we set up this instance oriented approach
    this.renderContent();
  }

  //permits drop also turns our lists different colors on hover over these elements when an element is dragged
  @AutoBind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault(); //DEFAULT is to not allow dropping
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  //handles drop and where it stores the li in either ul on some ProjectStatus enum
  @AutoBind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  //for visual feedback and fallback leave animation on leave when we drag this element
  @AutoBind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    //listening to listeners on these events and binding them to these methods for later
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    //grab that list element from the dom
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    //render the content
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + "PROJECTS";
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = ""; //clear all list items then rerender WORK AROUND
    for (const prjItem of this.assignedProjects) {
      // const listItem = document.createElement("li");
      // listItem.textContent = prjItem.title;
      // listEl?.appendChild(listItem);
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem); //use this item object to render our projects the right way
      //this also ensures on this instance we forward the right id and set our ul as our host element for our li elements
    }
  }

  // private attach() {
  //   this.hostElement.insertAdjacentElement("beforeend", this.element);
  // }
}
// --

//ProjectInput Class

//rendering this project input between template tags
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  //type casting with html
  // templateElement: HTMLTemplateElement;
  // hostElement: HTMLDivElement;
  // element: HTMLFormElement; //returned form element on instance
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    //gets the input elements from this returned object element(our sort of shadow dom)
    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;
    // this.templateElement = <HTMLTemplateElement>(
    //   document.getElementById("project-input")! //template
    // );
    // this.hostElement = <HTMLDivElement>document.getElementById("app")!; //div app renderer

    //import children elements of the template tags and render it to the dom by some instance
    //pass a pointer to our template element via importNode()
    //1st arg is the reference to the children content of our template tags
    // 2nd deep clone?: boolean

    // const importedNode = document.importNode(
    //   this.templateElement.content, //content of template
    //   true
    // );
    // this.element = importedNode.firstElementChild as HTMLFormElement;
    // this.element.id = "user-input"; //adds nice styling from our css to this NEW node

    this.configure(); //triggers whenever the form is submitted
    // this.attach(); //need to call this in the constructor so it can execute on class instance and render our form
  } //end of constructor

  configure() {
    this.element.addEventListener("submit", this.submitHandler);
    //.bind(this) after submit handler this here refers to the class we have inside
    //the submithandler now we have acces to the needed method
  }

  renderContent(): void {}

  //returns either a tuple of our user data or nothing
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    //interface objects we want to use with our validate()

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const personValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    //validation logic validation should return true if isValid and false if isValid is false

    if (
      //checks if any of these objects are false
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(personValidatable)
    ) {
      alert("Invalid input - Please try again");
      return;
    } else {
      return [enteredTitle, enteredDescription, parseFloat(enteredPeople)];
    }
  }

  //clears form once it's submitted
  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  @AutoBind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInputData = this.gatherUserInput();
    if (Array.isArray(userInputData)) {
      const [title, desc, people] = userInputData;
      // console.log(title, desc, people);
      projectState.addProject(title, desc, people);

      this.clearInputs();
    }
  }
}

//where the magic happens
const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active"); //active ul
const finishedPrjList = new ProjectList("finished"); //finished ul

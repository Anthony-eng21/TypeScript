"use strict";
var _a;
const e1 = {
    name: "tony",
    privileges: ["create-server"],
    startDate: new Date(),
};
function add(a, b) {
    if (typeof a === "string" || typeof b === "string") {
        return a.toString() + b.toString();
    }
    return a + b;
}
const result = add("max", "shwarz");
result.split(" ");
const fetchedUserData = {
    id: "u1",
    name: "Tony",
    job: { title: "CEO", description: "My own company" },
};
console.log((_a = fetchedUserData === null || fetchedUserData === void 0 ? void 0 : fetchedUserData.job) === null || _a === void 0 ? void 0 : _a.title);
const userInput = null;
const storedData = userInput !== null && userInput !== void 0 ? userInput : "Default";
console.log(storedData);
//# sourceMappingURL=app.js.map
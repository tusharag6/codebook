---
sidebar_position: 5
---
# Object-Oriented Programming (OOP)

OOP is a programming paradigm based on the concept of "objects," which can contain data and code to manipulate that data. It allows for better organization, modularity, and reusability of code by modeling real-world entities as software objects.

### Object in JavaScript

- **Object**: In JavaScript, an object is a collection of properties and methods. Properties represent the object's data, and methods are functions that can be performed on the data.

  Example: A `car` object may have properties like `color`, `make`, and `model`, and methods like `start()`, `stop()`, and `drive()`.

  ```javascript
  const car = {
    make: "Tesla",
    model: "Model S",
    color: "red",
    start: function () {
      console.log("Car started");
    },
  };

  console.log(car.make); // Outputs: Tesla
  car.start(); // Outputs: Car started
  ```

### Why Use OOP?

OOP is used to organize code into reusable and modular components. It helps to break down complex problems into smaller, manageable parts by modeling real-world entities. The use of OOP promotes:

- **Reusability**: Code can be reused across the application or in different projects.
- **Modularity**: Code is organized into distinct objects, making it easier to manage and debug.
- **Abstraction**: Simplifying complex systems by breaking them down into smaller, more manageable objects.
- **Scalability**: Easy to extend and maintain as the application grows.

### Parts of OOP in JavaScript

#### **Object Literal**

The simplest way to create objects in JavaScript. An object literal is a comma-separated list of key-value pairs wrapped in curly braces.

```javascript
const person = {
  firstName: "John",
  lastName: "Doe",
  greet: function () {
    console.log("Hello " + this.firstName);
  },
};

person.greet(); // Outputs: Hello John
```

#### **Constructor Function**

A constructor function is used to create multiple instances of an object with the same properties and methods.

```javascript
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const john = new Person("John", "Doe");
console.log(john.firstName); // Outputs: John
```

#### **Prototypes**

Prototypes are the mechanism by which JavaScript objects inherit properties and methods from one another. Every JavaScript function has a `prototype` property, which is an object that is shared among all instances created by the constructor function.

```javascript
Person.prototype.greet = function () {
  console.log("Hello " + this.firstName);
};

john.greet(); // Outputs: Hello John
```

#### **Classes**

Classes in JavaScript are syntactical sugar over the existing prototype-based inheritance. They provide a more intuitive way to create objects and deal with inheritance.

```javascript
class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  start() {
    console.log("Car started");
  }
}

const myCar = new Car("Tesla", "Model 3");
myCar.start(); // Outputs: Car started
```

#### **Instances (new, this)**

An instance is a specific realization of any object or class. In JavaScript, instances are created using the `new` keyword, which calls the constructor function or class and creates a new object.

- **`new`**: Creates a new instance of an object or class.
- **`this`**: Refers to the current instance of the object or class.

```javascript
const myCar = new Car("Tesla", "Model 3");
```



### The 4 Pillars of OOP

1. **Abstraction**

   - Abstraction involves hiding complex implementation details and exposing only the necessary features of an object. This simplifies the interaction with objects and reduces complexity.

   ```javascript
   class Car {
     constructor(make, model) {
       this.make = make;
       this.model = model;
     }

     start() {
       // Simplifies the complexity of starting the car
       console.log("Car started");
     }
   }
   ```

2. **Encapsulation**

   - Encapsulation is the practice of keeping an object's properties private and providing public methods to interact with those properties. This ensures data integrity and prevents unauthorized access.

   ```javascript
   class BankAccount {
     constructor(balance) {
       this._balance = balance; // Private property
     }

     deposit(amount) {
       // Public method
       this._balance += amount;
     }

     getBalance() {
       return this._balance;
     }
   }

   const account = new BankAccount(1000);
   account.deposit(500);
   console.log(account.getBalance()); // Outputs: 1500
   ```

3. **Inheritance**

   - Inheritance allows a class to inherit properties and methods from another class. This promotes code reusability and establishes a parent-child relationship between classes.

   ```javascript
   class Vehicle {
     constructor(make) {
       this.make = make;
     }
   }

   class Car extends Vehicle {
     // Car inherits from Vehicle
     constructor(make, model) {
       super(make); // Calls the parent class constructor
       this.model = model;
     }
   }

   const myCar = new Car("Tesla", "Model 3");
   console.log(myCar.make); // Outputs: Tesla
   ```

4. **Polymorphism**

   - Polymorphism allows objects of different classes to be treated as objects of a common parent class. It enables methods to be used interchangeably between different objects.

   ```javascript
   class Animal {
     speak() {
       console.log("Animal speaks");
     }
   }

   class Dog extends Animal {
     speak() {
       // Method overriding
       console.log("Dog barks");
     }
   }

   const myDog = new Dog();
   myDog.speak(); // Outputs: Dog barks
   ```



### Prototypes

- In JavaScript, every function and object has a prototype property.
- A prototype is essentially an object from which other objects inherit properties and methods.
- When you create a function, JavaScript automatically adds a `prototype` property to it. This `prototype` property is an object that contains properties and methods that should be shared among all instances created by that constructor function.
- **Example:** When you define a method on a constructor function's prototype, all instances of that constructor will have access to that method through prototype chaining.

```javascript
function createUser(username, score) {
  this.username = username;
  this.score = score;
}

createUser.prototype.increment = function () {
  this.score++;
};
```

### The `new` keyword

- The `new` keyword in JavaScript is used to create instances of a constructor function.
- **What Happens When You Use `new`:**

  - **A new object is created:** The new keyword initiates the creation of a new JavaScript object.

  - **A prototype is linked:** The newly created object gets linked to the prototype property of the constructor function. This means that it has access to properties and methods defined on the constructor's prototype.

  - **The constructor is called:** The constructor function is called with the specified arguments and this is bound to the newly created object. If no explicit return value is specified from the constructor, JavaScript assumes this, the newly created object, to be the intended return value.

  - **The new object is returned:** After the constructor function has been called, if it doesn't return a non-primitive value (object, array, function, etc.), the newly created object is returned.

**Example:** Using the `new` keyword to create an instance.

```javascript
const chai = new createUser("chai", 25);
chai.increment();
chai.printMe(); // Outputs: price is 26
```

**Practical Example:**

```javascript
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}

Car.prototype.start = function () {
  console.log(`${this.make} ${this.model} is starting...`);
};

const myCar = new Car("Toyota", "Corolla", 2020);
myCar.start(); // Outputs: Toyota Corolla is starting...
```

In the example above:

- `Car.prototype.start` is a method that all instances of `Car` will have access to, thanks to prototype chaining.
- `myCar` is an instance created using the `new` keyword, which links it to the `Car` prototype and binds `this` within the `Car` function to the new `myCar` object.



### Prototypes and Inheritance

**1. Prototypes in JavaScript:**

- **Prototype Inheritance:** JavaScript uses prototypes to implement inheritance. Every object in JavaScript has a prototype, which is another object from which it inherits properties and methods.
- **Object Prototype Extension:** You can extend the capabilities of all objects or specific types (like arrays) by adding methods to their prototype. This allows all instances of that type to access the new methods.

```javascript
let myHeros = ["thor", "spiderman"];

let heroPower = {
  thor: "hammer",
  spiderman: "sling",

  getSpiderPower: function () {
    console.log(`Spidy power is ${this.spiderman}`);
  },
};

Object.prototype.tushar = function () {
  console.log(`tushar is present in all objects`);
};

Array.prototype.heytushar = function () {
  console.log(`tushar says hello`);
};
```

- **Example:** By adding a method to `Object.prototype`, every object in your code can access the `tushar` method. Similarly, adding a method to `Array.prototype` allows all arrays to access `heytushar`.

```javascript
heroPower.tushar(); // Outputs: tushar is present in all objects
myHeros.tushar(); // Outputs: tushar is present in all objects
myHeros.heytushar(); // Outputs: tushar says hello
```

**2. Prototype Chain and Inheritance:**

- **Prototype Chain:** Objects can inherit properties from other objects, creating a chain of prototypes. If a property or method is not found on the current object, JavaScript will look for it up the prototype chain.
- **Example:** In the following code, `Teacher` inherits properties from `User` by setting `Teacher.__proto__` to `User`.

```javascript
const User = {
  name: "chai",
  email: "chai@google.com",
};

const Teacher = {
  makeVideo: true,
};

Teacher.__proto__ = User;
console.log(Teacher.name); // Outputs: chai
```

- **Modern Syntax:** The modern way to set prototypes is by using `Object.setPrototypeOf`.

```javascript
Object.setPrototypeOf(TeachingSupport, Teacher);
```

- This allows `TeachingSupport` to inherit properties and methods from `Teacher`.

**3. String Prototype Extension:**

- **Custom Methods for Strings:** You can add custom methods to the `String.prototype` to enhance string capabilities for all string instances.

```javascript
String.prototype.trueLength = function () {
  console.log(`True length is: ${this.trim().length}`);
};

let anotherUsername = "ChaiAurCode     ";
anotherUsername.trueLength(); // Outputs: True length is: 11
```

- The `trueLength` method calculates the length of a string after trimming any whitespace.

**4. Key Takeaways:**

- **Prototypes** allow JavaScript objects to inherit properties and methods from other objects.
- You can extend the capabilities of built-in types like `Object`, `Array`, and `String` by adding methods to their prototypes.
- **Inheritance** through prototypes creates a chain, allowing objects to share functionality while keeping their individual properties.
- Custom methods can be added to specific types, enabling you to enhance the behavior of strings, arrays, and objects globally across your application.



## `call` and `bind` Methods

**1. `call` Method:**

- **Purpose:** The `call` method allows you to invoke a function and explicitly specify what `this` should refer to inside that function. This is particularly useful when you want to borrow methods from another object or constructor function and use them in a different context.
- **Syntax:** `functionName.call(thisArg, arg1, arg2, ...)`
- **Example:** In the following code, `SetUsername` is a function that assigns a username. When creating a new user using the `createUser` function, `SetUsername.call(this, username)` is used to set the username within the context of the new `createUser` object.

```javascript
function SetUsername(username) {
  this.username = username;
  console.log("called");
}

function createUser(username, email, password) {
  SetUsername.call(this, username); // 'this' refers to the new object created by createUser
  this.email = email;
  this.password = password;
}

const chai = new createUser("chai", "chai@fb.com", "123");
console.log(chai);
```

- **Output:**
  - `"called"` is logged when `SetUsername` is invoked within `createUser`.
  - The `chai` object now has `username`, `email`, and `password` properties.

**2. `bind` Method:**

- **Purpose:** The `bind` method creates a new function that, when called, has its `this` keyword set to the provided value. Unlike `call` or `apply`, `bind` does not immediately invoke the function but instead returns a new function with the specified `this` value.
- **Syntax:** `functionName.bind(thisArg, arg1, arg2, ...)`
- **Example:** In the following example, the `React` class needs to ensure that the `this` keyword inside the `handleClick` method refers to the current instance of the class, even when the method is used as an event handler.

```javascript
class React {
  constructor() {
    this.library = "React";
    this.server = "https://localhost:300";

    // Bind 'this' context to handleClick method
    document
      .querySelector("button")
      .addEventListener("click", this.handleClick.bind(this));
  }

  handleClick() {
    console.log("button clicked");
    console.log(this.server); // Refers to React's server property
  }
}

const app = new React();
```

- **Explanation:**
  - Without `bind(this)`, the `this` keyword inside `handleClick` would refer to the HTML button element, not the `React` instance.
  - Using `bind(this)`, we ensure that `this` inside `handleClick` correctly points to the `React` instance, allowing access to its properties like `server`.

**3. Key Differences Between `call` and `bind`:**

- **`call` immediately invokes the function** with the specified `this` value and arguments, whereas `bind` **returns a new function** with a bound `this` value but does not immediately invoke it.
- **Use `call`** when you want to borrow a method from another object and execute it immediately in a different context.
- **Use `bind`** when you need to create a function that is pre-bound to a specific `this` value, especially useful in scenarios like event handling in classes where `this` might change.

### Example Scenarios:

- **`call` for Constructor Chaining:** Using `call` inside constructors like `createUser` allows reusing initialization code from other constructors.
- **`bind` for Event Handlers:** Ensuring that event handler functions in classes like `React` correctly refer to the class instance rather than the event target (e.g., the button).



## Advanced Object Properties

#### 1. `Object.getOwnPropertyDescriptor()`

- **Purpose:** The `Object.getOwnPropertyDescriptor()` method returns a property descriptor for an object’s own property. The descriptor is an object that provides detailed information about the property's characteristics.
- **Syntax:** `Object.getOwnPropertyDescriptor(obj, prop)`
  - `obj`: The object from which to get the property descriptor.
  - `prop`: The name of the property whose descriptor is to be retrieved.
- **Example:**

  - Retrieving the property descriptor for the `Math.PI` constant:

    ```javascript
    const descriptor = Object.getOwnPropertyDescriptor(Math, "PI");
    console.log(descriptor);
    ```

    - **Output:**
      ```javascript
      {
          value: 3.141592653589793,
          writable: false,
          enumerable: false,
          configurable: false
      }
      ```
      - `value`: The current value of the property.
      - `writable`: Indicates if the value can be changed (`false` for `Math.PI`).
      - `enumerable`: Indicates if the property will show up in enumerations like `for...in` loops.
      - `configurable`: Indicates if the property descriptor can be changed or if the property can be deleted.

- **Example:** Retrieving the property descriptor for the `name` property in the `chai` object:

  ```javascript
  const chai = {
    name: "ginger chai",
    price: 250,
    isAvailable: true,
    orderChai: function () {
      console.log("chai nhi bni");
    },
  };

  console.log(Object.getOwnPropertyDescriptor(chai, "name"));
  ```

  - **Output:**
    ```javascript
    {
        value: "ginger chai",
        writable: true,
        enumerable: true,
        configurable: true
    }
    ```

#### 2. `Object.defineProperty()`

- **Purpose:** The `Object.defineProperty()` method allows you to define or modify a property on an object and control its behavior. This is especially useful for creating non-enumerable, non-writable, or non-configurable properties.
- **Syntax:** `Object.defineProperty(obj, prop, descriptor)`
  - `obj`: The object on which to define the property.
  - `prop`: The name of the property to be defined or modified.
  - `descriptor`: The descriptor object that defines the property's behavior.
- **Example:**

  - Modifying the `name` property in the `chai` object to be non-writable:

    ```javascript
    Object.defineProperty(chai, "name", {
      writable: false,
      enumerable: true,
    });

    console.log(Object.getOwnPropertyDescriptor(chai, "name"));
    ```

    - **Output:**
      ```javascript
      {
          value: "ginger chai",
          writable: false,
          enumerable: true,
          configurable: true
      }
      ```

#### 3. Example of Enumerating Object Properties

- **Purpose:** To demonstrate how the properties of an object are enumerated in a `for...of` loop using `Object.entries()`, while skipping functions.
- **Example:**

  ```javascript
  for (let [key, value] of Object.entries(chai)) {
    if (typeof value !== "function") {
      console.log(`${key} : ${value}`);
    }
  }
  ```

  - **Output:**
    ```
    name : ginger chai
    price : 250
    isAvailable : true
    ```
---
sidebar_position: 1
---
# Basics of React

### Create a React App

```
npm create vite@latest
```

### JavaScript ES6+ Concepts

1. **Arrow Functions**

   - **Syntax**: Arrow functions provide a concise way to write functions in JavaScript.

   ```javascript
   const add = (a, b) => a + b;
   ```

   - **No `this` Binding**: Arrow functions do not have their own `this` context; they inherit `this` from the enclosing lexical scope.
   - **Implicit Return**: If the function body contains a single expression, you can omit the `return` keyword and curly braces.

   ```javascript
   const square = (n) => n * n;
   ```

2. **Destructuring**

   - **Arrays**: Extract values from arrays into variables.

   ```javascript
   const [first, second] = [10, 20];
   ```

   - **Objects**: Extract values from objects into variables.

   ```javascript
   const { name, age } = { name: "Alice", age: 25 };
   ```

   - **Nested Destructuring**: You can also destructure nested objects and arrays.

   ```javascript
   const user = {
     name: "John",
     address: {
       city: "New York",
       zip: 10001,
     },
   };
   const {
     name,
     address: { city, zip },
   } = user;
   ```

3. **Template Literals**
   - **Syntax**: Template literals allow you to embed expressions within string literals using backticks (`` ` ``).
   ```javascript
   const name = "John";
   const greeting = `Hello, ${name}!`;
   ```
   - **Multi-line Strings**: Template literals make it easier to create multi-line strings.
   ```javascript
   const message = `This is a
   multi-line string.`;
   ```



### Components, JSX, and Props in React

1. **Components**

   - **Functional Components**: Components in React can be functions that return JSX.

   ```javascript
   function Welcome() {
     return <h1>Hello, World!</h1>;
   }
   ```

2. **JSX (JavaScript XML)**

   - **Syntax**: JSX is a syntax extension that allows you to write HTML-like code within JavaScript.

   ```javascript
   const element = <h1>Hello, World!</h1>;
   ```

   - **Embedding Expressions**: You can embed JavaScript expressions in JSX using curly braces `{}`.

   ```javascript
   const name = "John";
   const element = <h1>Hello, {name}</h1>;
   ```

   - **Attributes and Children**: JSX allows you to pass attributes and children to elements just like in HTML.

   ```javascript
   const element = <button onClick={handleClick}>Click me</button>;
   ```

3. **Props (Properties)**
   - **Passing Props**: Props are used to pass data from parent to child components.
   ```javascript
   function Greeting(props) {
     return <h1>Hello, {props.name}</h1>;
   }
   ```
   - **Default Props**: You can define default values for props in case they are not provided.
   ```javascript
   Greeting.defaultProps = {
     name: "Guest",
   };
   ```
   - **Prop Types**: Prop types help to enforce the types of props a component should receive.
   ```javascript
   Greeting.propTypes = {
     name: PropTypes.string,
   };
   ```



### Custom Rendering Function and React Elements

#### **Custom Rendering Function:**

- **Steps:**

  1. Create a DOM element using `document.createElement` based on the `type` specified in the React element.
  2. Set the inner HTML of the DOM element to the `children` of the React element.
  3. Loop through the `props` of the React element, setting each one as an attribute on the DOM element using `setAttribute`.
  4. Append the DOM element to the specified container.

- **Code Example:**

  ```javascript
  function customRender(reactElement, container) {
    const domElement = document.createElement(reactElement.type);
    domElement.innerHTML = reactElement.children;

    for (const prop in reactElement.props) {
      if (prop === "children") continue;
      domElement.setAttribute(prop, reactElement.props[prop]);
    }

    container.appendChild(domElement);
  }

  const reactElement = {
    type: "a",
    props: {
      href: "https://google.com",
      target: "_blank",
    },
    children: "Click me to visit google",
  };

  const mainContainer = document.querySelector("#root");
  customRender(reactElement, mainContainer);
  ```

#### **React Rendering:**

- **React.createElement**: This method is used to create a React element, which is an object representing a DOM node or a component.
- **Example:**

  ```javascript
  const reactElement = React.createElement(
    "a",
    { href: "https://google.com", target: "_blank" },
    "Click me to visit google"
  );
  ```

- **JSX Syntax**: Alternatively, JSX can be used to create React elements in a more readable and HTML-like syntax.

  ```javascript
  const anotherElement = (
    <a href="https://google.com" target="_blank">
      Visit google
    </a>
  );
  ```

- **Rendering with ReactDOM**: React elements can be rendered to the DOM using `ReactDOM.createRoot().render()`.
  ```javascript
  ReactDOM.createRoot(document.getElementById("root")).render(reactElement);
  ```

#### **Key Points:**

- The custom rendering function provides a manual way to render elements, similar to how React does it internally.
- `React.createElement` is used under the hood in JSX to create React elements.
- `ReactDOM.render` (or `createRoot().render`) is the standard way to render React elements into the DOM in a React application.

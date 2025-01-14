---
sidebar_position: 3
---
# DOM (Document Object Model)

### 1. DOM Introduction

The Document Object Model (DOM) is a programming interface for HTML and XML documents. It represents the structure of a document as a tree of objects that can be manipulated with JavaScript.

- The DOM allows scripts to update the content, structure, and style of a document.
- It represents the document as a hierarchical tree of nodes.

### 2. DOM Tree

The DOM tree is a tree-like structure where:

- **Document** is the root of the tree.
- **Elements** are the nodes in the tree.
- **Attributes** and **Text** are the properties of the elements.

### Example of a DOM Tree

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>My First Heading</h1>
    <p>My first paragraph.</p>
    <a href="https://example.com">Link</a>
  </body>
</html>
```

**DOM Tree Structure:**

- `document`
  - `html`
    - `head`
      - `title`
    - `body`
      - `h1`
      - `p`
      - `a`

### 3. Selecting Elements

#### 3.1 By ID

```javascript
let element = document.getElementById("myId");
```

#### 3.2 By Class

Selects all elements with a specified class name. Returns an HTMLCollection.

```javascript
let elements = document.getElementsByClassName("myClass"); // return an HTMLCOllection
```

#### 3.3 By Tag Name

Selects all elements with a specified tag name. Returns an HTMLCollection.

```javascript
let elements = document.getElementsByTagName("p");
```

#### 3.4 By `querySelector`

Selects the first element that matches a specified CSS selector.

```javascript
let element = document.querySelector(".myClass");
```

#### 3.5 By `querySelectorAll`

Selects all elements that match a specified CSS selector. Returns a NodeList.

```javascript
let elements = document.querySelectorAll(".myClass");
```

### 4. Attributes

#### 4.1 `getAttribute`

Gets the value of an attribute on the specified element.

```javascript
let value = element.getAttribute("href");
```

#### 4.2 `setAttribute`

Sets the value of an attribute on the specified element.

```javascript
element.setAttribute("href", "https://new-url.com");
```

### 5. Styling an Element

```javascript
element.style.color = "red";
element.style.fontSize = "20px";
```

### 6. Setting Content of an Element

#### 6.1 `textContent`

Sets or returns the text content of an element, including its descendants. It ignores HTML tags.

```javascript
element.textContent = "New Text";
```

#### 6.2 `innerHTML`

Sets or returns the HTML content of an element, including its descendants. It parses the text as HTML, so it's possible to include tags.

```javascript
element.innerHTML = "<strong>Bold Text</strong>";
```

#### 6.3 `innerText`

Similar to `textContent`, but it returns the visible text, ignoring hidden elements or CSS styles like `display: none`.

```javascript
element.innerText = "New Visible Text";
```

**Difference between `textContent`, `innerHTML`, and `innerText`:**

- `textContent`: Includes all text within an element, ignoring HTML tags.
- `innerHTML`: Allows you to set or get HTML content, including tags.
- `innerText`: Returns only the visible text within an element, respecting CSS styles.

### 7. NodeList, HTMLCollection, and Array

#### 7.1 NodeList

A NodeList is a collection of nodes returned by methods like `querySelectorAll`. It can be traversed using `forEach`, `for of`, or index-based access.

```javascript
let elements = document.querySelectorAll(".myClass");
elements.forEach((element) => console.log(element));
```

#### 7.2 HTMLCollection

An HTMLCollection is a collection of elements returned by methods like `getElementsByClassName` or `getElementsByTagName`. It can only be traversed using `for of` or index-based access.

```javascript
let elements = document.getElementsByClassName("myClass");
for (let element of elements) {
  console.log(element);
}
```

#### 7.3 Array

Neither NodeList nor HTMLCollection are true arrays, but they can be converted to arrays using `Array.from` or the spread operator `[...]`.

```javascript
let elementsArray = Array.from(document.querySelectorAll(".myClass"));
elementsArray.forEach((element) => console.log(element));

// Using the spread operator
let elementsArray2 = [...document.getElementsByClassName("myClass")];
elementsArray2.forEach((element) => console.log(element));
```

### Traversing NodeList, HTMLCollection, and Array

- **NodeList**: Can be traversed using `forEach`, `for of`, or traditional loops.
- **HTMLCollection**: Can be traversed using `for of` or traditional loops.
- **Array**: Full array methods like `map`, `filter`, `reduce`, etc., can be used.



### Example 1: DOM Manipulation and Traversal

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DOM | Chai aur code</title>
  </head>
  <body style="background-color: #212121; color: #fff;">
    <div class="parent">
      <!-- this is a comment -->
      <div class="day">Monday</div>
      <div class="day">Tuesday</div>
      <div class="day">Wednesday</div>
      <div class="day">Thursday</div>
    </div>
  </body>
  <script>
    const parent = document.querySelector(".parent");

    // Accessing children of the parent element
    console.log(parent.children); // Logs HTMLCollection of child elements
    console.log(parent.children[1].innerHTML); // Logs "Tuesday"

    // Iterating over children
    for (let i = 0; i < parent.children.length; i++) {
      console.log(parent.children[i].innerHTML); // Logs each day's name
    }

    // Modifying the style of a specific child
    parent.children[1].style.color = "orange"; // Changes color of "Tuesday" to orange

    // Accessing first and last child
    console.log(parent.firstElementChild); // Logs first child ("Monday")
    console.log(parent.lastElementChild); // Logs last child ("Thursday")

    const dayOne = document.querySelector(".day");
    console.log(dayOne); // Logs the first element with class "day" ("Monday")
    console.log(dayOne.parentElement); // Logs the parent of "Monday" (the .parent div)
    console.log(dayOne.nextElementSibling); // Logs the next sibling ("Tuesday")

    console.log("NODES: ", parent.childNodes); // Logs all child nodes, including text and comment nodes
  </script>
</html>
```

### Key Concepts:

1. **Selecting Elements:**

   - `document.querySelector('.parent')`: Selects the first element with the class "parent".
   - `document.querySelector('.day')`: Selects the first element with the class "day".

2. **Traversing the DOM:**

   - `parent.children`: Returns an HTMLCollection of all child elements within the parent.
   - `parent.firstElementChild` and `parent.lastElementChild`: Return the first and last child elements.
   - `dayOne.parentElement`: Accesses the parent of the selected element.
   - `dayOne.nextElementSibling`: Gets the next sibling element.

3. **Modifying DOM Elements:**
   - `parent.children[1].style.color = "orange"`: Changes the color of the second child element.
   - `parent.childNodes`: Returns a NodeList of all child nodes, including text and comment nodes.



### Example 2: Creating and Appending DOM Elements

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chai aur code</title>
  </head>
  <body style="background-color: #212121; color: #fff;"></body>
  <script>
    const div = document.createElement("div");
    console.log(div); // Logs the newly created div element

    // Setting attributes and styles
    div.className = "main";
    div.id = Math.round(Math.random() * 10 + 1); // Sets a random id
    div.setAttribute("title", "generated title");
    div.style.backgroundColor = "green";
    div.style.padding = "12px";

    // Adding text content to the div
    const addText = document.createTextNode("Chai aur code");
    div.appendChild(addText);

    // Appending the div to the body
    document.body.appendChild(div);
  </script>
</html>
```

### Key Concepts:

1. **Creating Elements:**

   - `document.createElement("div")`: Creates a new `div` element.

2. **Setting Attributes:**

   - `div.className = "main"`: Sets the class of the element.
   - `div.id = ...`: Assigns a random id to the element.
   - `div.setAttribute("title", "generated title")`: Sets the title attribute.

3. **Styling Elements:**

   - `div.style.backgroundColor = "green"`: Sets the background color.
   - `div.style.padding = "12px"`: Adds padding to the element.

4. **Adding Text:**

   - `document.createTextNode("Chai aur code")`: Creates a text node with the content "Chai aur code".
   - `div.appendChild(addText)`: Appends the text node to the `div`.

5. **Appending to the DOM:**
   - `document.body.appendChild(div)`: Appends the `div` to the body of the document.



### Example 3: Dynamic DOM Manipulation

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Chai aur code | DOM</title>
  </head>
  <body style="background-color: #212121; color: #fff;">
    <ul class="language">
      <li>Javascript</li>
    </ul>
  </body>
  <script>
    // Function to add new languages
    function addLanguage(langName) {
      const li = document.createElement("li");
      li.innerHTML = `${langName}`;
      document.querySelector(".language").appendChild(li);
    }
    addLanguage("Python");
    addLanguage("TypeScript");

    // Optimized function to add new languages using text node
    function addOptiLanguage(langName) {
      const li = document.createElement("li");
      li.appendChild(document.createTextNode(langName));
      document.querySelector(".language").appendChild(li);
    }
    addOptiLanguage("Golang");

    // Editing existing elements
    const secondLang = document.querySelector("li:nth-child(2)");
    console.log(secondLang); // Logs the second list item
    const newli = document.createElement("li");
    newli.textContent = "Mojo";
    secondLang.replaceWith(newli); // Replaces the second list item

    // Editing the first element
    const firstLang = document.querySelector("li:first-child");
    firstLang.outerHTML = "<li>TypeScript</li>"; // Replaces the entire first list item with new HTML

    // Removing the last element
    const lastLang = document.querySelector("li:last-child");
    lastLang.remove(); // Removes the last list item
  </script>
</html>
```

### Key Concepts:

1. **Adding Elements:**

   - `addLanguage(langName)`: A function that creates a new `li` element, sets its inner HTML, and appends it to the list.
   - `addOptiLanguage(langName)`: Similar to `addLanguage`, but uses a text node for adding text content, which is more secure and efficient.

2. **Editing Elements:**

   - `secondLang.replaceWith(newli)`: Replaces the second list item with a new list item (`li`).
   - `firstLang.outerHTML = ...`: Replaces the entire first list item with new HTML content.

3. **Removing Elements:**
   - `lastLang.remove()`: Removes the last list item from the list.



### DOM Manipulation and Event Handling: Examples

#### 1. **Basic DOM Manipulation:**

**Example: Selecting and Styling Elements**

```javascript
const parent = document.querySelector(".parent");
parent.children[1].style.color = "orange"; // Changes the color of the second child to orange
```

**Example: Navigating the DOM Tree**

```javascript
const dayOne = document.querySelector(".day");
console.log(dayOne.parentElement); // Logs the parent element of 'dayOne'
console.log(dayOne.nextElementSibling); // Logs the next sibling element after 'dayOne'
```

**Example: Accessing All Child Nodes**

```javascript
const parent = document.querySelector(".parent");
console.log(parent.childNodes); // Logs all child nodes including text nodes and comments
```



#### 2. **Creating and Appending Elements:**

**Example: Creating and Styling a New Element**

```javascript
const div = document.createElement("div");
div.className = "main"; // Sets the class of the div
div.id = Math.round(Math.random() * 10 + 1); // Sets a random ID
div.setAttribute("title", "generated title"); // Sets a title attribute
div.style.backgroundColor = "green"; // Styles the background color
div.style.padding = "12px"; // Adds padding
```

**Example: Adding Text to an Element**

```javascript
div.innerText = "Chai aur code"; // Sets the text inside the div
// Or, alternatively
const addText = document.createTextNode("Chai aur code");
div.appendChild(addText); // Appends a text node to the div
```

**Example: Appending the New Element to the DOM**

```javascript
document.body.appendChild(div); // Appends the div to the body of the document
```



#### 3. **Manipulating Lists:**

**Example: Adding List Items**

```javascript
function addLanguage(langName) {
  const li = document.createElement("li");
  li.innerHTML = langName; // Sets the content of the list item
  document.querySelector(".language").appendChild(li); // Appends the list item to the language list
}
addLanguage("Python"); // Adds 'Python' to the list
addLanguage("TypeScript"); // Adds 'TypeScript' to the list
```

**Example: Replacing an Element**

```javascript
const secondLang = document.querySelector("li:nth-child(2)");
const newLi = document.createElement("li");
newLi.textContent = "Mojo"; // Sets the content of the new list item
secondLang.replaceWith(newLi); // Replaces the second language item with 'Mojo'
```

**Example: Removing an Element**

```javascript
const lastLang = document.querySelector("li:last-child");
lastLang.remove(); // Removes the last language item from the list
```



#### 4. **Event Handling:**

**Example: Handling Click Events**

```javascript
document.getElementById("owl").onclick = function () {
  alert("Owl clicked"); // Displays an alert when the owl image is clicked
};
```

**Example: Using `addEventListener`**

```javascript
document.querySelector("#images").addEventListener("click", function (e) {
  console.log(e.target.tagName); // Logs the tag name of the clicked element
  if (e.target.tagName === "IMG") {
    e.target.parentNode.remove(); // Removes the clicked image from the list
  }
});
```

**Example: Preventing Default Behavior**

```javascript
document.getElementById("google").addEventListener("click", function (e) {
  e.preventDefault(); // Prevents the default action (navigating to Google)
  console.log("Google link clicked, but navigation prevented.");
});
```

## Events

#### 1. **Event Bubbling:**

- **Definition**: Event bubbling is a type of event propagation in the DOM where an event starts from the most specific element (the target element) and moves up through the ancestor elements until it reaches the `document` object.
- **How it Works**: When an event (like a click) occurs on an element, it first triggers the event handlers on that element. Then, it moves up to the parent element, triggering any event handlers attached to it, and continues this way up to the `document`.

**Example**:

```html
<div id="parent">
  <button id="child">Click me</button>
</div>

<script>
  document.getElementById("parent").addEventListener("click", function () {
    alert("Parent clicked!");
  });

  document.getElementById("child").addEventListener("click", function () {
    alert("Child clicked!");
  });
</script>
```

- **Result**: Clicking the button will first trigger "Child clicked!" and then "Parent clicked!" due to bubbling.

#### 2. **Event Capturing (Trickling):**

- **Definition**: Event capturing is the opposite of event bubbling. Here, the event is captured by the outermost element and then propagated down to the target element.
- **How it Works**: The event starts at the `document` level and travels down the DOM tree until it reaches the target element.
- **Usage**: To use capturing, set the `useCapture` parameter to `true` in the `addEventListener` method.

**Example**:

```html
<div id="parent">
  <button id="child">Click me</button>
</div>

<script>
  document.getElementById("parent").addEventListener(
    "click",
    function () {
      alert("Parent clicked!");
    },
    true
  );

  document.getElementById("child").addEventListener("click", function () {
    alert("Child clicked!");
  });
</script>
```

- **Result**: Clicking the button will first trigger "Parent clicked!" and then "Child clicked!" because of capturing.

#### 3. **Event Propagation:**

- **Definition**: Event propagation is the process by which an event is dispatched to its target and then propagated up or down the DOM tree, depending on the propagation method (bubbling or capturing).
- **Three Phases**:
  1. **Capture Phase**: The event moves from the outermost element (`document`) down to the target element.
  2. **Target Phase**: The event reaches the target element, and any event listeners attached to this element are triggered.
  3. **Bubble Phase**: The event moves from the target element back up to the outermost element.

**Example**:

```html
<div id="parent">
  <button id="child">Click me</button>
</div>

<script>
  document.getElementById("parent").addEventListener("click", function () {
    console.log("Parent clicked during bubbling phase");
  });

  document.getElementById("parent").addEventListener(
    "click",
    function () {
      console.log("Parent clicked during capturing phase");
    },
    true
  );

  document.getElementById("child").addEventListener("click", function () {
    console.log("Child clicked");
  });
</script>
```

- **Result**: Clicking the button will log:
  - "Parent clicked during capturing phase" (during capture)
  - "Child clicked" (target phase)
  - "Parent clicked during bubbling phase" (during bubble)

#### 4. **Stopping Propagation:**

- **Event Propagation Control**:
  - **`e.stopPropagation()`**: Stops the event from propagating further in the bubbling or capturing phase.
  - **`e.stopImmediatePropagation()`**: Stops the event from propagating and prevents any other event handlers from being executed on that element.

**Example**:

```javascript
document.getElementById("child").addEventListener("click", function (e) {
  e.stopPropagation(); // Stops the event from reaching parent
  alert("Child clicked and propagation stopped!");
});
```

- **Result**: The event stops at the child element, and the parent’s event handler will not be triggered.

#### 5. **Preventing Default Behavior:**

- **Definition**: The `e.preventDefault()` method stops the default action of the event from occurring.
- **Common Use Cases**: Preventing a link from navigating, stopping form submission, etc.

**Example**:

```javascript
document.getElementById("google").addEventListener("click", function (e) {
  e.preventDefault(); // Prevents navigation to the Google website
  alert("Navigation prevented");
});
```

#### 6. **Event Delegation:**

- **Definition**: Event delegation is a technique that involves using a single event listener to manage events for multiple child elements by taking advantage of event propagation.
- **Benefits**: Improves performance, especially when dealing with a large number of elements, and simplifies code by reducing the number of event listeners.

**Example**:

```javascript
document.querySelector("#images").addEventListener("click", function (e) {
  if (e.target.tagName === "IMG") {
    console.log("Image clicked:", e.target.id);
  }
});
```

- **Result**: This code handles clicks on any image within the `#images` element.

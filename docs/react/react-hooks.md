---
sidebar_position: 3
---

# React Hooks

### `useEffect` Hook

- `useEffect` is a hook in React that allows you to perform side effects in functional components.
- Side effects are actions that affect something outside the scope of a function, such as fetching data, updating the DOM, or setting up subscriptions.

##### **How `useEffect` Works:**

- **Syntax**:

  ```javascript
  useEffect(() => {
    // Side effect logic here

    return () => {
      // Cleanup logic here (optional)
    };
  }, [dependencies]);
  ```

  - **Callback Function**: The first argument to `useEffect` is a function that contains the side effect logic.
  - **Cleanup Function**: If your effect requires cleanup (e.g., removing event listeners), you return a cleanup function from the callback.
  - **Dependencies Array**: The second argument is an array of dependencies. The effect runs whenever the dependencies change. If omitted, the effect runs on every render. If an empty array is passed, the effect runs only once after the initial render.

##### **Examples of `useEffect`:**

- **Example 1: Data Fetching**
  ```javascript
  useEffect(() => {
    fetch("https://api.example.com/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []); // Empty array means this runs only once, on mount
  ```
- **Example 2: Cleanup with Event Listeners**

  ```javascript
  useEffect(() => {
    const handleResize = () => {
      console.log("Window resized");
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup
    };
  }, []);
  ```

- React calls your setup and cleanup functions whenever it’s necessary, which may happen multiple times:

  1. Your setup code runs when your component is added to the page (mounts).
  2. After every re-render of your component where the dependencies have changed:
     - First, your cleanup code runs with the old props and state.
     - Then, your setup code runs with the new props and state.
  3. Your cleanup code runs one final time after your component is removed from the page (unmounts).

DOCS: [useEffect Docs](https://react.dev/reference/react/useEffect)



### `useRef` Hook

`useRef` is a React Hook that lets you reference a value that’s not needed for rendering. This object persists for the lifetime of the component.

##### **How `useRef` Works:**

- **Syntax**:
  ```javascript
  const myRef = useRef(initialValue);
  ```
  - `initialValue`: The value you want the ref object’s current property to be initially. It can be a value of any type. This argument is ignored after the initial render.
  - **`.current`**: The `.current` property of the ref object is mutable and can be updated without causing a re-render.

##### **Examples of `useRef`:**

- **Example 1: Accessing DOM Elements**

  ```javascript
  function FocusInput() {
    const inputRef = useRef(null);

    useEffect(() => {
      inputRef.current.focus(); // Focus the input element when the component mounts
    }, []);

    return <input ref={inputRef} type="text" />;
  }
  ```

  DOCS : [useRef Docs](https://react.dev/reference/react/useRef)



### `useCallback` Hook

##### **What is `useCallback`?**

- `useCallback` is a React Hook that lets you cache a function definition between re-renders.

- `useCallback` returns a memoized version of the callback function that only changes if one of the dependencies has changed. It helps optimize performance by preventing unnecessary re-creations of functions, especially in cases where those functions are passed as props to child components.

##### **How `useCallback` Works:**

- **Syntax**:

  ```javascript
  const memoizedCallback = useCallback(() => {
    // Callback logic here
  }, [dependencies]);
  ```

  - **Callback Function**: The first argument is the function that you want to memoize.
  - **Dependencies Array**: The second argument is an array of dependencies. The callback function will be re-created only when one of these dependencies changes.

- On the initial render, useCallback returns the function you have passed.

- During subsequent renders, it will either return an already stored function from the last render (if the dependencies haven’t changed), or return the fn function you have passed during this render.

##### **Examples of `useCallback`:**

- **Example: Memoizing a Function Passed as a Prop**

  ```javascript
  function ParentComponent() {
    const [count, setCount] = useState(0);

    const increment = useCallback(() => {
      setCount((prevCount) => prevCount + 1);
    }, []); // The function will not be recreated on every render

    return (
      <div>
        <p>Count: {count}</p>
        <ChildComponent onIncrement={increment} />
      </div>
    );
  }

  function ChildComponent({ onIncrement }) {
    console.log("ChildComponent re-rendered");
    return <button onClick={onIncrement}>Increment</button>;
  }
  ```

- **Without `useCallback`**: In the above example, without `useCallback`, the `increment` function would be re-created on every render of `ParentComponent`, causing `ChildComponent` to re-render unnecessarily.

DOCS: [useCallback](https://react.dev/reference/react/useCallback)



### Custom Hooks in React

**Custom Hooks** are JavaScript functions that allow you to encapsulate and reuse logic across multiple components in a React application.

#### **How to Create a Custom Hook**

A custom hook is just a function that starts with `use` (a convention React uses to identify hooks). It can use other hooks inside of it to manage state, side effects, etc.

**Example: A Custom Hook for Fetching Data**

Here’s how you might create a custom hook to fetch data from an API:

```javascript
import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```

**Using the Custom Hook in a Component:**

```javascript
function App() {
  const { data, loading, error } = useFetch("https://api.example.com/data");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Fetched Data:</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
```

---
sidebar_position: 4
---

# React Router

#### **What is React Router DOM?**

- **React Router DOM** is a standard library for routing in React applications. It enables navigation between different components, updates the URL, and keeps the UI in sync with the URL, allowing the creation of single-page applications (SPAs) without reloading the entire page.

#### **Core Concepts**

1. **RouterProvider:**

   - The `RouterProvider` component is the core of React Router DOM, wrapping your entire application to enable routing functionalities.

   ```javascript
   import { RouterProvider } from "react-router-dom";

   function App() {
     return (
       <RouterProvider router={router}>
         {/* Application Components */}
       </RouterProvider>
     );
   }
   ```

2. **Routes and Route:**

   - The `Route` component defines a path and the component that should render when the URL matches that path. Routes can be nested, enabling complex layouts.

   ```javascript
   import { Route, createRoutesFromElements } from "react-router-dom";

   const router = createBrowserRouter(
     createRoutesFromElements(
       <Route path="/" element={<Layout />}>
         <Route path="about" element={<About />} />
         <Route path="contact" element={<Contact />} />
       </Route>
     )
   );
   ```

3. **Link:**

   - The `Link` component enables client-side navigation without reloading the page, similar to an HTML `<a>` tag but optimized for SPAs.

   ```javascript
   import { Link } from "react-router-dom";

   function Navbar() {
     return (
       <nav>
         <Link to="/">Home</Link>
         <Link to="/about">About</Link>
         <Link to="/contact">Contact</Link>
       </nav>
     );
   }
   ```

4. **Navigate:**

   - The `Navigate` component is used to programmatically redirect the user to a different route, often used after certain actions, such as form submission.

   ```javascript
   import { Navigate } from "react-router-dom";

   function Login() {
     const [isLoggedIn, setIsLoggedIn] = useState(false);

     if (isLoggedIn) {
       return <Navigate to="/dashboard" />;
     }

     return (
       <div>
         <h2>Login Page</h2>
         <button onClick={() => setIsLoggedIn(true)}>Log In</button>
       </div>
     );
   }
   ```

5. **useParams:**

   - The `useParams` hook retrieves dynamic parameters from the URL, which is useful in routes like `/user/:id`.

   ```javascript
   import { useParams } from "react-router-dom";

   function UserProfile() {
     const { id } = useParams();

     return (
       <div>
         <h2>User Profile</h2>
         <p>User ID: {id}</p>
       </div>
     );
   }
   ```

6. **useNavigate:**

   - The `useNavigate` hook programmatically navigates to different routes, offering more flexibility than the `Navigate` component.

   ```javascript
   import { useNavigate } from "react-router-dom";

   function Dashboard() {
     const navigate = useNavigate();

     const goToProfile = () => {
       navigate("/profile");
     };

     return (
       <div>
         <h2>Dashboard</h2>
         <button onClick={goToProfile}>Go to Profile</button>
       </div>
     );
   }
   ```

7. **Outlet:**

   - The `Outlet` component renders matched child routes in a layout component, enabling nested routing.

   ```javascript
   import { Outlet } from "react-router-dom";

   function Layout() {
     return (
       <div>
         <h2>App Layout</h2>
         <Outlet /> {/* Child route will render here */}
       </div>
     );
   }
   ```

8. **NavLink**
   - **NavLink** is a special type of `Link` component in React Router DOM that provides additional styling capabilities based on the active state of the link.
   - It is used to create navigation links that automatically apply an "active" class or styles when the link matches the current URL.

#### **Using NavLink**

```javascript
<NavLink
  to="/dashboard"
  style={({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    color: isActive ? "blue" : "black",
  })}
>
  Dashboard
</NavLink>
```

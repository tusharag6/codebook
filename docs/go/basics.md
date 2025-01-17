---
sidebar_position: 1
---

# Basics of Go

## Variables in Go

In Go, variables are a fundamental part of the language, and there are three primary ways to declare them:

### 1. Using the `var` Keyword
- The `var` keyword allows you to declare a variable and optionally assign a value later.
```go
var i int // Declaration
i = 10    // Assignment
```
- You can also declare and initialize the variable in a single line:
```go
var i int = 10
```
- **When to use this:**  
  Use `var` when:
  - You want to declare a variable without initializing it immediately.
  - Explicitly specifying the type is necessary because Go cannot infer it.

### 2. Using the Short Declaration (`:=`)
- The shorthand declaration uses the `:=` operator, often called the "walrus operator":
```go
j := 13
```
- **Key Points:**
  - The type is inferred from the value assigned.
  - This can only be used within function or block scopes, not at the package level.

### 3. Grouped Declarations
- You can declare multiple variables using the `var` keyword in a grouped format:
```go
var (
    i int    = 3
    j string = "hello"
)
```

### Variable Redeclaration and Shadowing
- **Redeclaration:**  
  Go does not allow redeclaring a variable in the same scope:
  ```go
  var i int = 10
  var i int = 20 // Error: i redeclared in this block
  ```

- **Shadowing:**  
  A variable declared in an inner scope can shadow a variable with the same name in an outer scope:
  ```go
  package main
  import "fmt"

  var i int = 10 // Global variable

  func main() {
      fmt.Println(i) // Prints 10 (global variable)
      var i int = 27 // Shadows the global variable
      fmt.Println(i) // Prints 27 (local variable)
  }
  ```
  - The innermost declaration takes precedence in such cases.

### Unused Variables
- Go strictly enforces that all declared variables must be used.  
  Unused variables result in a **compile-time error**:
  ```go
  func main() {
      var i int = 10 // Error if not used
  }
  ```
  - This ensures clean and maintainable code.

### Variable Visibility
In Go, variable visibility depends on the naming convention and the scope of the declaration:
1. **Lowercase Names:**  
   Variables starting with a lowercase letter (e.g., `var i int`) are **package-private** and accessible only within the same package.
2. **Uppercase Names:**  
   Variables starting with an uppercase letter (e.g., `var I int`) are **exported** and accessible across all packages that import the declaring package.
3. **Block Scope:**  
   Variables declared inside a function or block are visible only within that scope.

### Type Conversion
- Go does **not** perform implicit type conversion. You must explicitly convert variables to another type using type conversion functions:
```go
var i int = 42
var j float32
j = float32(i)
```
- **Caution:** Be careful during type conversion as it can lead to data loss. For example:
```go
var i int = 300
var j byte = byte(i) // Truncates data, as byte can only store values 0–255
```

### Default Initialization
- In Go, all variables are automatically initialized to their **zero value** if no value is provided:
  - **Numeric types:** `0`
  - **Strings:** `""` (empty string)
  - **Booleans:** `false`
  - **Pointers, slices, maps, interfaces, channels, and functions:** `nil`

Example:
```go
var i int      // i is initialized to 0
var s string   // s is initialized to ""
var b bool     // b is initialized to false
```

### Additional Notes

- **Multiple Assignments:**  
  Go allows multiple variables to be declared and initialized in one line:
  ```go
  a, b := 5, "hello"
  ```

- **Blank Identifier `_`:**  
  The `_` identifier is used to discard unwanted values:
  ```go
  _, value := someFunction() // Ignore the first return value
  ```

## Constants in Go

Constants represent fixed values that cannot be changed during program execution. Here's an overview of constants in Go:

### Declaring Constants
- Constants are declared using the `const` keyword:
  ```go
  const Pi = 3.14
  ```
- Naming conventions for constants follow the same rules as variables:
  - Uppercase first letter (`Pi`) makes the constant **exported** (accessible outside its package).
  - Lowercase first letter (`pi`) keeps it **unexported** (package-private).

### Key Features of Constants
1. **Compile-Time Initialization:**
   - Constants must be initialized at **compile time**, not runtime.
   - Example:
     ```go
     const x = 42 // Valid
     const y = math.Sqrt(4) // Invalid (runtime computation)
     ```

2. **Shadowing:**
   - Constants can be shadowed in inner scopes, similar to variables.

3. **Untyped Constants:**
   - If a constant is declared without specifying its type, it is an **untyped constant**:
     ```go
     const Pi = 3.14
     ```
   - **Advantages of untyped constants:**
     - They can be implicitly converted to compatible types during operations.
       ```go
       var radius float64 = 5
       var circumference = 2 * Pi * radius // Implicit conversion of Pi
       ```

### Enumerated Constants with `iota`
- `iota` is a special counter in Go used for creating enumerated constants.
- When used in a `const` block, `iota` starts at `0` and increments by `1` for each constant in the block:
  ```go
  const (
      a = iota // 0
      b        // 1
      c        // 2
  )
  ```
- **Resetting `iota`:**
  - `iota` resets to `0` when a new `const` block begins.

- **Ignoring `iota` Values:**
  - Use `_` to skip unwanted values:
    ```go
    const (
        _ = iota // Ignore 0
        a        // 1
        b        // 2
    )
    ```

- **Using Operations with `iota`:**
  - You can perform arithmetic, bitwise, or bit-shifting operations with `iota`:
    ```go
    const (
        a = iota + 5  // 5
        b = iota << 1 // 2 (1 << 1), 4 (2 << 1), etc.
    )
    ```



## Types in Go

Go provides a rich set of built-in types, categorized as follows:

### Boolean
- Represents `true` or `false`.
- Declared using the `bool` keyword:
  ```go
  var flag bool = true
  ```

### Integers
- **Signed Integers:** Support both positive and negative values:
  - Types: `int`, `int8`, `int16`, `int32`, `int64`
- **Unsigned Integers:** Only support non-negative values:
  - Types: `uint`, `uint8`, `uint16`, `uint32`, `uint64`, `uintptr`
- **Aliases:**
  - `byte` is an alias for `uint8`.
  - `rune` is an alias for `int32`, often used to represent Unicode code points.

**Default Behavior:**
- The `int` and `uint` types are 32-bit on 32-bit systems and 64-bit on 64-bit systems.
- Prefer `int` unless a specific size or unsigned behavior is required.

**Type Compatibility:**
- Go does not allow implicit conversions between integer types:
  ```go
  var x int32 = 10
  var y int64 = x // Error: cannot use int32 as int64
  ```
- Use explicit type conversion:
  ```go
  var y int64 = int64(x)
  ```

### Floating-Point Numbers
- **Types:** `float32` and `float64` (default is `float64`).
- **Key Points:**
  - Supports decimals and scientific notation.
  - `%` (modulo) operator is **not available** for floats.
    ```go
    var x float64 = 10.5
    var y float64 = 2.3
    fmt.Println(x % y) // Error: invalid operation
    ```

### Strings
- Strings are sequences of immutable bytes, declared using double quotes (`""`):
  ```go
  var greeting string = "Hello, Go!"
  ```

- **Characteristics:**
  - Strings are **immutable**, meaning they cannot be modified after creation.
  - Strings act as read-only byte slices, so you can access individual characters using array notation:
    ```go
    fmt.Println(greeting[0]) // Prints 72 (ASCII value of 'H')
    ```
  - Convert ASCII values to characters using the `string()` function:
    ```go
    fmt.Println(string(greeting[0])) // Prints "H"
    ```

- **Conversions:**
  - Convert a string to a byte slice:
    ```go
    byteSlice := []byte(greeting)
    ```
  - Convert a byte slice back to a string:
    ```go
    newString := string(byteSlice)
    ```

- **Single Quotes (`'`):**
  - Characters enclosed in single quotes represent a **rune** (UTF-32) or `int32`:
    ```go
    var ch rune = 'A' // 'A' is stored as 65 (ASCII value)
    ```

## Control Flow in Go

### **If-Else Statements**
1. **Basic Syntax:**
   ```go
   if true {
       fmt.Println("This is true")
   } else {
       fmt.Println("This is false")
   }
   ```
2. **With Initializers:**
   - Go allows initializations directly within the `if` statement:
     ```go
     if pop, ok := statePopulation["Florida"]; ok {
         fmt.Println(pop)
     }
     ```
   - **Explanation:**
     - `pop` holds the value of the key `"Florida"` from the `statePopulation` map.
     - `ok` is a boolean indicating if the key exists.
     - The semicolon (`;`) separates the initializer from the condition.

3. **Short-Circuiting:**
   - In logical operations:
     - `OR (||)` stops evaluating once a `true` condition is found.
     - `AND (&&)` stops evaluating once a `false` condition is found.



### **Loops**

1. **Basic `for` Loop:**
   ```go
   for i := 1; i < 5; i++ {
       fmt.Println(i)
   }
   ```

2. **While-Like Loop:**
   - Go doesn’t have a `while` loop, but you can emulate it:
     ```go
     i := 1
     for i < 5 {
         fmt.Println(i)
         i++
     }
     ```

3. **Infinite Loop:**
   ```go
   for {
       fmt.Println("Infinite loop")
       break // Stops the loop
   }
   ```

4. **Iterating with `range`:**
   - The `range` keyword allows iteration over collections:
     ```go
     s := []int{1, 2, 3}
     for k, v := range s {
         fmt.Println(k, v) // k: index, v: value
     }
     ```
   - If only values are needed:
     ```go
     for _, v := range s {
         fmt.Println(v)
     }
     ```



### **Switch Statements**

1. **Basic Syntax:**
   ```go
   switch condition {
   case 1:
       fmt.Println("One")
   case 2:
       fmt.Println("Two")
   default:
       fmt.Println("Default")
   }
   ```

2. **No Fallthrough by Default:**
   - Unlike other languages, Go’s `switch` doesn’t require `break`. 
   - Multiple cases can be combined:
     ```go
     switch condition {
     case 1, 3, 5:
         fmt.Println("Odd")
     case 2, 4, 6:
         fmt.Println("Even")
     default:
         fmt.Println("Default")
     }
     ```

3. **Switch with Initializer:**
   ```go
   switch i := 2 + 3; i {
   case 1, 3, 5:
       fmt.Println("Odd")
   case 2, 4, 6:
       fmt.Println("Even")
   default:
       fmt.Println("Default")
   }
   ```

4. **Tagless Switch:**
   - A `switch` without an expression:
     ```go
     i := 10
     switch {
     case i <= 10:
         fmt.Println("Less than or equal to 10")
     case i <= 20:
         fmt.Println("Less than or equal to 20")
     }
     ```

5. **Fallthrough Behavior:**
   - Explicit `fallthrough` is required for cases to fall through:
     ```go
     switch i := 2; i {
     case 2:
         fmt.Println("Two")
         fallthrough
     case 3:
         fmt.Println("Three")
     }
     ```

6. **Breaking from a Switch:**
   - Use the `break` keyword to exit the `switch` early.



### **Defer**

1. **What is `defer`:**
   - `defer` delays the execution of a statement or function until the surrounding function completes.
   - Always executed **before the function returns**.

2. **Behavior:**
   - Deferred calls are executed in **LIFO (Last In, First Out)** order:
     ```go
     defer fmt.Println("End")
     defer fmt.Println("Middle")
     fmt.Println("Start")
     ```
     **Output:**
     ```
     Start
     Middle
     End
     ```

3. **Key Points:**
   - `defer` takes a snapshot of the argument's value at the time it is declared:
     ```go
     a := "start"
     defer fmt.Println(a)
     a = "end"
     ```
     **Output:**
     ```
     start
     ```

4. **Use Cases:**
   - Commonly used for resource cleanup, such as closing files or releasing locks.



### **Panic**

1. **What is `panic`:**
   - `panic` is used when a program encounters an unrecoverable error.
   - It stops the execution of the current function and propagates up the call stack.

2. **Explicit Panic:**
   ```go
   panic("Something went wrong!")
   ```

3. **Order of Execution:**
   - Deferred calls are executed before the function exits due to a `panic`.

4. **Use Cases:**
   - Situations where the program cannot continue, e.g., invalid memory access or missing critical resources.



### **Recover**

1. **What is `recover`:**
   - `recover` regains control of a program after a `panic`.
   - It **must** be used within a `defer` function.

2. **Usage Example:**
   ```go
   func main() {
       defer func() {
           if r := recover(); r != nil {
               fmt.Println("Recovered from:", r)
           }
       }()
       panic("Critical error!")
   }
   ```
   **Output:**
   ```
   Recovered from: Critical error!
   ```

3. **Behavior:**
   - If `recover` is called outside a deferred function, it does nothing.
   - Used to gracefully handle unexpected errors.

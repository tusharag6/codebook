---
sidebar_position: 3
---

# Functions and Interfaces

## **Functions**

### 1. **Basic Syntax**
```go
func funcName(parameter type) returnType {
    // Do something
}
```

### 2. **Multiple Parameters with Same Type**
- If two or more parameters have the same type, you can declare them like this:
```go
func funcName(a, b string) {
    // Do something
}
```

### 3. **Pass by Value**
- By default, function arguments are passed by **value** (copied).
- To modify the original value, pass a **pointer**:
```go
func modify(val *int) {
    *val = 10
}
```

### 4. **Variadic Parameters**
- When the number of arguments is unknown, use variadic parameters:
```go
func printValues(values ...int) {
    for _, v := range values {
        fmt.Println(v)
    }
}
```
- **Rules**:
  - Variadic parameters must be the **last parameter**.
  - The arguments passed to a variadic parameter are treated as a **slice**.

### 5. **Returning Values**
- Returning a local variable:
  - In Go, local variables can be returned as **pointers**. The Go compiler automatically promotes these variables to the **heap** if their reference escapes the function scope.
```go
func getPointer() *int {
    num := 42
    return &num
}
```

### 6. **Named Return Values**
- You can declare named return variables:
```go
func doSomething(values ...int) (result int) {
    result = 0
    for _, v := range values {
        result += v
    }
    return
}
```
- Simply using `return` returns the named result.

### 7. **Multiple Return Values**
- Functions can return multiple values:
```go
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}
```

### 8. **Anonymous Functions**
- Functions without a name, often used inline:
```go
func main() {
    func() {
        fmt.Println("Hello from an anonymous function!")
    }()
}
```

### 9. **Function as a Type**
- Functions can be treated as **first-class citizens**:
```go
type MathOperation func(int, int) int

func add(a, b int) int {
    return a + b
}

func main() {
    var op MathOperation = add
    fmt.Println(op(3, 5)) // Output: 8
}
```

### 10. **Methods**
- A method is a function associated with a type. The **receiver** specifies the type it is associated with:
```go
type Geometry struct {
    Width, Height int
}

func (g Geometry) Area() int {
    return g.Width * g.Height
}

func main() {
    rect := Geometry{Width: 10, Height: 5}
    fmt.Println(rect.Area()) // Output: 50
}
```

## **Interfaces**

### 1. **Definition**
- An interface defines a set of **method signatures** that a type must implement. Interfaces describe **behavior**.
```go
type Shape interface {
    Area() float64
    Perimeter() float64
}
```

### 2. **Implicit Implementation**
- In Go, you don’t need an explicit `implements` keyword. A type satisfies an interface if it implements all its methods:
```go
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return 3.14 * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * 3.14 * c.Radius
}

func describe(s Shape) {
    fmt.Println("Area:", s.Area())
    fmt.Println("Perimeter:", s.Perimeter())
}

func main() {
    c := Circle{Radius: 5}
    describe(c)
}
```

### 3. **Interface Embedding**
- Interfaces can embed other interfaces:
```go
type Printer interface {
    Print()
}

type AdvancedPrinter interface {
    Printer
    PrintDetails()
}
```

### 4. **Type Assertion**
- Convert an interface to a specific type:
```go
var s Shape = Circle{Radius: 5}
circle, ok := s.(Circle)
if ok {
    fmt.Println("Circle radius:", circle.Radius)
} else {
    fmt.Println("Conversion failed")
}
```

### 5. **Empty Interfaces**
- The empty interface `interface{}` can hold values of any type:
```go
var anything interface{}
anything = 42
anything = "hello"

fmt.Println(anything) // Output depends on the assigned value
```
- To use the value, type assertion is required.

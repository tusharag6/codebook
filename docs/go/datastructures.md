---
sidebar_position: 2
---

# Data Structures in Go

## **Array**

1. **Definition:**
   - Arrays are used to store a collection of data of the **same type** with a **fixed size**.

2. **Declaration:**
   - Basic array declaration:
     ```go
     grades := [3]int{97, 83, 98}
     ```
   - Using `[...]` lets the compiler determine the size:
     ```go
     grades := [...]int{97, 83, 98}
     ```
   - Using `var`:
     ```go
     var students [3]string
     students[0] = "Asif"
     ```

3. **Properties:**
   - Use the built-in `len()` function to find the length:
     ```go
     fmt.Println(len(grades)) // Output: 3
     ```
   - Arrays are **value types**:
     - Assigning one array to another creates a **copy**, not a reference:
       ```go
       a := [...]int{1, 2, 3}
       b := a
       b[1] = 42
       fmt.Println(a) // [1, 2, 3]
       fmt.Println(b) // [1, 42, 3]
       ```
     - To share the same underlying data, use pointers:
       ```go
       b := &a
       b[1] = 42
       fmt.Println(a) // [1, 42, 3]
       ```

4. **2D Arrays:**
   ```go
   var matrix [2][2]int
   matrix[0] = [2]int{0, 1}
   ```

5. **Limitations:**
   - Fixed size makes arrays inflexible when the size of the data is unknown.
   - Use **slices** to overcome this limitation.

## **Slice**


1. **Definition:**
   - A slice is a **dynamic, resizable view** into an underlying array.
   - Slices provide more flexibility compared to arrays.

2. **Declaration:**
   - Basic slice:
     ```go
     a := []int{1, 2, 3}
     ```
   - Using `make`:
     ```go
     a := make([]int, 3, 100) // len: 3, cap: 100
     ```

3. **Properties:**
   - Slices support `len()` and `cap()`:
     ```go
     fmt.Println(len(a)) // Length
     fmt.Println(cap(a)) // Capacity
     ```
   - Slices are **reference types**:
     - Assigning one slice to another creates a reference, not a copy:
       ```go
       a := []int{1, 2, 3}
       b := a
       b[1] = 42
       fmt.Println(a) // [1, 42, 3]
       fmt.Println(b) // [1, 42, 3]
       ```

4. **Appending Elements:**
   - Use the `append` function to add elements dynamically:
     ```go
     a := []int{1, 2}
     a = append(a, 3, 4) // [1, 2, 3, 4]
     ```
   - Appending another slice:
     ```go
     b := []int{5, 6}
     a = append(a, b...) // Spread operator to unpack slice
     ```

5. **Removing Elements:**
   - Remove the **first element**:
     ```go
     b := a[1:]
     ```
   - Remove the **last element**:
     ```go
     b := a[:len(a)-1]
     ```
   - Remove the **nth element**:
     ```go
     b := append(a[:2], a[3:]...) // Removes the 2nd element
     ```
   **Note:** Modifications affect the original slice due to shared references.


**Key Differences Between Arrays and Slices:**

| Feature           | Array                 | Slice                    |
| ----------------- | --------------------- | ------------------------ |
| **Size**          | Fixed                 | Dynamic                  |
| **Declaration**   | `[3]int{...}`         | `[]int{...}`             |
| **Length**        | Fixed at compile time | Can grow or shrink       |
| **Value Type**    | Yes                   | No (Reference Type)      |
| **Copy Behavior** | Creates a new copy    | References the same data |


## **Maps**

1. **Definition:**
   - Maps are used to store **key-value pairs** where the key type must be **unique** and **hashable**.

2. **Declaration:**
   - Using shorthand:
     ```go
     a := map[string]int{"a": 1, "b": 2}
     ```
   - Using `make`:
     ```go
     a := make(map[string]int)
     ```

3. **Operations:**
   - Accessing elements:
     ```go
     fmt.Println(a["a"]) // Output: 1
     ```
   - Adding elements:
     ```go
     a["c"] = 3
     ```
   - Deleting elements:
     ```go
     delete(a, "b")
     ```
   - Maps are **unordered**, so elements may not be returned in the order they were added.

4. **Checking Existence:**
   - Use **comma ok syntax** to check if a key exists:
     ```go
     value, ok := a["d"]
     if ok {
         fmt.Println("Key exists:", value)
     } else {
         fmt.Println("Key does not exist")
     }
     ```

5. **Properties:**
   - **Reference type**: Changes in one variable reflect in others pointing to the same map.
     ```go
     b := a
     b["d"] = 4
     fmt.Println(a["d"]) // Output: 4
     ```

## **Structs**

1. **Definition:**
   - Structs are **user-defined data types** that allow grouping of variables of different types.

2. **Declaration:**
   ```go
   type Doctor struct {
       number     int
       actorName  string
       companions []string
   }
   ```

3. **Initialization:**
   - Using field names:
     ```go
     aDoctor := Doctor{
         number:     3,
         actorName:  "Asif",
         companions: []string{"C", "D", "E"},
     }
     ```
   - Accessing fields:
     ```go
     fmt.Println(aDoctor.actorName) // Output: Asif
     ```

4. **Exporting Rules:**
   - Struct names starting with an uppercase letter are **exported**.
   - Fields must also start with an uppercase letter to be **visible outside the package**.

5. **Anonymous Structs:**
   ```go
   aDoctor := struct{name string}{name: "Anonymous"}
   fmt.Println(aDoctor) // Output: {Anonymous}
   ```

6. **Value Type:**
   - Structs are **value types** by default:
     ```go
     bDoctor := aDoctor
     bDoctor.actorName = "Ali"
     fmt.Println(aDoctor.actorName) // Output: Asif
     ```
   - Use pointers to modify the original struct:
     ```go
     bDoctor := &aDoctor
     bDoctor.actorName = "Ali"
     fmt.Println(aDoctor.actorName) // Output: Ali
     ```

7. **Embedding:**
   - Go uses **embedding** instead of inheritance:
     ```go
     type Animal struct {
         Name   string
         Origin string
     }

     type Bird struct {
         Animal
         SpeedKmH float32
     }

     b := Bird{
         Animal:   Animal{Name: "Eagle", Origin: "Australia"},
         SpeedKmH: 120,
     }
     fmt.Println(b.Name) // Output: Eagle
     ```

## **Pointers**

1. **Definition:**
   - Pointers store the **memory address** of a value.

2. **Declaration:**
   ```go
   var a int = 4
   var b *int = &a
   ```

3. **Dereferencing:**
   - Use `*` to access the value a pointer points to:
     ```go
     fmt.Println(*b) // Output: 4
     ```

4. **Properties:**
   - No pointer arithmetic.
   - Pointers default to `<nil>` if not initialized.

5. **Struct Pointers:**
   - Struct fields can be accessed directly through a pointer without explicit dereferencing:
     ```go
     type Person struct {
         Name string
     }

     var p = &Person{Name: "Alice"}
     fmt.Println(p.Name) // Output: Alice (equivalent to (*p).Name)
     ```

---
sidebar_position: 4
---

# Functions and Memory Management


## **Functions**

A **function** in C++ is a block of code designed to perform a specific task. Functions help in breaking down complex problems into smaller, manageable parts. They allow code reusability, making programs more modular and easier to maintain.

**1. Declaring a Function**

**Function declaration** (or function prototype) tells the compiler about the function's name, return type, and parameters (if any) before its actual definition.

**Syntax:**

```cpp
returnType functionName(parameterType1, parameterType2, ...);
```

**Example:**

```cpp
int add(int a, int b); // Function declaration
```

Here:

- `int` is the return type (the function will return an integer).
- `add` is the function name.
- `(int a, int b)` are the function parameters (two integers).

**2. Defining a Function**

**Function definition** provides the actual body of the function. It implements the functionality declared earlier.

**Syntax:**

```cpp
returnType functionName(parameterType1, parameterType2, ...) {
    // Code to perform the task
}
```

**Example:**

```cpp
int add(int a, int b) {  // Function definition
    return a + b;
}
```

Here:

- The function `add` takes two integer arguments and returns their sum.

**3. Function Parameters**

Parameters are values passed into a function to provide input to the function. There are two types of function parameters in C++:

- **Actual Parameters**: Values passed during the function call.
- **Formal Parameters**: Variables in the function declaration or definition that accept the actual parameters.
- **Default parameters**: Parameters with default values if none are passed.

**Example:**

```cpp
void printSum(int a, int b) {  // 'a' and 'b' are formal parameters
    cout << "Sum: " << a + b << endl;
}

int main() {
    printSum(5, 10);  // 5 and 10 are actual parameters
    return 0;
}
```

**4. Pass by Value**

In **pass-by-value**, a copy of the actual argument is passed to the function. Changes made to the parameter in the function do not affect the original argument.

**Example:**

```cpp
void increment(int a) {
    a = a + 1; // Only changes local 'a'
}

int main() {
    int x = 5;
    increment(x);
    cout << x; // Output: 5 (original 'x' remains unchanged)
    return 0;
}
```

In this case, `x` is passed by value, so the function operates on a copy of `x`.

**5. Pass by Reference**

In **pass-by-reference**, a reference (or address) to the actual argument is passed to the function. Changes made to the parameter directly affect the original argument.

**Syntax:**

```cpp
void functionName(type& parameter);
```

**Example:**

```cpp
void increment(int &a) {
    a = a + 1; // Directly modifies the original 'a'
}

int main() {
    int x = 5;
    increment(x);
    cout << x; // Output: 6 (original 'x' is modified)
    return 0;
}
```

In this case, `x` is passed by reference, so the function modifies the original value of `x`.

**6. Scope of Variables**

The **scope** of a variable determines where in the program it can be accessed. C++ has different types of variable scopes:

1. **Local Scope**: A variable declared inside a function or block. It is accessible only within that function/block.
    
    ```cpp
    void myFunction() {
        int x = 10;  // Local variable
        cout << x;
    }
    ```
    
2. **Global Scope**: A variable declared outside of any function. It is accessible throughout the program.
    
    ```cpp
    int x = 5; // Global variable
    void myFunction() {
        cout << x; // Accesses global 'x'
    }
    ```
    
3. **Function Scope**: Applies to parameters of a function; they exist only inside the function.
    
4. **Block Scope**: Variables declared within a block `{}` (such as loops or if statements) are only accessible inside that block.

**7. Function Overloading**

**Function overloading** allows multiple functions to have the same name but with different parameter types or a different number of parameters. The function to be called is determined by the arguments passed at the time of the function call.

**Syntax:**

```cpp
returnType functionName(parameterType1, parameterType2, ...);
```

**Example:**

```cpp
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

int main() {
    cout << add(3, 4) << endl;    // Calls the int version
    cout << add(3.5, 4.5) << endl; // Calls the double version
    return 0;
}
```

Here, two functions named `add` are defined with different parameter types (int and double). The correct one is chosen based on the arguments passed.

**8. Lambda Functions**

A **lambda function** is an anonymous function that can be defined inline. It can be used to create quick, short functions that can be passed as arguments or used locally.

**Syntax:**

```cpp
[ captures ] ( parameters ) -> returnType {
    // Function body
}
```

- **captures**: Used to capture variables from the surrounding scope (e.g., by reference or value).
- **parameters**: The input parameters.
- **returnType**: The return type (optional, can be inferred).

**Example:**

```cpp
#include <iostream>
using namespace std;

int main() {
    // Lambda function that adds two numbers
    auto add = [](int a, int b) -> int {
        return a + b;
    };
    
    cout << add(3, 4); // Output: 7
    return 0;
}
```

You can also capture variables from the surrounding scope:

```cpp
int x = 5;
auto print = [x]() {
    cout << x << endl;
};
print(); // Output: 5
```

## **Arrays and Matrices**

**1. Array**

An array is a collection of variables of the same data type stored in contiguous memory locations. Arrays allow us to store multiple values under a single name, accessed via an index.

- **Fixed size**: The size of an array is defined at compile time and cannot be changed dynamically.
- **Contiguous storage**: All elements are stored sequentially in memory.
- **Zero-based indexing**: The first element is accessed at index `0`, the second at `1`, and so on.

**Declaration and Initialization**

**Examples:**

```cpp
int numbers[5];                // Declaration (size is 5, values are uninitialized)
int numbers[5] = {10, 20, 30, 40, 50};  // Declaration and initialization
int numbers[] = {10, 20, 30};  // Compiler determines size (3)
```

**Accessing Array Elements:**

```cpp
cout << numbers[0];  // Accessing the first element (output: 10)
numbers[2] = 99;     // Updating the third element
```

**Looping Through an Array**

We often use loops to traverse or modify arrays:

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    for (int i = 0; i < 5; i++) {
        cout << arr[i] << " ";  // Output: 10 20 30 40 50
    }
    return 0;
}
```

**2. Matrix (Multidimensional Array)**

A matrix is essentially a two-dimensional array, where data is stored in rows and columns. You can extend this concept to multi-dimensional arrays.

**Declaration and Initialization**

**Examples:**

```cpp
int matrix[3][3];  // Declaration of a 3x3 matrix
int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};  // Initialization of a 2x3 matrix
```

Here:

- `matrix[0][0]` refers to the first element (row 0, column 0).
- `matrix[1][2]` refers to the element in the second row, third column.

**Accessing Matrix Elements**

**Example:**

```cpp
#include <iostream>
using namespace std;

int main() {
    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    cout << matrix[0][1];  // Output: 2 (row 0, column 1)
    return 0;
}
```

**Looping Through a Matrix**

To traverse a matrix, use nested loops:

```cpp
#include <iostream>
using namespace std;

int main() {
    int matrix[2][3] = {{1, 2, 3}, {4, 5, 6}};
    for (int i = 0; i < 2; i++) {       // Rows
        for (int j = 0; j < 3; j++) {   // Columns
            cout << matrix[i][j] << " ";
        }
        cout << endl;  // New line after each row
    }
    return 0;
}
```

**Output:**

```
1 2 3
4 5 6
```

### **Arrays in Functions**

When passing an array to a function in C++, it is passed **by reference** by default. This means the function gets the address of the first element of the array, not a copy of the entire array. As a result, changes made to the array inside the function affect the original array.

**Why Arrays Are Passed by Reference**

- Efficiency: Passing a large array by value would require copying all its elements, which is memory- and time-intensive.
- By passing the address, the function can work directly with the original data.

**Example**

```cpp
#include <iostream>
using namespace std;

void printArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;
}

void modifyArray(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        arr[i] += 10;  // Modifying original array
    }
}

int main() {
    int numbers[] = {1, 2, 3, 4, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);

    cout << "Original array: ";
    printArray(numbers, size);

    modifyArray(numbers, size);  // Passing array to modify
    cout << "Modified array: ";
    printArray(numbers, size);

    return 0;
}
```

**Output:**

```
Original array: 1 2 3 4 5
Modified array: 11 12 13 14 15
```

**Why Pointers Came Into Picture**

When dealing with arrays or dynamically allocated memory, **pointers** are essential. A pointer stores the **memory address** of a variable or data structure, enabling:

1. Efficient data access and manipulation (especially for large arrays).
2. Dynamic memory allocation.
3. Access to heap memory for creating data structures like linked lists and trees.

## **Pointers**

A pointer is a variable that stores the memory address of another variable.

**Declaration and Initialization**

```cpp
dataType* pointerName;  // Declaration
pointerName = &variable;  // Initialization
```

**Example:**

```cpp
#include <iostream>
using namespace std;

int main() {
    int num = 10;
    int* ptr = &num;  // Pointer stores the address of 'num'

    cout << "Value of num: " << num << endl;
    cout << "Address of num: " << &num << endl;
    cout << "Pointer ptr stores address: " << ptr << endl;
    cout << "Value at address stored in ptr: " << *ptr << endl;  // Dereferencing

    *ptr = 20;  // Changing value using pointer
    cout << "Updated value of num: " << num << endl;

    return 0;
}
```

**Output:**

```
Value of num: 10
Address of num: 0x61ff08
Pointer ptr stores address: 0x61ff08
Value at address stored in ptr: 10
Updated value of num: 20
```

## **Heap and Stack Memory**

In C++ and many other programming languages, memory is broadly divided into **stack** and **heap**. Both serve as memory storage areas but are used for different purposes and have distinct characteristics.

**1. Stack Memory**

- **Stack memory** is used for static memory allocation. It stores:
    - Local variables.
    - Function call-related information (like parameters and return addresses).
- Operates in a **Last In, First Out (LIFO)** manner.

| Feature        | Details                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| **Allocation** | Happens automatically when a function is called.                               |
| **Lifetime**   | Limited to the scope of the function. Memory is freed when the function exits. |
| **Size**       | Fixed and smaller compared to heap memory.                                     |
| **Speed**      | Very fast due to its structured nature (LIFO).                                 |
| **Management** | Managed by the compiler; no manual intervention needed.                        |

**Example**

```cpp
#include <iostream>
using namespace std;

void display() {
    int x = 10;  // x is stored in stack memory
    cout << "Value of x: " << x << endl;
}  // x is destroyed when display() ends

int main() {
    display();
    // x no longer exists here
    return 0;
}
```

In the above example:

- `x` is a local variable stored in stack memory.
- Memory for `x` is automatically deallocated when `display()` exits.

**2. Heap Memory**

- Heap memory is used for dynamic memory allocation. It allows memory to be allocated or freed explicitly during runtime using commands like `new` and `delete` (in C++).

| Feature        | Details                                                                         |
| -------------- | ------------------------------------------------------------------------------- |
| **Allocation** | Happens manually using `new`.                                                   |
| **Lifetime**   | Memory remains allocated until explicitly freed using `delete`.                 |
| **Size**       | Larger and more flexible than stack.                                            |
| **Speed**      | Slower due to dynamic allocation and manual management.                         |
| **Management** | Managed by the programmer, not the compiler. Mistakes can lead to memory leaks. |

**Example**

```cpp
#include <iostream>
using namespace std;

int main() {
    int* ptr = new int;  // Allocates memory in heap
    *ptr = 20;

    cout << "Value: " << *ptr << endl;

    delete ptr;  // Deallocates memory from heap
    ptr = nullptr;  // Avoids dangling pointer

    return 0;
}
```

In the above example:

- Memory for `*ptr` is allocated on the heap using `new`.
- It's explicitly deallocated using `delete` to avoid memory leaks.

**Example: Dynamically Allocating an Array for User-Entered Data**

```cpp
#include <iostream>
using namespace std;

int main() {
    int size;

    // Ask the user to enter the size of the array
    cout << "Enter the number of elements you want to store: ";
    cin >> size;

    // Dynamically allocate an array of the given size in heap memory
    int* arr = new int[size];

    // Input elements into the array
    cout << "Enter " << size << " integers:" << endl;
    for (int i = 0; i < size; i++) {
        cin >> arr[i];
    }

    // Display the entered elements
    cout << "You entered: ";
    for (int i = 0; i < size; i++) {
        cout << arr[i] << " ";
    }
    cout << endl;

    // Perform some operations on the array (e.g., finding the sum of elements)
    int sum = 0;
    for (int i = 0; i < size; i++) {
        sum += arr[i];
    }
    cout << "The sum of the elements is: " << sum << endl;

    // Free the dynamically allocated memory
    delete[] arr;

    // Nullify the pointer to avoid dangling pointer issues
    arr = nullptr;

    return 0;
}
```

**Explanation**

1. **Dynamic Memory Allocation**:
    
    - The array `arr` is allocated on the heap using `new int[size]`, where `size` is entered by the user.
    - This makes the program flexible, as the size of the array does not need to be known at compile time.
2. **Input and Operations**:
    
    - The program collects data from the user, stores it in the dynamically allocated array, and performs operations like summing the elements.
3. **Memory Deallocation**:
    
    - After the array is no longer needed, its memory is released using `delete[] arr` to prevent memory leaks.
4. **Pointer Nullification**:
    
    - The pointer `arr` is set to `nullptr` after deallocation to avoid **dangling pointers**, which can lead to undefined behavior if accessed.

**Sample Run**

**Input:**

```
Enter the number of elements you want to store: 5
Enter 5 integers:
10 20 30 40 50
```

**Output:**

```
You entered: 10 20 30 40 50
The sum of the elements is: 150
```

**Example: Pointers with Arrays**

```cpp
#include <iostream>
using namespace std;

int main() {
    int arr[] = {10, 20, 30, 40};
    int* ptr = arr;  // Pointer to the first element of the array

    for (int i = 0; i < 4; i++) {
        cout << *(ptr + i) << " ";  // Accessing elements using pointer arithmetic
    }

    return 0;
}
```

**Output:**

```
10 20 30 40
```

**Key Differences Between Stack and Heap**

| Feature                     | Stack                              | Heap                              |
| --------------------------- | ---------------------------------- | --------------------------------- |
| **Usage**                   | Local variables, function calls.   | Dynamically allocated memory.     |
| **Size**                    | Smaller, limited by OS.            | Larger, depends on system memory. |
| **Access Speed**            | Faster (organized as LIFO).        | Slower (needs to find space).     |
| **Lifetime**                | Automatic, tied to scope.          | Manual, controlled by programmer. |
| **Allocation/Deallocation** | Automatic (managed by compiler).   | Manual (`new`/`delete`).          |
| **Errors**                  | Rare, but stack overflow possible. | Memory leaks, dangling pointers.  |

**Use Cases**

| **Use Case**            | **Stack**                              | **Heap**                                    |
| ----------------------- | -------------------------------------- | ------------------------------------------- |
| **Small, Fixed Data**   | Local variables, recursion.            | Not ideal.                                  |
| **Large, Dynamic Data** | Not suitable (limited size).           | Arrays, objects, dynamic structures.        |
| **Temporary Variables** | Ideal for variables within scope.      | Not used for temporary data.                |
| **Persistent Data**     | Not suitable (lifetime tied to scope). | Suitable for data persisting across scopes. |

**Common Issues**

**Stack:**

- **Stack Overflow**: Happens when too much memory is used, often due to deep recursion or large local variables.

**Heap:**

- **Memory Leaks**: Forgetting to free allocated memory with `delete`.
- **Dangling Pointers**: Accessing memory after it’s been freed.

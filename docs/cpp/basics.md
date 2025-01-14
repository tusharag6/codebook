---
sidebar_position: 2
---
# Basics of C++

## **Variables**

A variable is a name given to a memory location that can hold a value. The value of a variable can be changed during program execution.

**Example**

```cpp
#include <iostream>
using namespace std;

int main() {
    int age = 25;     // Variable to store age
    float height = 5.9; // Variable to store height
    char grade = 'A'; // Variable to store grade

    cout << "Age: " << age << ", Height: " << height << ", Grade: " << grade << endl;
    return 0;
}
```

**Rules for Variables**

1. Must start with a letter or an underscore (`_`), not a digit.
2. Can contain letters, digits, and underscores.
3. Cannot use reserved keywords (e.g., `int`, `float`).


## **Constants**

A constant is a value that cannot be changed during program execution.

**Types of Constants**

1. **`const` Keyword**:
    - Used to declare variables whose values cannot change.
    - Example:
        ```cpp
        const float PI = 3.14159; // PI is a constant
        ```
        
2. **`#define` Preprocessor Directive**:
    - Used to define symbolic constants.
    - Example:
        ```cpp
        #define MAX_SIZE 100
        ```
        
3. **Enumerations (`enum`)**:
    - A way to define a set of named integer constants.
    - Example:
        ```cpp
        enum Colors { RED, GREEN, BLUE };
        ```

 **Example**

```cpp
#include <iostream>
using namespace std;

#define MAX_SCORE 100 // Symbolic constant

int main() {
    const float PI = 3.14159; // Constant using 'const'

    cout << "Maximum Score: " << MAX_SCORE << endl;
    cout << "Value of PI: " << PI << endl;

    // Uncommenting below will cause an error because PI is constant
    // PI = 3.14; 

    return 0;
}
```


## **Identifiers**

An **identifier** is the name used to identify variables, constants, functions, classes, or any user-defined entity in C++.

**Rules for Identifiers**

1. Must begin with a letter (A-Z or a-z) or an underscore (`_`).
2. Can contain letters, digits (0-9), and underscores.
3. Cannot use reserved C++ keywords (e.g., `int`, `return`, `class`).
4. Must be unique within its scope.

**Examples**

Valid identifiers:

```cpp
int age;
float salary;
char _grade;
```

Invalid identifiers:

```cpp
int 1stAge;     // Starts with a digit
float salary$;  // Contains invalid character $
char class;     // Uses a reserved keyword
```

**Best Practices for Identifiers**

- Use meaningful names that describe the purpose of the variable or constant.
    ```cpp
    int numberOfStudents;
    float averageMarks;
    ```
- Use camelCase or snake_case for multi-word identifiers. Example: `total_score` or `totalScore`

## **Data Types**

Data types in C++ define the type of data that a variable can hold. They are crucial for memory management and operations on data. Each data type determines:
- The size of memory allocated.
- The kind of operations that can be performed.

**Classification of Data Types**

C++ data types are broadly categorized into:
1. **Primitive Data Types**: Basic types like `int`, `float`, `char`.
2. **Derived Data Types**: Arrays, pointers, references.
3. **User-Defined Data Types**: Structures, classes, enums.
4. **Void Type**: Represents no value.

**Modifiers**

Data types can be modified with the following:

1. **Signed**: Default for numeric types; allows negative and positive values.
2. **Unsigned**: Allows only positive values.
3. **Short**: Reduces the size of the data type.
4. **Long**: Increases the size of the data type.

<!-- ![data types in cpp sizes](image.png) -->


## **Casting**

Casting is the process of converting one data type into another. It is often required when operations involve different data types or when specific type conversion is needed.

**Types of Casting**

**1. Implicit Casting (Type Promotion)**

The compiler automatically converts one data type into another when no data loss occurs.

**Example:**

```cpp
int a = 5;
float b = a; // Implicit casting from int to float
```

**2. Explicit Casting (Type Conversion)**

The programmer manually specifies the type to convert into using **C-style casting** or **C++ casting operators**.

**Example:**

```cpp
int a = 5;
float b = (float)a; // C-style cast
float c = static_cast<float>(a); // C++ cast
```

**Casting Operators**

1. **`static_cast`**: For simple and safe type conversions.
    
    ```cpp
    double d = 3.14;
    int i = static_cast<int>(d); // Converts double to int
    ```
    
2. **`dynamic_cast`**: For casting pointers and references in inheritance hierarchies (requires polymorphism).
    
    ```cpp
    Base* b = new Derived();
    Derived* d = dynamic_cast<Derived*>(b);
    ```
    
3. **`const_cast`**: Adds or removes `const` from a variable.
    
    ```cpp
    const int a = 10;
    int& b = const_cast<int&>(a);
    ```
    
4. **`reinterpret_cast`**: Reinterprets the memory of a variable as another type (used sparingly).
    
    ```cpp
    int* p = new int(5);
    char* c = reinterpret_cast<char*>(p);
    ```
    

## **User Input**

**1. `cin`**

`cin` is part of the `iostream` library and is used to take input from the standard input (keyboard). It stops reading input when it encounters:
- A space
- A tab
- A newline character

**Example**

```cpp
#include <iostream>
using namespace std;

int main() {
    int age;
    cout << "Enter your age: ";
    cin >> age; // Reads an integer
    cout << "You are " << age << " years old." << endl;

    return 0;
}
```

**Limitations of `cin`**

- It does not handle strings with spaces well.
- Multiple inputs in one line can lead to unexpected behavior.

**2. `getline`**

`getline` reads an entire line, including spaces, until a newline character (`\n`) is encountered. It is especially useful for handling strings with spaces.

**Example**

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    string fullName;
    cout << "Enter your full name: ";
    getline(cin, fullName); // Reads the entire line
    cout << "Hello, " << fullName << "!" << endl;

    return 0;
}
```

**Combining `getline` and `cin`**

When mixing `cin` and `getline`, you may encounter input issues due to the leftover newline character in the input buffer. Use `cin.ignore()` to clear the buffer.

**Example**

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int age;
    string name;

    cout << "Enter your age: ";
    cin >> age;

    cin.ignore(); // Clear the newline left by cin
    cout << "Enter your full name: ";
    getline(cin, name);

    cout << "Hello, " << name << "! You are " << age << " years old." << endl;

    return 0;
}
```

**Key Differences Between `cin` and `getline`**

| **Feature**        | **`cin`**                             | **`getline`**                                       |
| ------------------ | ------------------------------------- | --------------------------------------------------- |
| **Reads Input**    | Stops at whitespace                   | Reads until newline (`\n`)                          |
| **Handles Spaces** | Cannot handle spaces in input         | Handles spaces perfectly                            |
| **Usage**          | Ideal for single-word inputs          | Ideal for full lines of text or strings with spaces |
| **Buffer Issues**  | May leave newline character in buffer | Does not cause buffer issues                        |

**Practical Example of Both**

```cpp
#include <iostream>
#include <string>
using namespace std;

int main() {
    int rollNumber;
    string fullName;

    cout << "Enter your roll number: ";
    cin >> rollNumber;

    cin.ignore(); // Clear the buffer
    cout << "Enter your full name: ";
    getline(cin, fullName);

    cout << "Roll Number: " << rollNumber << endl;
    cout << "Name: " << fullName << endl;

    return 0;
}
```

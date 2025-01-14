---
sidebar_position: 3
---

# Control Flow

## **Operators**

Operators are symbols that perform operations on variables and values. 
**1. Arithmetic Operators**

| **Operator** | **Description**    | **Example** |
| ------------ | ------------------ | ----------- |
| `+`          | Addition           | `a + b`     |
| `-`          | Subtraction        | `a - b`     |
| `*`          | Multiplication     | `a * b`     |
| `/`          | Division           | `a / b`     |
| `%`          | Modulo (remainder) | `a % b`     |

**2. Relational (Comparison) Operators**

| **Operator** | **Description**       | **Example** |
| ------------ | --------------------- | ----------- |
| `==`         | Equal to              | `a == b`    |
| `!=`         | Not equal to          | `a != b`    |
| `<`          | Less than             | `a < b`     |
| `>`          | Greater than          | `a > b`     |
| `<=`         | Less than or equal    | `a <= b`    |
| `>=`         | Greater than or equal | `a >= b`    |

**3. Logical Operators**

| **Operator** | **Description**        | **Example** |
| ------------ | ---------------------- | ----------- |
| `&&`         | Logical AND            | `a && b`    |
| `            |                        | `           |
| `!`          | Logical NOT (negation) | `!a`        |

**4. Bitwise Operators**

| **Operator** | **Description** | **Example** |
| ------------ | --------------- | ----------- |
| `&`          | Bitwise AND     | `a & b`     |
| `            | `               | Bitwise OR  |
| `^`          | Bitwise XOR     | `a ^ b`     |
| `~`          | Bitwise NOT     | `~a`        |
| `<<`         | Left shift      | `a << 2`    |
| `>>`         | Right shift     | `a >> 2`    |

**5. Assignment Operators**

| **Operator** | **Description**     | **Example** |
| ------------ | ------------------- | ----------- |
| `=`          | Simple assignment   | `a = 5`     |
| `+=`         | Add and assign      | `a += 5`    |
| `-=`         | Subtract and assign | `a -= 5`    |
| `*=`         | Multiply and assign | `a *= 5`    |
| `/=`         | Divide and assign   | `a /= 5`    |
| `%=`         | Modulo and assign   | `a %= 5`    |

**6. Unary Operators**

| **Operator** | **Description**        | **Example**    |
| ------------ | ---------------------- | -------------- |
| `++`         | Increment (pre/post)   | `++a` or `a++` |
| `--`         | Decrement (pre/post)   | `--a` or `a--` |
| `+`          | Unary plus (positive)  | `+a`           |
| `-`          | Unary minus (negative) | `-a`           |
| `!`          | Logical NOT            | `!a`           |
| `~`          | Bitwise NOT            | `~a`           |

**7. Ternary Operator (Conditional Operator)**

| **Operator** | **Description**       | **Example**                                          |
| ------------ | --------------------- | ---------------------------------------------------- |
| `? :`        | Conditional (ternary) | `a > b ? a : b` (returns `a` if true, `b` otherwise) |

**8. Increment and Decrement Operators**

| **Operator** | **Description** | **Example**    |
| ------------ | --------------- | -------------- |
| `++`         | Increment by 1  | `a++` or `++a` |
| `--`         | Decrement by 1  | `a--` or `--a` |

**9. Type-Casting Operators**

| **Operator**         | **Description**                 | **Example**                    |
| -------------------- | ------------------------------- | ------------------------------ |
| `static_cast<>`      | C++ type cast                   | `static_cast<int>(a)`          |
| `dynamic_cast<>`     | Safe casting (for polymorphism) | `dynamic_cast<Base*>(obj)`     |
| `reinterpret_cast<>` | Low-level casting               | `reinterpret_cast<char*>(ptr)` |
| `const_cast<>`       | Modify const attribute          | `const_cast<int*>(&a)`         |

**10. Sizeof Operator**

| **Operator** | **Description**             | **Example**   |
| ------------ | --------------------------- | ------------- |
| `sizeof`     | Size of data type or object | `sizeof(int)` |

**11. Scope Resolution Operator `::`**

| **Operator** | **Description**      | **Example**                                             |
| ------------ | -------------------- | ------------------------------------------------------- |
| `::`         | Used to define scope | `std::cout` (accessing `cout` from the `std` namespace) |

**12. Comma Operator `,`**

| **Operator** | **Description**       | **Example**           |
| ------------ | --------------------- | --------------------- |
| `,`          | Separates expressions | `a = (b = 10, b + 2)` |


## **Conditional Statement**

**1. `if-else` Statement**

The `if-else` statement is used to make decisions based on conditions. It executes a block of code if the condition is true, and another block if the condition is false.

**Syntax:**

```cpp
if (condition) {
    // Code to execute if condition is true
} else {
    // Code to execute if condition is false
}
```

You can also have multiple `else if` blocks for multiple conditions:

```cpp
if (condition1) {
    // Code for condition1
} else if (condition2) {
    // Code for condition2
} else {
    // Code if neither condition1 nor condition2 is true
}
```

**Example:**

```cpp
int a = 5;
if (a > 0) {
    cout << "Positive number";
} else {
    cout << "Non-positive number";
}
```

**2. `switch` Statement**

The `switch` statement is used to select one of many code blocks to be executed based on the value of a variable. It is often used when there are multiple conditions to check for a single variable.

**Syntax:**

```cpp
switch (expression) {
    case value1:
        // Code to execute if expression == value1
        break;
    case value2:
        // Code to execute if expression == value2
        break;
    default:
        // Code to execute if no case matches
}
```

- **`break`**: Exits the `switch` block after a case is executed.
- **`default`**: A catch-all for cases not explicitly listed.

**Example:**

```cpp
int day = 3;
switch (day) {
    case 1:
        cout << "Monday";
        break;
    case 2:
        cout << "Tuesday";
        break;
    case 3:
        cout << "Wednesday";
        break;
    default:
        cout << "Invalid day";
}
```

**Key Differences**

- **`if-else`**: Used for checking more complex conditions (e.g., relational, logical).
- **`switch`**: Used when you have multiple fixed values (usually integers or characters) to check against a single variable.

## **Loops**

Loops are used to execute a block of code repeatedly as long as a condition is true. C++ provides three types of loops:

**1. `for` Loop**

The `for` loop is used when the number of iterations is known beforehand.

**Syntax:**

```cpp
for (initialization; condition; increment/decrement) {
    // Code to execute
}
```

- **Initialization**: Initializes a variable.
- **Condition**: Checks the condition before each iteration.
- **Increment/Decrement**: Updates the loop control variable after each iteration.

**Example:**

```cpp
for (int i = 0; i < 5; i++) {
    cout << i << " ";  // Output: 0 1 2 3 4
}
```

**2. `while` Loop**

The `while` loop is used when the number of iterations is not known, and the condition is checked before each iteration.

**Syntax:**

```cpp
while (condition) {
    // Code to execute
}
```

- The loop continues executing as long as the condition is true.

**Example:**

```cpp
int i = 0;
while (i < 5) {
    cout << i << " ";  // Output: 0 1 2 3 4
    i++;
}
```

**3. `do-while` Loop**

The `do-while` loop is similar to the `while` loop, but the condition is checked after each iteration, ensuring that the loop executes at least once.

**Syntax:**

```cpp
do {
    // Code to execute
} while (condition);
```

- The loop executes once, then checks the condition to determine whether to continue.

**Example:**

```cpp
int i = 0;
do {
    cout << i << " ";  // Output: 0 1 2 3 4
    i++;
} while (i < 5);
```

**Key Differences**

- **`for`**: Best used when the number of iterations is known.
- **`while`**: Used when the condition needs to be checked before each iteration.
- **`do-while`**: Used when the loop must execute at least once before checking the condition.

---
sidebar_position: 1
---
# Introduction

## **General Overview**

**Key Characteristics**

1. **Platform Dependent**: Programs written in C++ are compiled into machine code that is specific to the operating system and hardware architecture. The compiled code needs to be recompiled to run on different platforms.

2. **Object-Oriented Language**: It is an object-oriented programming (OOP) language, building upon the principles of encapsulation, inheritance, and polymorphism.

3. **Statically Typed**: C++ is statically typed, meaning the type of a variable is determined at compile time. This ensures type safety and helps catch errors early in the development process.

4. **Speed and Performance**: 
	- It operates close to the system, providing low-level memory manipulation and access.
	- It offers enough abstraction to be easier to write than assembly language.
	- It balances performance with developer productivity, making it ideal for system-level programming and applications requiring high efficiency. 

5. **Pointers**: C++ provides pointers, which allow direct memory manipulation, making it a powerful tool for system programming. 
	 Pointers enable:
	- Dynamic memory allocation.
	- Access to hardware and system-level resources.
	- Efficient data manipulation without redundant copies.

**History of C++**

1. **Origins**
    - Inspired by the Simula language, which introduced object-oriented programming (OOP).
    - Initial attempts to combine OOP with Simula failed due to performance issues and a significant drop in speed.

2. **Transition from C**
    - The idea of integrating OOP into C emerged, resulting in a practical and performant language.
    - This approach was similar to the relationship between JavaScript and TypeScript, where new features (OOP in this case) were added to an existing language (C).

3. **Development Process**
    - A new compiler, **Cfront**, was introduced.
    - A preprocessor language, **Cpre**, stripped the OOP features from the code and converted it into standard C code.
    - This repackaging led to the creation of **C++**, which maintained the speed of C while incorporating OOP principles.

**Key Versions of C++**

| Version   | Features                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------- |
| **C++11** | Introduced **auto**, **lambdas**, and **smart pointers**, improving readability and memory safety. |
| **C++14** | Enhanced **generics**, making templates more powerful and flexible.                                |
| **C++17** | Further advancements like structured bindings, `std::optional`, and other modern features.         |
| **C++20** | Added concepts, ranges, and coroutines for even greater versatility.                               |
| **C++23** | Introduced modules and improved standard libraries.                                                |


## **Hello World Code**

```cpp
#include <iostream>
using namespace std;

int main() {
  cout << "hello world";
  return 0;
}
```

 **1. `#include <iostream>`**
- **Purpose**: This is a **preprocessor directive** that includes the standard C++ **input/output stream library**.
- **How it works**:
    - During the **preprocessing phase** (before compilation), the preprocessor replaces `#include <iostream>` with the content of the `iostream` header file.
    - The `iostream` library provides definitions for input/output stream objects like:
        - `std::cin` (standard input)
        - `std::cout` (standard output)
        - `std::cerr` (standard error)
    - `iostream` is part of the **Standard Template Library (STL)** and helps manage formatted input/output.

 **2. `using namespace std;`**
- **Purpose**: This line allows you to avoid prefixing standard library entities with `std::`. For example:
    - Without `using namespace std;`: `std::cout << "hello world";`
    - With `using namespace std;`: `cout << "hello world";`
- **How it works**:
    - The `std` namespace contains all standard library identifiers.
    - `using namespace std;` brings all names in the `std` namespace into the global scope.
    - While convenient, it can cause name conflicts in larger programs and is generally discouraged in professional codebases. Instead, explicitly qualify identifiers, like `std::cout`.
- Example of other namespace: qt, eigen.

**3. `int main()`**
- **Purpose**: The `main` function serves as the **entry point** of any C++ program.
- **How it works**:
    - The operating system calls the `main` function to start the program execution.
    - It returns an integer (`int`) to indicate the program's exit status:
        - `0` usually indicates successful execution.
        - Non-zero values indicate errors.
    - The parentheses `()` after `main` indicate that this function takes no arguments (although it can optionally take arguments for command-line input, e.g., `int main(int argc, char* argv[])`).

 **4. `cout`**
- **Purpose**: `cout` (short for "character output") is used to print text to the console.
- **How it works**:
    - `cout` is an object of the `ostream` class defined in `<iostream>`.
    - When you use `cout`, you're writing to the standard output stream (`stdout`), which is usually the terminal.
    - `<<` is the **insertion operator**, used to send data to the `cout` stream.
    - Internally:
        - `cout` formats the data and sends it to the operating system's I/O buffer.
        - The OS eventually displays the data on the screen.

**5. `"hello world"`**
- **Purpose**: This is a string literal.
- **How it works**:
    - The string is stored in the program's **read-only memory** during runtime.
    - The `cout` stream sends the characters in the string sequentially to the output buffer.

**6. `return 0;`**

- **Purpose**: Ends the execution of the `main` function and returns the value `0` to the operating system.
- **How it works**:
    - `return 0;` indicates the program terminated successfully.
    - The return value is captured by the OS, which can use it to determine if the program ran without errors.
    - If you omit `return 0;` in C++ (from C++11 onward), the compiler implicitly assumes `return 0;` in the `main` function.


## **Stages of Compilation**

**Step 1: Preprocessing**

- **Purpose**: Handle preprocessor directives like `#include`, `#define`, and `#ifdef`.
- **Key Actions**:
    - Replace macros (`#define`) with their values.
    - Include the contents of header files (`#include`) directly into the source file.
    - Remove comments from the code.
- **Result**: A "translation unit," which is an expanded version of the original source code.

**Example**:
 
Source Code:

```cpp
#include <iostream>
#define PI 3.14
int main() {
    std::cout << "Value of PI: " << PI << std::endl;
    return 0;
}
```

After Preprocessing:

```cpp
// Header content from <iostream> included here
int main() {
    std::cout << "Value of PI: " << 3.14 << std::endl;
    return 0;
}
```

**Step 2: Compilation**

- **Purpose**: Convert the preprocessed code into **assembly language**.
- **Key Actions**:
    - Analyze the code for syntax and semantic correctness.
    - Translate high-level constructs (e.g., loops, functions) into assembly instructions.
- **Result**: An **assembly file** (`.s` or `.asm`) representing low-level operations for the target CPU.

**Step 3: Assembly**

- **Purpose**: Convert assembly language into **machine code** (binary instructions specific to the CPU).
- **Key Actions**:
    - Translate assembly instructions into binary opcodes.
    - Assign memory addresses to instructions and variables.
- **Result**: An **object file** (`.o` or `.obj`) containing machine code.

**Step 4: Linking**

- **Purpose**: Combine one or more object files and libraries into a single executable.
- **Key Actions**:
    - Resolve **external symbols** (e.g., functions or variables declared but not defined in the current file).
    - Link static libraries (e.g., `libstdc++` for C++ standard library functions).
    - Generate the final **executable** file.
- **Result**: A complete **executable binary** (`a.out` on Linux or `.exe` on Windows).

| **Input**                | **Stage**     | **Output**                  |
| ------------------------ | ------------- | --------------------------- |
| Source Code (`.cpp`)     | Preprocessing | Preprocessed Code (`.i`)    |
| Preprocessed Code (`.i`) | Compilation   | Assembly Code (`.s`)        |
| Assembly Code (`.s`)     | Assembly      | Object File (`.o`)          |
| Object Files (`.o`)      | Linking       | Executable (`.exe`/`a.out`) |

**Tools in the Compilation Process**

- **Preprocessor**: Part of the compiler that handles preprocessor directives (e.g., `g++` does this internally).
- **Compiler**: Converts high-level code to assembly (e.g., `gcc` or `g++`).
- **Assembler**: Converts assembly code to object code (e.g., `as`).
- **Linker**: Combines object files and resolves external references (e.g., `ld`).

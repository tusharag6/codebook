---
sidebar_position: 1
---

# Basics of OOP (Object-oriented programming)

## Classes

A class is a user-defined data type, which holds its own data members and member functions, which can be accessed and used by creating an instance of that class. A C++ class is like a blueprint for an object.

**Syntax of a Class:**

```cpp
class ClassName {
public:     // Access modifier
    // Attributes (data members)
    dataType attribute1;
    dataType attribute2;

    // Methods (member functions)
    void methodName() {
        // Code
    }
};
```

## Objects

When a class is defined, only the specification for the object is defined; no memory or storage is allocated. To use the data and access functions defined in the class, you need to create objects.

**Syntax to Create an Object:**

```cpp
ClassName objectName;
```

**Example:**

```cpp
class Car {
public:
    string brand;
    int speed;

    void displayDetails() {
        cout << "Brand: " << brand << ", Speed: " << speed << endl;
    }
};

int main() {
    Car car1;               // Object of class Car
    car1.brand = "Toyota";  // Accessing and modifying attributes
    car1.speed = 120;

    car1.displayDetails();  // Calling method of class Car
    return 0;
}
```

## Access Modifiers

Access modifiers define how attributes and methods of a class can be accessed. C++ provides three basic access modifiers:

1. **Public**:
    
    - Members are accessible from anywhere (inside and outside the class).
    - Suitable for methods that should be available to users of the class.
    
    **Example:**
    
    ```cpp
    class Car {
    public:
        string brand;  // Public attribute
    };
    
    int main() {
        Car car1;
        car1.brand = "Toyota";  // Accessible directly
        cout << car1.brand;
        return 0;
    }
    ```
    
2. **Private**:
    
    - Members are accessible only from within the class.
    - Used for data hiding and protecting sensitive information.
    
    **Example:**
    
    ```cpp
    class Car {
    private:
        string brand;  // Private attribute
    public:
        void setBrand(string b) {
            brand = b;  // Accessing private member within the class
        }
        string getBrand() {
            return brand;  // Accessing private member within the class
        }
    };
    
    int main() {
        Car car1;
        car1.setBrand("Toyota");  // Setting value using public method
        cout << car1.getBrand();  // Accessing value using public method
        return 0;
    }
    ```
    
3. **Protected**:
    
    - Members are accessible only within the class and derived classes.
    - It is used in inheritance scenarios (more details can be discussed later).

## Constructor

A **constructor** is a special method invoked automatically when an object of a class is created. It initializes the object. Constructors have the same name as the class and no return type.

**Types of Constructors:**

1. **Default Constructor**
2. **Parameterized Constructor**
3. **Copy Constructor**
4. **Delegating Constructor**

### i. Default Constructor

- A default constructor takes no arguments.
- It initializes members to default values.
- Automatically called when an object is created without passing arguments.

**Example:**

```cpp
#include <iostream>
#include <vector>

using namespace std;

class Chai {
public:
    string teaName;
    int servings;
    vector<string> ingredients;

    // Default constructor
    Chai() {
        teaName = "Unknown Tea";
        servings = 1;
        ingredients = {"Water", "Tea leaves"};
        cout << "Constructor called" << endl;
    }

    void displayChaiDetails() {
        cout << "Tea Name: " << teaName << endl;
        cout << "Servings: " << servings << endl;
        cout << "Ingredients: ";
        for (string ingredient : ingredients) {
            cout << ingredient << " ";
        }
        cout << endl;
    }
};

int main() {
    Chai defaultChai;  // Default constructor is invoked here
    defaultChai.displayChaiDetails();
    return 0;
}
```

**Output:**

```
Constructor called
Tea Name: Unknown Tea
Servings: 1
Ingredients: Water Tea leaves 
```

### ii. Parameterized Constructor

- A parameterized constructor allows initializing object attributes with specific values by passing arguments.

**Code Example:**

```cpp
#include <iostream>
#include <vector>

using namespace std;

class Chai {
public:
    string teaName;
    int servings;
    vector<string> ingredients;

    // Parameterized constructor
    Chai(string name, int serve, vector<string> ingr) {
        teaName = name;
        servings = serve;
        ingredients = ingr;
        cout << "Param constructor called" << endl;
    }

    void displayChaiDetails() {
        cout << "Tea Name: " << teaName << endl;
        cout << "Servings: " << servings << endl;
        cout << "Ingredients: ";
        for (string ingredient : ingredients) {
            cout << ingredient << " ";
        }
        cout << endl;
    }
};

int main() {
    Chai lemonTea("Lemon Tea", 2, {"Water", "Lemon", "Honey"});  // Parameterized constructor is invoked here
    lemonTea.displayChaiDetails();
    return 0;
}
```

**Output:**

```
Param constructor called
Tea Name: Lemon Tea
Servings: 2
Ingredients: Water Lemon Honey 
```

### iii. Copy Constructor

**Problem: Double Deletion**

Consider the scenario where a class dynamically allocates memory using `new`. When an object is copied without using a custom **copy constructor**, the default copy constructor performs **shallow copying**. This means:

1. Both the original and the copied objects share the same memory address for the dynamically allocated resource.
2. When one object is destroyed, its destructor releases the memory.
3. If the copied object is destroyed afterward, it tries to release the same memory again, causing **double deletion**.

**Example**

```cpp
#include <iostream>
using namespace std;

class Example {
public:
    int* data;

    // Constructor
    Example(int value) {
        data = new int(value);  // Dynamic allocation
        cout << "Constructor called. Allocated memory for data." << endl;
    }

    // Destructor
    ~Example() {
        delete data;  // Free memory
        cout << "Destructor called. Freed memory for data." << endl;
    }
};

int main() {
    Example obj1(10);  // Constructor allocates memory
    Example obj2 = obj1;  // Default copy constructor performs shallow copy

    // Both obj1 and obj2 point to the same dynamically allocated memory.
    return 0;
}
```

**Output:**

```
Constructor called. Allocated memory for data.
Destructor called. Freed memory for data.
Destructor called. Freed memory for data.  // Error: Double deletion
```

**What Happened?**

- When `obj2` was created using `obj1`, they shared the same `data` pointer.
- `~Example` was called for both `obj1` and `obj2`, attempting to free the same memory twice, resulting in a crash.

 **Solution: Copy Constructor**

A **copy constructor** solves this problem by performing **deep copying** instead of shallow copying. In deep copying:

1. A new memory allocation is made for the copied object.
2. The values are copied into this new memory, ensuring the original and the copied object do not share the same memory address.

**Syntax of Copy Constructor:**

```cpp
ClassName(const ClassName& other);
```

- Takes a reference to the object being copied as a parameter.

**Example**

Let's modify the above example to use a custom copy constructor.

```cpp
#include <iostream>
using namespace std;

class Example {
public:
    int* data;

    // Constructor
    Example(int value) {
        data = new int(value);  // Dynamic allocation
        cout << "Constructor called. Allocated memory for data." << endl;
    }

    // Copy Constructor (Deep Copy)
    Example(const Example& other) {
        data = new int(*other.data);  // Allocate new memory and copy value
        cout << "Copy Constructor called. Deep copy performed." << endl;
    }

    // Destructor
    ~Example() {
        delete data;  // Free memory
        cout << "Destructor called. Freed memory for data." << endl;
    }
};

int main() {
    Example obj1(10);  // Constructor allocates memory
    Example obj2 = obj1;  // Copy constructor performs deep copy

    // obj1 and obj2 have separate copies of `data`.
    return 0;
}
```

**Output:**

```
Constructor called. Allocated memory for data.
Copy Constructor called. Deep copy performed.
Destructor called. Freed memory for data.
Destructor called. Freed memory for data.
```

**What Changed?**

- The copy constructor (`Example(const Example& other)`) allocated new memory for `obj2`'s `data` and copied the value from `obj1`'s `data`.
- Each object had its own separate memory, so no double deletion occurred.

---

**Deep Copy Explanation in Detail**

- **Original Object (`obj1`)**:
    - Allocates memory for its `data` (e.g., address `0x100`).
- **Copied Object (`obj2`)**:
    - Allocates new memory (e.g., address `0x200`).
    - Copies the value stored at `obj1.data` into the new memory (`*obj2.data = *obj1.data`).

---

**Copy Constructor with a Realistic Example**

Here’s a practical use case with a class `Chai`, which dynamically allocates a `teaName`.

**Example:**

```cpp
#include <iostream>
#include <vector>

using namespace std;

class Chai {
public:
    string* teaName;  // Dynamically allocated
    int servings;
    vector<string> ingredients;

    // Parameterized Constructor
    Chai(string name, int serve, vector<string> ingr) {
        teaName = new string(name);  // Allocate memory for teaName
        servings = serve;
        ingredients = ingr;
        cout << "Param constructor called." << endl;
    }

    // Copy Constructor (Deep Copy)
    Chai(const Chai& other) {
        teaName = new string(*other.teaName);  // Deep copy of teaName
        servings = other.servings;
        ingredients = other.ingredients;  // Vector performs its own deep copy
        cout << "Copy constructor called." << endl;
    }

    // Destructor
    ~Chai() {
        delete teaName;  // Free dynamically allocated memory
        cout << "Destructor called." << endl;
    }

    void displayChaiDetails() {
        cout << "Tea Name: " << *teaName << endl;
        cout << "Servings: " << servings << endl;
        cout << "Ingredients: ";
        for (string ingredient : ingredients) {
            cout << ingredient << " ";
        }
        cout << endl;
    }
};

int main() {
    Chai lemonTea("Lemon Tea", 2, {"Water", "Lemon", "Honey"});  // Param constructor
    Chai copiedTea = lemonTea;  // Copy constructor is invoked

    *lemonTea.teaName = "Modified Lemon Tea";  // Modify original object's teaName

    cout << "Lemon Tea --------" << endl;
    lemonTea.displayChaiDetails();

    cout << "Copied Tea --------" << endl;
    copiedTea.displayChaiDetails();

    return 0;
}
```

**Output:**

```
Param constructor called.
Copy constructor called.
Lemon Tea --------
Tea Name: Modified Lemon Tea
Servings: 2
Ingredients: Water Lemon Honey 
Copied Tea --------
Tea Name: Lemon Tea
Servings: 2
Ingredients: Water Lemon Honey 
Destructor called.
Destructor called.
```

---

**Key Takeaways**

1. **Shallow Copy**:
    
    - Copies only pointers or references.
    - Leads to shared memory, causing issues like double deletion.
2. **Deep Copy**:
    
    - Allocates new memory for the copy.
    - Ensures each object has its own independent resources.
3. **Copy Constructor**:
    
    - Must be defined when a class involves dynamic memory allocation.
    - Prevents issues like double deletion and ensures proper resource management.

### iv. Delegating Constructor

A **delegating constructor** in C++ is a constructor that calls another constructor within the same class to initialize some or all of the class's members. This feature helps reduce redundancy and improves code maintainability by allowing reuse of constructor logic.

**Example**

```cpp
#include <iostream>
#include <vector>
using namespace std;

class Chai {
public:
    string teaName;
    int servings;
    vector<string> ingredients;

    // Delegating constructor
    Chai(string name) : Chai(name, 1, {"Water", "tea leaves"}) {
        cout << "Delegating Constructor called!" << endl;
    }

    // Main constructor
    Chai(string name, int serve, vector<string> ingr) {
        teaName = name;
        servings = serve;
        ingredients = ingr;
        cout << "Main Constructor called!" << endl;
    }

    void displayChaiDetails() {
        cout << "Tea Name: " << teaName << endl;
        cout << "Servings: " << servings << endl;
        cout << "Ingredients: ";
        for (string ingredient : ingredients) {
            cout << ingredient << " ";
        }
        cout << endl;
    }
};

int main() {
    // Create an object using the delegating constructor
    Chai quickChai("Quick Chai");
    quickChai.displayChaiDetails();

    return 0;
}
```

**Explanation of the Example**

1. **Main Constructor:**
    
    ```cpp
    Chai(string name, int serve, vector<string> ingr) {
        teaName = name;
        servings = serve;
        ingredients = ingr;
        cout << "Main Constructor called!" << endl;
    }
    ```
    
    - This is the **main constructor** responsible for fully initializing the class.
    - It accepts three parameters: `name`, `serve`, and `ingr`.
2. **Delegating Constructor:**
    
    ```cpp
    Chai(string name) : Chai(name, 1, {"Water", "tea leaves"}) {
        cout << "Delegating Constructor called!" << endl;
    }
    ```
    
    - This constructor delegates the initialization task to the main constructor.
    - It passes the `name` parameter along with default values for `serve` and `ingr`.
3. **Behavior in Main Function:**
    
    ```cpp
    Chai quickChai("Quick Chai");
    ```
    
    - When creating the `quickChai` object, the delegating constructor is called first.
    - The delegating constructor then invokes the main constructor with the default values for `serve` and `ingr`.

**Output**

```
Main Constructor called!
Delegating Constructor called!
Tea Name: Quick Chai
Servings: 1
Ingredients: Water tea leaves
```

**Important Points to Note**

1. A delegating constructor **must delegate directly** to another constructor; it cannot perform any other initialization tasks before the delegation.
    
    ```cpp
    Chai(string name) : Chai(name, 1, {"Water", "tea leaves"}) {
        // Code here after delegation is allowed
    }
    ```
    
    - Any initialization logic must occur _after_ the delegation.
2. Circular delegation (e.g., `Chai(a)` delegating to `Chai(b)` and vice versa) is **not allowed** and will cause a compilation error.

## Destructor

- A destructor is a special member function automatically invoked when an object goes out of scope or is deleted.
- Its primary role is to free resources (like dynamically allocated memory).

**Example in Copy Constructor Code:**

- The destructor (`~Chai`) frees the memory allocated for `teaName` using `delete`.

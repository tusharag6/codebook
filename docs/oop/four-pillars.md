---
sidebar_position: 2
---

# Four Pillars of OOP

## 1. Encapsulation

**Encapsulation** is a fundamental concept of object-oriented programming (OOP) that binds data (variables) and methods (functions) operating on the data together within a single unit (class). It restricts direct access to some of the object's components, ensuring that the data is safe from unintended interference and misuse.

**Key Features of Encapsulation**

1. **Data Hiding:** Data is kept private using access specifiers (`private`, `protected`), making it accessible only through specific public methods.
2. **Control Access:** Provides controlled access to the data via getter and setter methods.
3. **Improved Security:** Protects the integrity of the object by allowing only valid states and operations.

**Example**

This example will have a `BankAccount` class that encapsulates account details such as account number, account holder name, and balance.

```cpp
#include <iostream>
#include <string>
using namespace std;

class BankAccount {
private:
    string accountHolderName;
    string accountNumber;
    double balance;

public:
    // Constructor to initialize account details
    BankAccount(string name, string number, double initialBalance) {
        accountHolderName = name;
        accountNumber = number;
        balance = (initialBalance >= 0) ? initialBalance : 0; // Ensure balance is non-negative
    }

    // Getter for account holder name
    string getAccountHolderName() {
        return accountHolderName;
    }

    // Getter for account number
    string getAccountNumber() {
        return accountNumber;
    }

    // Getter for balance
    double getBalance() {
        return balance;
    }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            cout << "Deposited: " << amount << endl;
        } else {
            cout << "Invalid deposit amount!" << endl;
        }
    }

    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            cout << "Withdrew: " << amount << endl;
            return true;
        } else {
            cout << "Invalid withdrawal amount or insufficient balance!" << endl;
            return false;
        }
    }

    void displayAccountDetails() {
        cout << "Account Holder: " << accountHolderName << endl;
        cout << "Account Number: " << accountNumber << endl;
        cout << "Balance: " << balance << endl;
    }
};

int main() {
    // Create a bank account
    BankAccount account("John Doe", "1234567890", 500.0);

    account.displayAccountDetails();

    account.deposit(200.0);

    account.withdraw(100.0);

    // Attempt to withdraw more money than balance
    account.withdraw(700.0);

    account.displayAccountDetails();

    return 0;
}
```

**Explanation**

1. **Private Members (`accountHolderName`, `accountNumber`, `balance`):**
    
    - These variables are declared `private` to ensure that they cannot be accessed or modified directly from outside the class.
2. **Public Methods (Getters and Setters):**
    
    - The `getAccountHolderName()`, `getAccountNumber()`, and `getBalance()` methods provide controlled access to private data.
    - The `deposit(double amount)` and `withdraw(double amount)` methods encapsulate the logic for managing the balance, ensuring invalid operations are avoided.
3. **Data Validation:**
    
    - The constructor initializes the balance with a non-negative value only.
    - The `deposit` and `withdraw` methods ensure that invalid amounts (negative deposits or withdrawals exceeding balance) are rejected.
4. **Access Control:**
    
    - External code can interact with the `BankAccount` class only via the public interface (methods).
    - The actual details of how the account is managed internally (e.g., balance update logic) are hidden from external code.

**Output**

```
Account Holder: John Doe
Account Number: 1234567890
Balance: 500
Deposited: 200
Withdrew: 100
Invalid withdrawal amount or insufficient balance!
Account Holder: John Doe
Account Number: 1234567890
Balance: 600
```

## 2. Abstraction

**Abstraction** focuses on hiding complex implementation details and showing only the essential features of an object. It separates the interface (what the object does) from the implementation (how it does it). In C++, abstraction is typically achieved using **abstract classes** and **interfaces**.

### Abstract Class

An **abstract class** is a class that cannot be instantiated on its own and is designed to be a base class for other derived classes. It typically contains one or more **pure virtual functions** (functions declared with `= 0`).

### Virtual Functions

A **virtual function** in C++ is a member function in the base class that can be overridden by derived classes. A **pure virtual function** is a virtual function with no definition in the base class. It acts as a placeholder, enforcing derived classes to provide their own implementation.

**Syntax:**

```cpp
virtual void functionName() = 0;
```

- A class with at least one pure virtual function is called an **abstract class**.
- Abstract classes cannot be instantiated directly.

**Example**

```cpp
#include <iostream>
#include <string>

using namespace std;

// Abstract Base Class
class Tea {
    public:
        // Pure virtual functions (abstract methods)
        virtual void prepareIngredients() = 0; // pure virtual function
        virtual void brew() = 0;               // pure virtual function
        virtual void serve() = 0;              // pure virtual function

        // Non-pure function: this can have an implementation
        void makeTea(){
            prepareIngredients(); // Calling the derived class methods
            brew();
            serve();
        }
};

// Derived class: GreenTea
class GreenTea : public Tea {
public:
    void prepareIngredients() override {
        cout << "Green leaves and water are ready." << endl;
    }

    void brew() override {
        cout << "Green Tea brewed." << endl;
    }

    void serve() override {
        cout << "Green Tea served." << endl;
    }
};

// Derived class: MasalaTea
class MasalaTea : public Tea {
public:
    void prepareIngredients() override {
        cout << "Green leaves, water, and masala are ready." << endl;
    }

    void brew() override {
        cout << "Masala Tea brewed." << endl;
    }

    void serve() override {
        cout << "Masala Tea served." << endl;
    }
};

int main() {
    GreenTea greenTea;
    MasalaTea masalaTea;

    greenTea.makeTea(); // Calls the makeTea function for GreenTea
    masalaTea.makeTea(); // Calls the makeTea function for MasalaTea

    return 0;
}
```

The provided example demonstrates **abstraction** using a tea-making process. The `Tea` class is an **abstract class** because it contains pure virtual functions.

1. **Abstract Class `Tea`:**
    
    - The `Tea` class contains pure virtual functions (`prepareIngredients`, `brew`, `serve`) and a concrete method (`makeTea`).
    - The `makeTea` method abstracts the tea-making process into steps:
        - **Prepare Ingredients**
        - **Brew**
        - **Serve**
    - The actual details of each step are left to derived classes.
2. **Derived Classes `GreenTea` and `MasalaTea`:**
    
    - Both classes inherit from `Tea` and implement the pure virtual functions.
    - Each class provides specific details for preparing, brewing, and serving its type of tea.
3. **Process in `main`:**
    
    - Objects of `GreenTea` and `MasalaTea` are created.
    - The function `makeTea()` is part of the `Tea` class and encapsulates the entire process of making tea. It calls `prepareIngredients()`, `brew()`, and `serve()`. However, the user of this function doesn't need to know how the tea is made (the implementation details), only that it makes the tea. This is abstraction.
    - The `makeTea()` function uses polymorphism to call the correct version of `prepareIngredients()`, `brew()`, and `serve()` based on the type of object (either `GreenTea` or `MasalaTea`) that calls it.
    
**Key Abstraction Features in the Example**

- **Interface:** The `Tea` class defines a clear interface for making tea.
- **Implementation Hiding:** The `makeTea` method hides the details of how ingredients are prepared, brewed, and served.
- **Flexibility:** New types of tea can be added by creating more derived classes without changing the `Tea` class.

**Output:**

```
green leaves and water is ready
Green Tea brewed
Green Tea Served
green leaves and water is ready along with masala
Masala Tea brewed
Masala Tea Served
```

### Abstract Class vs Concrete Class

| Feature           | Abstract Class                                         | Concrete Class                |
| ----------------- | ------------------------------------------------------ | ----------------------------- |
| **Instantiation** | Cannot be instantiated directly                        | Can be instantiated directly  |
| **Purpose**       | To provide a base for derived classes                  | To represent concrete objects |
| **Contains**      | May have pure virtual functions and concrete functions | Only concrete functions       |



## 3. Inheritance

**Inheritance** allows a new class (called the **derived class**) to inherit properties and behaviors (data members and member functions) from an existing class (called the **base class**). This mechanism helps in code reusability, as the derived class can reuse the code from the base class without rewriting it.

Inheritance can also be used to extend or modify the behavior of the base class in the derived class.

**Syntax of Inheritance:**

```cpp
class DerivedClass : accessSpecifier BaseClass {
    // Derived class members
};
```

- `DerivedClass`: The class that inherits properties and methods from the base class.
- `BaseClass`: The class whose members are inherited.
- `accessSpecifier`: Defines the access level of the base class members (usually `public`, `protected`, or `private`).

**Types of Inheritance**

1. **Single Inheritance**: A class inherits from a single base class.
2. **Multiple Inheritance**: A class inherits from more than one base class.
3. **Multilevel Inheritance**: A class inherits from another class, which in turn inherits from another class.
4. **Hierarchical Inheritance**: Multiple classes inherit from the same base class.
5. **Hybrid Inheritance**: A combination of two or more types of inheritance.

### i. Single Inheritance

In **single inheritance**, a class inherits from a single base class. This is the most basic form of inheritance.

```cpp
class GreenTea : public Tea {
public:
    GreenTea(int serve) : Tea("Green Tea", serve) {
        cout << "GreenTea constructor called" << endl;
    }

    void brew() const override {
        cout << "Brewing " << teaName << " by steeping green tea leaves" << endl;
    }

    ~GreenTea() {
        cout << "GreenTea destructor called" << endl;
    }
};
```

In this case, `GreenTea` inherits the properties and methods of `Tea` (the base class) and overrides the `brew()` method to customize its behavior. `GreenTea` is a subclass of `Tea`, and it represents a specific kind of tea.

### ii. Multilevel Inheritance

In **multilevel inheritance**, a class inherits from a derived class, which in turn inherits from another class. This creates a chain of inheritance.

#### Tea Example: `MasalaTea` inherits from `Tea`, and `SpicyMasalaTea` inherits from `MasalaTea`

```cpp
// MasalaTea inherits from Tea
class MasalaTea : public Tea {
public:
    MasalaTea(int serve) : Tea("Masala Tea", serve) {
        cout << "MasalaTea constructor called" << endl;
    }

    void brew() const override final {
        cout << "Brewing " << teaName << " with spices and milk" << endl;
    }

    ~MasalaTea() {
        cout << "MasalaTea destructor called" << endl;
    }
};

// SpicyMasalaTea inherits from MasalaTea
class SpicyMasalaTea : public MasalaTea {
public:
    SpicyMasalaTea(int serve) : MasalaTea(serve) {
        cout << "SpicyMasalaTea constructor called" << endl;
    }

    void brew() const override {
        cout << "Brewing Spicy Masala Tea with extra spices" << endl;
    }

    ~SpicyMasalaTea() {
        cout << "SpicyMasalaTea destructor called" << endl;
    }
};
```

Here, `SpicyMasalaTea` is a subclass of `MasalaTea`, which is itself a subclass of `Tea`. This creates a chain: `SpicyMasalaTea` → `MasalaTea` → `Tea`.

### iii. Hierarchical Inheritance

In **hierarchical inheritance**, multiple derived classes inherit from a single base class. This means that several classes share a common ancestor and can extend or modify its behavior.

```cpp
// GreenTea and MasalaTea both inherit from Tea
class GreenTea : public Tea {
public:
    GreenTea(int serve) : Tea("Green Tea", serve) {
        cout << "GreenTea constructor called" << endl;
    }

    void brew() const override {
        cout << "Brewing " << teaName << " by steeping green tea leaves" << endl;
    }

    ~GreenTea() {
        cout << "GreenTea destructor called" << endl;
    }
};

class MasalaTea : public Tea {
public:
    MasalaTea(int serve) : Tea("Masala Tea", serve) {
        cout << "MasalaTea constructor called" << endl;
    }

    void brew() const override final {
        cout << "Brewing " << teaName << " with spices and milk" << endl;
    }

    ~MasalaTea() {
        cout << "MasalaTea destructor called" << endl;
    }
};
```

Both `GreenTea` and `MasalaTea` inherit from `Tea`. This is hierarchical inheritance because two classes (`GreenTea` and `MasalaTea`) share the same base class `Tea`.

### iv. Multiple Inheritance

In **multiple inheritance**, a class inherits from more than one base class. This allows a derived class to inherit properties and methods from more than one base class.

```cpp
class HerbalTea {
public:
    void steepHerbs() const {
        cout << "Steeping herbs for herbal tea" << endl;
    }
};

class GreenHerbalTea : public Tea, public HerbalTea {
public:
    GreenHerbalTea(int serve) : Tea("Green Herbal Tea", serve) {
        cout << "GreenHerbalTea constructor called" << endl;
    }

    void brew() const override {
        cout << "Brewing " << teaName << " by steeping green tea leaves with herbs" << endl;
    }

    ~GreenHerbalTea() {
        cout << "GreenHerbalTea destructor called" << endl;
    }
};
```

In this case, `GreenHerbalTea` inherits from both `Tea` and `HerbalTea`, gaining methods from both base classes.

### v. Hybrid Inheritance (Combination of different inheritance types)

**Hybrid inheritance** is a combination of two or more types of inheritance. This may involve single, multilevel, or multiple inheritance together.

In C++, hybrid inheritance can be complex and might lead to ambiguity if not handled carefully (e.g., diamond problem). However, this isn't present in the example code you provided, but a hybrid example would look like this:

```cpp
class HerbalTea {
public:
    void steepHerbs() const {
        cout << "Steeping herbs" << endl;
    }
};

class GreenHerbalTea : public GreenTea, public HerbalTea {
public:
    GreenHerbalTea(int serve) : GreenTea(serve) {
        cout << "GreenHerbalTea constructor called" << endl;
    }

    void brew() const override {
        cout << "Brewing Green Herbal Tea with green tea leaves and herbs" << endl;
    }

    ~GreenHerbalTea() {
        cout << "GreenHerbalTea destructor called" << endl;
    }
};
```

Here, `GreenHerbalTea` combines **multiple inheritance** (`GreenTea` + `HerbalTea`) and **multilevel inheritance** (since `GreenTea` is derived from `Tea`).


### Summary of Inheritance 

1. **Single Inheritance**: One class inherits from a single base class (e.g., `GreenTea` inherits from `Tea`).
2. **Multilevel Inheritance**: A class inherits from a derived class, forming a chain (e.g., `SpicyMasalaTea` inherits from `MasalaTea`, which inherits from `Tea`).
3. **Hierarchical Inheritance**: Multiple classes inherit from a common base class (e.g., `GreenTea` and `MasalaTea` inherit from `Tea`).
4. **Multiple Inheritance**: A class inherits from multiple base classes (e.g., `GreenHerbalTea` inherits from both `Tea` and `HerbalTea`).
5. **Hybrid Inheritance**: A combination of different inheritance types (e.g., multiple inheritance combined with multilevel inheritance).

## Polymorphism

Polymorphism is the ability of a function, object, or operator to take on different forms based on the context. There are two types of polymorphism in C++:

1. **Compile-Time Polymorphism (Static Polymorphism)**
2. **Run-Time Polymorphism (Dynamic Polymorphism)**

### i. Compile-Time Polymorphism (Static Polymorphism)

Compile-time polymorphism occurs when the method or function to be invoked is determined at compile time. This is achieved using **function overloading** and **operator overloading**.

**Example of Function Overloading (Compile-Time Polymorphism):**

Function overloading allows you to define multiple functions with the same name but different parameters. The appropriate function is chosen at compile-time based on the function signature.

```cpp
#include <iostream>
using namespace std;

// Function overloading based on the number of arguments
class Tea {
public:
    void brew() const {
        cout << "Brewing generic tea" << endl;
    }

    void brew(int servings) const {
        cout << "Brewing tea for " << servings << " servings" << endl;
    }

    void brew(string type) const {
        cout << "Brewing " << type << " tea" << endl;
    }
};

int main() {
    Tea tea;
    tea.brew();                // Calls brew() without parameters
    tea.brew(3);               // Calls brew(int) with one argument
    tea.brew("Green");         // Calls brew(string) with one argument

    return 0;
}
```

**Output:**

```
Brewing generic tea
Brewing tea for 3 servings
Brewing Green tea
```

In the above code:

- We have three different versions of the `brew()` method.
- The compiler decides which version of `brew()` to call based on the number and type of arguments passed at compile time.

**Why Compile-Time Polymorphism?**

- The method to be invoked is known at compile time, hence there is no overhead of runtime decision-making.
- It improves performance, but lacks flexibility because you must know the method signatures in advance.


### ii. Run-Time Polymorphism (Dynamic Polymorphism)

Run-time polymorphism occurs when the method or function to be invoked is determined at runtime, based on the object type. This is achieved using **inheritance** and **virtual functions** in C++.

**Example of Run-Time Polymorphism (Virtual Functions):**

In run-time polymorphism, a base class defines a virtual function, and the derived classes override this function. The correct version of the function is called at runtime, depending on the type of the object being referred to by the pointer (or reference).

```cpp
#include <iostream>
using namespace std;

// Base class Tea
class Tea {
public:
    virtual void brew() const {  // Virtual function
        cout << "Brewing generic tea" << endl;
    }

    virtual ~Tea() {}  // Virtual destructor to ensure proper cleanup
};

// Derived class GreenTea
class GreenTea : public Tea {
public:
    void brew() const override {  // Override base class function
        cout << "Brewing Green Tea" << endl;
    }
};

// Derived class MasalaTea
class MasalaTea : public Tea {
public:
    void brew() const override {  // Override base class function
        cout << "Brewing Masala Tea with spices" << endl;
    }
};

int main() {
    Tea* tea1 = new GreenTea();  // Pointer to base class
    Tea* tea2 = new MasalaTea(); // Pointer to base class

    tea1->brew();  // Calls GreenTea's brew()
    tea2->brew();  // Calls MasalaTea's brew()

    delete tea1;
    delete tea2;

    return 0;
}
```

**Output:**

```
Brewing Green Tea
Brewing Masala Tea with spices
```

In this example:

- The base class `Tea` has a **virtual function** `brew()`.
- Both `GreenTea` and `MasalaTea` override the `brew()` function.
- In the `main()` function, we use **base class pointers** (`Tea*`) to call the `brew()` method. Even though the pointers are of type `Tea*`, the appropriate `brew()` function is called based on the **actual object type** (`GreenTea` or `MasalaTea`), which is decided at runtime.

**Why Run-Time Polymorphism?**

- The decision of which method to invoke is made at runtime based on the actual object type. This makes the program more flexible and extensible, as you can change the object type without changing the calling code.
- It introduces a slight overhead due to the need to resolve the function call at runtime, but it provides significant flexibility.


### Key Differences between Compile-Time and Run-Time Polymorphism

| Aspect                       | Compile-Time Polymorphism                  | Run-Time Polymorphism                              |
| ---------------------------- | ------------------------------------------ | -------------------------------------------------- |
| **Method Binding**           | Decided at compile time                    | Decided at runtime                                 |
| **Implementation Mechanism** | Function overloading, operator overloading | Virtual functions, inheritance                     |
| **Flexibility**              | Less flexible                              | More flexible                                      |
| **Performance**              | Better performance (no overhead)           | Slight performance overhead (virtual table lookup) |
| **Method Invocation**        | Known at compile time                      | Determined at runtime                              |
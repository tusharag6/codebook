---
sidebar_position: 3
---

# Additional Concepts

## The `final` Keyword

1. **`final` on Methods**: When you declare a method as `final`, it prevents any further derived classes from overriding that method. If a derived class attempts to override this method, the compiler will throw an error.
    
2. **`final` on Classes**: When you declare a class as `final`, it prevents any other class from inheriting from it. So, no class can be derived from a `final` class.
    
**Example**

```cpp
#include <iostream>
#include <string>
using namespace std;

// Base class Tea
class Tea {
protected:
    string teaName;
    int servings;

public:
    Tea(string name, int serve) : teaName(name), servings(serve) {
        cout << "Tea constructor called for " << teaName << endl;
    }

    virtual void brew() const {
        cout << "Brewing " << teaName << " in a generic way" << endl;
    }

    virtual void serve() const {
        cout << "Serving " << servings << " cup(s) of " << teaName << endl;
    }

    virtual ~Tea() {
        cout << "Tea destructor called for " << teaName << endl;
    }
};

// Derived class MasalaTea
class MasalaTea : public Tea {
public:
    MasalaTea(int serve) : Tea("Masala Tea", serve) {
        cout << "MasalaTea constructor called" << endl;
    }

    // 'final' prevents further overriding of this method
    void brew() const override final {
        cout << "Brewing " << teaName << " with spices and milk" << endl;
    }

    ~MasalaTea() {
        cout << "MasalaTea destructor called" << endl;
    }
};

// Derived class SpicyMasalaTea (attempt to override final method)
class SpicyMasalaTea : public MasalaTea {
public:
    SpicyMasalaTea(int serve) : MasalaTea(serve) {
        cout << "SpicyMasalaTea constructor called" << endl;
    }

    // This will cause a compiler error because 'brew' is marked 'final' in MasalaTea
    void brew() const override {  // Error: 'brew' is final in MasalaTea
        cout << "Brewing Spicy Masala Tea with extra spices" << endl;
    }

    ~SpicyMasalaTea() {
        cout << "SpicyMasalaTea destructor called" << endl;
    }
};

int main() {
    Tea* tea1 = new MasalaTea(3);
    tea1->brew();
    tea1->serve();

    // Uncommenting the following line will cause a compilation error
    // Tea* tea2 = new SpicyMasalaTea(2);
    // tea2->brew();
    // tea2->serve();

    delete tea1;

    return 0;
}
```
**Explaination**

1. **`brew()` in `MasalaTea` is marked as `final`:** In the `MasalaTea` class, we declare the `brew()` method as `final`. This means that no class derived from `MasalaTea` can override this method. If we try to override it in the `SpicyMasalaTea` class, the compiler will produce an error.
    
    - **Why?**: The `final` keyword tells the compiler that the method `brew()` in `MasalaTea` is the final version, and no further customization (overriding) is allowed in any derived class.
2. **Attempt to Override `brew()` in `SpicyMasalaTea`:** If you try to override the `brew()` method in the `SpicyMasalaTea` class, like in the `SpicyMasalaTea` class above, you will get a **compiler error** because the `brew()` method in `MasalaTea` is marked `final`.
    
    - **Compiler Error:** You will see something like this:
        
        ```
        error: overriding final function 'brew'
        ```
        
3. **Effect of `final` on the Derived Class (`MasalaTea` and `SpicyMasalaTea`):**
    
    - The `final` keyword is used to lock down certain behavior. In this case, it prevents further changes to the `brew()` method once it's defined in `MasalaTea`.
    - This is useful when you want to ensure that a certain method is always executed in the same way, regardless of how many classes inherit from the base class.

## The `friend` Keyword

In C++, the `friend` keyword allows a function or a class to access private and protected members of another class. `friend` can be used in two contexts:

### i. Friend Function

A **friend function** is a non-member function that has access to the private and protected members of the class that declares it as a friend.

**Syntax**

```cpp
class ClassName {
    friend ReturnType FunctionName(Parameters);
};
```

**Example**

In the provided code, `compareServings` is a **friend function** of the `Chai` class. This allows `compareServings` to access the private `teaName` and `servings` members of the `Chai` class, even though it is not a member function of the class.

```cpp
#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Chai {
private:
    string teaName;
    int servings;

public:
    Chai(string name, int serve) : teaName(name), servings(serve) {}

    // Friend function declaration
    friend bool compareServings(const Chai& chai1, const Chai& chai2);

    void display() const {
        cout << "Tea Name: " << teaName << endl;
    }
};

// Friend function definition
bool compareServings(const Chai& chai1, const Chai& chai2) {
    return chai1.servings > chai2.servings;
}

int main() {
    Chai masalaChai("Masala Chai", 14);
    Chai gingerChai("Ginger Chai", 8);

    masalaChai.display();
    gingerChai.display();

    if (compareServings(masalaChai, gingerChai)) {
        cout << "Masala Chai has MORE servings." << endl;
    } else {
        cout << "Masala Chai has LESS servings." << endl;
    }
}
```

- `compareServings` was declared as a friend function in the `Chai` class:
    
    ```cpp
    friend bool compareServings(const Chai &chai1, const Chai &chai2);
    ```
    
- It can directly access private members (`teaName` and `servings`) of the `Chai` class without needing public getters or setters.

### ii. Friend Class

A **friend class** is a class that has access to the private and protected members of another class.

**Syntax:**

```cpp
class ClassA {
    friend class ClassB;  // Declare ClassB as a friend
};
```

**Example**

To demonstrate a **friend class**, we will create a class `ChaiHelper` that can access and manipulate the private members of the `Chai` class.

**Modified Code with Friend Class:**

```cpp
#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Chai {
private:
    string teaName;
    int servings;

public:
    Chai(string name, int serve) : teaName(name), servings(serve) {}

    // Declare ChaiHelper as a friend class
    friend class ChaiHelper;

    void display() const {
        cout << "Tea Name: " << teaName << endl;
    }
};

class ChaiHelper {
public:
    // Function to compare servings of two Chai objects
    static bool compareServings(const Chai& chai1, const Chai& chai2) {
        return chai1.servings > chai2.servings;
    }

    // Function to modify the private member `servings` of a Chai object
    static void doubleServings(Chai& chai) {
        chai.servings *= 2;  // Access private member directly
    }
};

int main() {
    Chai masalaChai("Masala Chai", 14);
    Chai gingerChai("Ginger Chai", 8);

    masalaChai.display();
    gingerChai.display();

    if (ChaiHelper::compareServings(masalaChai, gingerChai)) {
        cout << "Masala Chai has MORE servings." << endl;
    } else {
        cout << "Masala Chai has LESS servings." << endl;
    }

    // Modify servings using ChaiHelper
    ChaiHelper::doubleServings(gingerChai);
    cout << "After doubling servings of Ginger Chai:" << endl;
    gingerChai.display();

    return 0;
}
```

- The `ChaiHelper` class is declared as a friend class of `Chai`:
    
    ```cpp
    friend class ChaiHelper;
    ```
    
- This gives all member functions of `ChaiHelper` unrestricted access to the private members of `Chai`.
- `ChaiHelper::compareServings` compares the `servings` of two `Chai` objects.
- `ChaiHelper::doubleServings` directly modifies the `servings` of a `Chai` object.

**Key Points**

1. **Not a Member**: Friend functions are not members of the class but can access private and protected data.
2. **Access Scope**: The friend declaration is specific to the class. A friend function or class does not inherit access to derived classes or objects.
3. **Symmetry**: Friendship is not mutual. If `ClassA` declares `ClassB` as a friend, `ClassB` cannot automatically access private members of `ClassA` unless explicitly declared as a friend.
4. **Transitivity**: Friendship is not transitive. If `ClassA` is a friend of `ClassB` and `ClassB` is a friend of `ClassC`, `ClassC` cannot access `ClassA`'s private members.

## Getters and Setters in C++

Getters and setters are methods used in object-oriented programming to access and modify private data members of a class. They ensure encapsulation by providing controlled access to class members while keeping the implementation details hidden from the user.

**Example**

```cpp
#include <iostream>
#include <vector>
using namespace std;

class Chai {
private:
    string teaName;
    int servings;
    vector<string> ingredients;

public:
    // Default constructor
    Chai() {
        teaName = "Unknown tea";
        servings = 1;
        ingredients = {"Water", "tea leaves"};
    }

    // Parameterized constructor
    Chai(string name, int serve, vector<string> ingr) {
        teaName = name;
        servings = serve;
        ingredients = ingr;
    }

    // Getter for teaName
    string getTeaName() {
        return teaName;
    }

    // Setter for teaName
    void setTeaName(string name) {
        if (name.empty()) {  // Example validation
            cout << "Tea name cannot be empty!" << endl;
        } else {
            teaName = name;
        }
    }

    // Getter for servings
    int getServings() {
        return servings;
    }

    // Setter for servings
    void setServings(int serve) {
        if (serve <= 0) {  // Example validation
            cout << "Servings must be positive!" << endl;
        } else {
            servings = serve;
        }
    }

    // Getter for ingredients
    vector<string> getIngredients() {
        return ingredients;
    }

    // Setter for ingredients
    void setIngredients(vector<string> ingr) {
        if (ingr.empty()) {  // Example validation
            cout << "Ingredients cannot be empty!" << endl;
        } else {
            ingredients = ingr;
        }
    }

    // Method to display tea details
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
    // Using default constructor
    Chai chai;

    // Setting values using setters
    chai.setTeaName("Ginger Tea");
    chai.setServings(3);
    chai.setIngredients({"Water", "Ginger", "Honey"});

    // Displaying details
    chai.displayChaiDetails();

    // Using getters to retrieve values
    cout << "Retrieved Tea Name: " << chai.getTeaName() << endl;
    cout << "Retrieved Servings: " << chai.getServings() << endl;

    return 0;
}
```

**Purpose of Getters:**

- **Definition:** Getters are methods used to retrieve (read) the value of private data members.
- **Example in Code:**
    
    ```cpp
    string getTeaName() {
        return teaName;
    }
    ```
    
    This getter allows access to the private `teaName` property.

**Purpose of Setters:**

- **Definition:** Setters are methods used to modify (write) the value of private data members, often with additional validation logic.
- **Example in Code:**
    
    ```cpp
    void setTeaName(string name) {
        teaName = name;
    }
    ```
    
    This setter allows the user to set a new value for `teaName`.

**Key Benefits of Getters and Setters**

1. **Encapsulation:** Keeps the internal representation of an object hidden while providing controlled access.
2. **Validation and Logic:** Setters can include logic to validate inputs before modifying the data member.
3. **Flexibility:** Allows changing the implementation without affecting the public interface.


Each type of inheritance helps in creating relationships between classes, making code reuse and organization easier.

The `final` keyword in C++ is used to prevent further overriding of methods in derived classes and to prevent a class from being inherited by another class. Let's apply the `final` keyword to the `MasalaTea` example to explain its effect.

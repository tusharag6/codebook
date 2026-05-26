## Bootstrapping a CAP Project

SAP CAP provides an opinionated framework for building enterprise-grade backend services.

**Key Tools:**

- **CAP CLI (`@sap/cds-dk`):** The primary command-line tool.
- **`cds init <project-name>`:** Initializes a new project skeleton.
- **`cds watch`:** Starts a local development server with live reload and automatically provisions an in-memory SQLite database based on CDS definitions.

**Project Architecture:**

- `db/`: Contains the database schema models (the "floor plan" / single source of truth).
- `srv/`: Contains the service API definitions and custom Node.js business logic.
- `app/`: (Optional) Contains UI code like Fiori Elements.

## Core Data Services (CDS) Modeling

CDS is a universal modeling language used to define database structures, which CAP translates into the underlying database dialect (e.g., SQLite locally, SAP HANA in production).

### Schema Definition Basics (`db/schema.cds`)

A typical schema file defines namespaces and entities (database tables).

```
namespace my.bookstore;

entity Authors {
  key ID : Integer;
  name   : String(100);
  books  : Association to many Books on books.author = $self;
}

entity Books {
  key ID : Integer;
  title  : String(100);
  stock  : Integer;
  author : Association to Authors;
}
```

### Understanding Associations

Associations in CDS replace traditional SQL foreign keys and manual `JOIN` statements.

1. **Unmanaged / Simple Associations (`author : Association to Authors;`):**
   - Placed on the "child" or "many" side (e.g., `Books`).
   - Implicitly creates a foreign key column (e.g., `author_ID`) linking to the target entity's primary key.
2. **Managed / To-Many Associations (`books : Association to many Books on books.author = $self;`):**
   - Placed on the "parent" or "one" side (e.g., `Authors`).
   - **`Association to many Books`**: Declares that one Author is linked to multiple records in the `Books` entity.
   - **`on books.author = $self`**: The mapping condition. It instructs the database engine: "To find all books for a specific author, look inside the `Books` table at its `author` property, and find the ones where that property matches _my own_ primary key (`$self`)."
   - _Why it matters:_ It allows fetching an author and immediately expanding their entire bibliography in a single API query without writing complex backend linkage logic.

### Mock Data via CSV (`db/data/`)

Instead of manually entering data or writing SQL `INSERT` statements, CAP can automatically load mock data when spinning up the in-memory SQLite database.

**Rules for CSVs:**

- Must be placed in a `db/data/` or `test/data/` directory.
- The filename is incredibly strict. It must exactly match the namespace and entity name: `namespace-EntityName.csv`.
  - Example: For `namespace my.bookstore;` and `entity Books`, the file must be named `my.bookstore-Books.csv`.
- The first row must contain the exact column names defined in the CDS schema. ID mappings (e.g., `author_ID`) are automatically handled if named correctly.

## Custom Business Logic (`srv/service.js`)

By default, CAP handles standard CRUD operations automatically. When you need custom rules (e.g., validation, discounting, external API calls), you add them in a `.js` file next to your `.cds` service file.

- **Filename Match:** The JavaScript file must share the exact same base name as the CDS service file (e.g., `service.cds` -> `service.js`).

### The Class-Based Approach (CAP v7+)

Modern CAP uses classes extending `cds.ApplicationService`. Logic is placed inside the `init()` method.
Always ensure you return `super.init()` at the end so the standard CAP framework handlers also load.

```jsx
const cds = require("@sap/cds");

class CatalogService extends cds.ApplicationService {
  init() {
    const { Books } = this.entities;

    // Custom logic goes here

    return super.init();
  }
}

module.exports = CatalogService;
```

### Event Handlers (`before`, `on`, `after`)

- **`before`**: Used for validation or to modify the incoming request before it reaches the database.
- **`on`**: Used to completely replace the standard CAP database behavior.
- **`after`**: Used to modify the response payload before it is sent back to the client.

### Modifying Results (`READ` vs `each`)

When registering an `after` handler on a `READ` event, the handler receives the **entire array of results** because an OData endpoint typically queries a collection.

**Standard Array Loop (Manual):**

```jsx
this.after("READ", Books, (results) => {
  for (const book of results) {
    if (book.stock > 100) {
      book.title = `${book.title} -- (10% DISCOUNT)`;
    }
  }
});
```

**The `'each'` Shortcut (Automatic Loop):**
As a convenience, CAP provides an `'each'` event. Registering an `after` handler on `'each'` automatically acts as a `.forEach()` loop over the results. _(Note: Must be a synchronous function)_

```jsx
this.after("each", Books, (book) => {
  if (book.stock > 100) {
    book.title = `${book.title} -- (10% DISCOUNT)`;
  }
});
```

## Defining a Service (`srv/service.cds`)

In CAP, a defined database structure (`db/`) is completely private by default. To make it accessible via HTTP, you must explicitly expose it through a Service. CAP automatically translates this service definition into a fully functional OData REST API handling all standard CRUD operations.

```
using my.bookstore from '../db/schema';

service CatalogService {
    entity Books as projection on bookstore.Books;
    entity Authors as projection on bookstore.Authors;
}
```

### Projections (`projection on`)

Instead of directly exposing a raw database table, CAP forces the use of **projections**. A projection acts as a customizable window or view into the underlying entity.

- **Why it matters:** Projections allow you to hide sensitive columns (e.g., passwords), rename fields for the API consumer, or combine data from multiple tables without modifying the underlying database structure. By default, `as projection on` exposes all fields for Read/Write.

## Running the Server (`cds watch`)

The command `cds watch` starts a local development server with live reload. It automatically wires up the in-memory SQLite database and mounts the OData endpoints.

## Authentication & Authorization (Security)

In CAP, security is handled declaratively via annotations in the CDS service definition, rather than manually implementing middleware.

### Securing Entities with `@restrict`

You can enforce fine-grained access control at the entity level:

```
service CatalogService {
    @restrict: [
        { grant: 'READ', to: 'authenticated-user' },
        { grant: ['CREATE', 'UPDATE', 'DELETE'], to: 'Admin' }
    ]
    entity Books as projection on bookstore.Books;
}
```

### Mock Authentication (`package.json`)

For local development, CAP can mock authentication by defining users and roles directly in `package.json`.

```json
"cds": {
  "requires": {
    "auth": {
      "kind": "mocked",
      "users": {
        "alice": { "roles": ["Admin", "authenticated-user"] },
        "bob": { "roles": ["authenticated-user"] }
      }
    }
  }
}
```

## Fiori Elements (The Free UI)

CAP can automatically generate a full-featured, enterprise-grade frontend application (Fiori Elements) simply by reading UI metadata. No HTML or JavaScript is required.

### UI Annotations (`app/annotations.cds`)

UI metadata should be placed in the `app/` folder. The `annotate` keyword extends the service definition with visual rules.

- **`@UI.SelectionFields`**: Adds a search/filter bar to the top of the table.
- **`@UI.LineItem`**: Defines the columns of the main data table.

```
using CatalogService from '../srv/service';

annotate CatalogService.Books with @(
    UI: {
        HeaderInfo: {
            TypeName: 'Book',
            TypeNamePlural: 'Books',
            Title: { Value: title }
        },
        SelectionFields: [ ID, title ],
        LineItem: [
            { Value: ID, Label: 'Book ID' },
            { Value: title, Label: 'Title' },
            { Value: stock, Label: 'Current Stock' }
        ]
    }
);
```

When these annotations are present, `cds watch` automatically serves a **Fiori preview** web application alongside the API endpoints.

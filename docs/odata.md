**SAP**: Systems, Applications, and Products in Data Processing.

SAP is a leading ERP software suite.

**ERP**: Enterprise Resource Planning – planning the resources within the enterprise in effective and efficient way to derive productive(profit) result.

**Enterprise**: A legal entity accountable for its business/trading activities.

**Resources (5 M’s)**

- Men (human resources)
- Machine (equipment & technology)
- Material (raw materials & inventory)
- Money (capital & finance)
- Method (processes & procedures)

## Examples of Enterprises (by Scale)

1. **Tea Stall**
   - No automation required
2. **DMart**
   - Uses basic tools (e.g., Excel) for profit calculation
3. **Manufacturing Company** (e.g., bicycle maker)
   - Imports parts rather than in-house production
   - Key departments:
     - Production (plant & machinery)
     - Material Management
     - Finance (pricing & accounting)
     - Quality Management (certification)
     - Sales
   - Geographically dispersed units integrated via automation

## ERP vs. Custom Development

| Approach                     | Description                                                             |
| ---------------------------- | ----------------------------------------------------------------------- |
| Client-Server / Custom Build | Develop from scratch—design DB tables, schemas, data flows              |
| ERP Package (e.g., SAP)      | Pre-built, configurable solution covering end-to-end business processes |

## SAP vs. Competitors

| Vendor           | Primary Strength                          |
| ---------------- | ----------------------------------------- |
| Baan, JD Edwards | Manufacturing (automobile: MM, PP, PM)    |
| PeopleSoft       | Human Resources                           |
| Oracle Apps      | Finance & Controlling (FICO), HR, banking |

> Despite acquiring Baan, JD Edwards, and PeopleSoft, Oracle still trails SAP in offering a truly end-to-end suite.

## SAP Functional Modules (Application Modules)

Functional modules in SAP represent the core business processes of an enterprise. Each module corresponds to a specific department or resource function, enabling seamless integration and automation across the organization.

| Module | Full Form              | Description                                                                       |
| ------ | ---------------------- | --------------------------------------------------------------------------------- |
| **MM** | Material Management    | Manages procurement, inventory, and logistics of materials.                       |
| **SD** | Sales and Distribution | Handles customer orders, pricing, billing, and delivery.                          |
| **PP** | Production Planning    | Plans and controls manufacturing processes—what, when, how, and where to produce. |
| **FI** | Financial Accounting   | Manages financial transactions, accounting, and auditing.                         |
| **CO** | Controlling            | Supports budgeting, cost tracking, and financial forecasting.                     |
| **QM** | Quality Management     | Ensures product and process quality standards are met.                            |
| **PM** | Plant Maintenance      | Maintains equipment and machinery to ensure operational efficiency.               |
| **HR** | Human Resources        | Manages employee data, payroll, recruitment, and personnel administration.        |

## SAP Architecture (Overview)

![Screenshot 2025-08-12 144251.png](attachment:0bdb50a8-e572-4b3a-9f16-6b4083643b19:Screenshot_2025-08-12_144251.png)

SAP is built on open technology, supporting any database and operating system.

```
SAP System
├─ Functional Modules (MM, SD, PP, FICO, QM, PM, HR…)
└─ Technical Layer (ABAP runtime, development tools)

```

## ABAP & Technical Modules

- **ABAP**: Advanced Business Application Programming—SAP’s proprietary language.
- **Technical Modules**: Tools and frameworks used to develop/customize SAP business objects.

## Business Application Objects in ABAP

There are 5 types of business application objects that can be developed with ABAP which are as follows:

| Object Type  | Purpose                                                                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Forms        | (the document which is frequently used within the organization is stored in the form of template, e.g.: purchase order, sale order, salary statement, invoices, etc. |
| Reports      | To display data in a formatted way with respect to date and time                                                                                                     |
| Interfaces   | Data migration (interpreting b/w file and sap databases, e.g.: Excel → SAP)                                                                                          |
| Conversions  | To convert from one format to another, e.g., combining first, middle, and last names into a single field                                                             |
| Enhancements | adding an extra feature or property to the already existing object                                                                                                   |

Mnemonic: FRICE (Forms, Reports, Interfaces, Conversions, Enhancements)

## SAP Development Basics

- **Naming Convention**: Custom programs/objects must start with `Y` or `Z`.
- **Comments**: Use double quotes (`"`) for inline comments in ABAP code.
- **Print Statement**

  ```abap
  WRITE 'Hello World'.

  ```

- **Print Statement - Multiple lines (repeated keyword)**

  ```abap
  WRITE 'Hello World'.
  WRITE 'I am learning ABAP'.
  WRITE 'This is at DTP'.

  ```

- **Print Statement - Multiple lines (colon syntax)**

  ```abap
  WRITE: 'Hello World',
         'I am learning ABAP',
         'This is at DTP'.

  ```

- **Print Statement - Line breaks (slash syntax)**

  ```abap
  WRITE: 'Hello World',/
         'I am learning ABAP',/
         'This is at DTP'.

  ```

## SAP Transactions and Transaction Codes

In SAP, each activity is invoked via a transaction, identified by a unique transaction code (T-code).

| Transaction Activity | Transaction Code |
| -------------------- | ---------------- |
| ABAP Editor          | SE38             |
| ABAP Dictionary      | SE11             |
| Function Module      | SE37             |
| Class Builder        | SE24             |

## Core ABAP Statements

- **WRITE**: Outputs text or variable content to the screen.
- **DATA**: Declares a data object and allocates memory.
- **PARAMETERS**: Defines a screen field for user input.

## Elementary Data Types

Use the `data` statement to declare variables of these built-in types:

syntax:
data <var name> type <datatype>.

| Type Code | Description             | Syntax Example                      |
| --------- | ----------------------- | ----------------------------------- |
| i         | Integer                 | `data lv_count type i.`             |
| f         | Floating-point          | `data lv_temp type f.`              |
| p         | Packed decimal          | `data lv_amount type p decimals 2.` |
| c         | Character               | `data lv_char type c length 10.`    |
| d         | Date                    | `data lv_date type d.`              |
| t         | Time                    | `data lv_time type t.`              |
| n         | Numeric text (digits)   | `data lv_digits type n length 5.`   |
| x         | Hexadecimal byte string | `data lv_raw type x length 8.`      |

```abap
data lv_count type i.         " Integer
data lv_temp type f.          " Floating-point number
data lv_amount type p decimals 2. " Decimal with 2 places
data lv_char type c length 10.    " Text of length 10
data lv_date type d.          " Date (YYYYMMDD)
data lv_time type t.          " Time (HHMMSS)
data lv_digits type n length 5.   " Only digits
data lv_raw type x length 8.      " Raw binary data
```

## Structured Data Types

### Defining and Using a Structure Inline

```abap
data: begin of student,
        name  type c length 20,
        age   type i,
        marks type p decimals 2,
      end of student.

student-name  = 'Tushar'.
student-age   = 22.
student-marks = '89.75'.

write: student-name, student-age, student-marks.

```

### Defining a Reusable Type and Multiple Instances

```abap

types: begin of ty_student,
         name  type c length 20,
         age   type i,
         marks type p decimals 2,
       end of ty_student.

data: stu1 type ty_student,
      stu2 type ty_student.

stu1-name  = 'Tushar'.
stu1-age   = 22.
stu1-marks = '89.75'.

stu2-name  = 'Harsh'.
stu2-age   = 19.
stu2-marks = '92.50'.

write: stu1-name, stu1-age, stu1-marks.
write: stu2-name, stu2-age, stu2-marks.

```

## Internal Tables

Internal tables are temporary in-memory tables used within an ABAP program.

```abap
" 1. Define a structure for each row
types: begin of ty_stud,
         studid   type i,
         studnaam type c length 10,
         studfees type p decimals 2,
       end of ty_stud.

"2. Declare an intenal table and work area
data: lt_studs type table of ty_stud,
      ls_stud  type ty_stud.

"3. Append rows to the table
" Append first row
ls_stud-studid   = 100.
ls_stud-studnaam = 'virat'.
ls_stud-studfees = '2345.67'.
append ls_stud to lt_studs.

" Append second row
ls_stud-studid   = 200.
ls_stud-studnaam = 'rohit'.
ls_stud-studfees = '2345.67'.
append ls_stud to lt_studs.

" Append third row
ls_stud-studid   = 300.
ls_stud-studnaam = 'shilpa'.
ls_stud-studfees = '2345.67'.
append ls_stud to lt_studs.

"4. Loop and display
loop at lt_studs into ls_stud.
  write:/ ls_stud-studid, ls_stud-studnaam, ls_stud-studfees.
endloop.

```

## Database Access with SELECT

SAP systems provide default demo tables such as SFLIGHT, SPFLI, and SCUSTOM. Use `SELECT` to read database records.

### Basic SELECT Without Conditions

```abap
tables: sflight.

select * from sflight.
  write:/ sflight-carrid, sflight-connid, sflight-fldate.
endselect.

```

### Using WHERE with User Input

User enters a date, and only flights on that date are show

```abap
tables: sflight.
parameters: p_date type sflight-fldate.

select *
  from sflight
  where fldate = p_date.
  write:/ sflight-carrid, sflight-connid, sflight- fldate.
endselect.

```

### Using WHERE with Hardcoded Value

```abap
tables: sflight.

select *
  from sflight
  where fldate = '20240725'.
  write:/ sflight-carrid, sflight-connid, sflight-fldate.
endselect.

```

### Using BETWEEN for Date Ranges

```abap
tables: sflight.
parameters: start_date type sflight-fldate,
            end_date   type sflight-fldate.

select *
  from sflight
  where fldate between start_date and end_date.
  write:/ sflight-carrid, sflight-connid, sflight-fldate.
endselect.

```

### Selecting Specific Fields into a Structure

Selecting only needed fields reduces data transfer and improves performance:

```abap
tables: sflight.
parameters: start_date type sflight-fldate,
            end_date   type sflight-fldate.

data: begin of flight_str,
        carrid type sflight-carrid,
        connid type sflight-connid,
        fldate type sflight-fldate,
      end of flight_str.

select carrid connid fldate
  into corresponding fields of flight_str
  from sflight
  where fldate between start_date and end_date.

  write:/ flight_str-carrid, flight_str-connid, flight_str-fldate.
endselect.

```

## Database vs. Internal Tables

- **Database Table**: Permanent, stored on the database server.
- **Internal Table**: Temporary, exists only during program runtime.

### Example: Populating an Internal Table from a Database Table

```abap
tables: scustom.
parameters: p_id1 type scustom-id,
            p_id2 type scustom-id.

types: begin of ty_cust,
         id      type scustom-id,
         name    type scustom-name,
         city    type scustom-city,
         country type scustom-country,
       end of ty_cust.

data: lt_cust type table of ty_cust,
      ls_cust type ty_cust.

" Fetch data into internal table
select id name city country
  into corresponding fields of table lt_cust
  from scustom
  where id between p_id1 and p_id2.

" Loop through and display results
loop at lt_cust into ls_cust.
  write:/ ls_cust-id, ls_cust-name, ls_cust-city, ls_cust-country.
endloop.

```

## Table Creation in SAP

SAP allows you to create database tables using the **ABAP Dictionary (SE11)**. There are two main approaches:

### 🔼 Top-Down Approach

This method starts with the **table definition**, followed by creating **data elements** and **domains**.

**Hierarchy:**

```
TABLES
 └── FIELDS
      └── DATA ELEMENTS
           └── DOMAINS

```

- **Domain**: Defines the technical attributes of a field (data type, length, etc.)
- **Data Element**: Provides semantic meaning (description) for a field
- **Field**: The actual column in the table

### 🔽 Bottom-Up Approach

Start by creating **domains**, then **data elements**, and finally use them in **table fields**.

This approach is useful when multiple tables share similar field definitions.

## Part 1: Creating Tables in SAP (SE11)

### 🔹 Step 1: Open ABAP Dictionary

- Go to transaction code: `SE11`
- Select **Database Table**
- Enter a name starting with `Z` or `Y` (e.g., `ZEMPLOYEE`)
- Click **Create**

![image.png](attachment:8679ad31-7745-4b79-94ab-6a582cd6646d:image.png)

### 🔹 Step 2: Define Table Attributes

- Enter **Short Description**
- Set **Delivery Class**: `A` (Application Table)
- Set **Data Browser/Table View Editing**: Display/Maintenance Allowed

![image.png](attachment:782a904e-4432-4604-a3e8-98c6d6dd8083:image.png)

### 🔹 Step 3: Define Fields

- Go to **Fields** tab
- Add fields like:
  - `EMPNO` – Type: `NUMC`, Length: `6`, Key: ✅
  - `EMPNAME` – Type: `CHAR`, Length: `10`
  - `EMPSALARY` – Type: `INT4`, Length: `10`

![image.png](attachment:63dea317-0317-45ae-a205-0e974c9336a6:image.png)

### 🔹 Step 4: Create Data Elements

- For each field, click on the **Data Element** column
- Enter a name (e.g., `ZEMPNA`)
- Double click on it.
- Enter **Short Description**
- Link to a **Domain** or define technical attributes directly

![image.png](attachment:6c404f47-a0cc-4caa-b526-f4506ace50c9:image.png)

### 🔹 Step 5: Create Domain

- In Data Element screen, click on the **Domain** field
- Enter a name (e.g., `ZEMPNA`)
- Double click on it.
- Define:
  - Data Type: `CHAR`
  - Length: `10`

![image.png](attachment:9b97344e-a19f-40fc-a5e2-6daf39655c6a:image.png)

### 🔹 Step 6: Save and Activate

- Save all objects (Ctrl+S)
- Activate the table (Ctrl+F3)

## Part 2: Creating Linked Tables with Foreign Key

### 🔹 Step 1: Create Parent Table (e.g., `ZDEPTM`)

- Fields:
  - `DEPTID` – Key
  - `DEPTNAME`
  - `DEPTLOC`

![image.png](attachment:61603dfd-ff7e-486b-9814-59118a9cdb1b:image.png)

### 🔹 Step 2: Create Child Table (e.g., `ZEMPLOYEE`)

- Add `DEPTID` field
- In **Foreign Key** column, click the icon
- In check table, write the parent table that you want to link (in this case `ZEMPLOYEE` is parent table)
- Create Proposal
- Click on copy button

Employee Table

![image.png](attachment:6602b088-8647-41eb-9353-c7009718eb0e:image.png)

Foreign Key creation

![image.png](attachment:506b7b21-44a1-483e-bad8-c2aa2d405caa:image.png)

## Views in SAP

A **view** is a logical representation of data from one or more tables.

### Example:

- Tables: `SPFLI`, `SFLIGHT`
- Fields: `CARRID`, `CONNID`, `CITYFROM`, `CITYTO`, `FLDATE`

**Use Case**:

1. Display combined data using a view
2. Apply condition on `FLDATE` to filter results

## Creating Views in SAP

### 🔹 Step 1: Go to SE11 and Select “View”

- Enter a name (e.g., `ZEMP_DEPT_VIEW`)
- Click **Create**
- Choose **Database View**

![image.png](attachment:4a886977-d768-40e3-8580-f7d4d83f1fb4:image.png)

### 🔹 Step 2: Define View Attributes

- Enter **Short Description**
- Enter **Base Tables** (e.g., `ZEMPLOYEE`, `ZDEPT`)
- Select both tables and click on relationships button and select the Join Condition (e.g., `ZEMPLOYEE.DEPTID = ZDEPT.DEPTID`)

![image.png](attachment:d61b5628-26e0-499e-8e15-42ab03f5882d:image.png)

### 🔹 Step 3: Select Fields for the View

- Choose fields from both tables(Click on Table Fields) to include in the view

![image.png](attachment:1db0719a-9a93-4d21-b815-69f26c6984a5:image.png)

### 🔹 Step 4: Save and Activate

- Save the view
- Activate it

### Delivery Class & Data Class

- **Delivery Class**: Defines how the table is transported (e.g., `A` for application table)
- **Data Class**:
  - `APPL0`: Master data
  - `APPL1`: Transaction data

## OData and SAP Gateway

OData is a REST-based protocol used to expose SAP data to external applications.

### SAP Gateway

Provides a standardized way to integrate SAP with web and mobile apps.

### SEGW – SAP Gateway Service Builder

Use transaction **SEGW** to create and publish OData services.

## Steps to Create an OData Service

### 1️⃣ Create Project

- Open SEGW
- Click **Create Project**
- Enter **Project Name** and **Description**

![image.png](attachment:ee3f0f2b-5c15-41fe-bf33-480fc7040055:image.png)

### 2️⃣ Import DDIC Structure

- Right-click **Data Model** folder → Import → DDIC Structure
- Enter name and ABAP structure (table name) → Next
- Select fields (at least one primary key) → Finish

![image.png](attachment:b186b4ad-6219-427c-b2d5-5b5b2a83dd5d:image.png)

![image.png](attachment:eae96ea0-0f4d-4f79-87a3-480be676e36a:image.png)

![image.png](attachment:2b44ff00-f855-46cb-869f-36dc59acc932:image.png)

### 3️⃣ Map to Data Source

- Go to **Service Implementation**
- Right-click (on entity set e.g.: waSet or lineSet)
- Map to data source: Local
- Data Source Attribute: Type: Business Entity
- Data Source Attribute: Name: click on button on right of input box
- SADL Model Type: DDIC
- SADL Model: Table name

![image.png](attachment:dbbeaa17-1cd5-4ca1-8bcb-565a2cf4ce8e:image.png)

![image.png](attachment:c55814f1-453f-4554-abca-23b5417479f0:image.png)

### 4️⃣ Generate & Save

- Click **Generate Mapping**
- Press **Ctrl+S** to save

### 5️⃣ Generate Runtime Artifacts

- Click **Generate Runtime Objects**

### 6️⃣ Activate Service

Use transaction `/n/iwfnd/maint_service`

- Click **Add Service**
- System Alias: `LOCAL`
- Technical Service Name: `ProjectName*`
- Click on Backend Service that comes up.
- Then Enter
- You should see a popup saying “metadata successfully loaded”

![image.png](attachment:8b309e63-c94e-400d-9391-37e99e629ff1:image.png)

### 7️⃣ Test with SAP Gateway Client

- Filter the service (Enter Technical Service name as `ProjectName*`)
- Click **SAP Gateway Client**
- Click EntitySets
- Choose **Entity Set**
- Click **Execute**

![image.png](attachment:293617fd-2632-4bf7-9fe7-f6f3893e2824:image.png)

![image.png](attachment:1f89c973-72a0-47c5-bf86-5e5adef1d3c4:image.png)

![image.png](attachment:1b38b252-6105-480b-8413-663ea8afb52e:image.png)

## SAP OData Service: Manual Implementation via Method Redefinition

### 1️⃣ Create Project

- Open SEGW
- Click **Create Project**
- Enter **Project Name** and **Description**

![image.png](attachment:ee3f0f2b-5c15-41fe-bf33-480fc7040055:image.png)

### 2️⃣ Import DDIC Structure

- Right-click **Data Model** folder → Import → DDIC Structure
- Enter name and ABAP structure (table name) → Next
- Select fields (at least one primary key) → Finish

![image.png](attachment:b186b4ad-6219-427c-b2d5-5b5b2a83dd5d:image.png)

![image.png](attachment:eae96ea0-0f4d-4f79-87a3-480be676e36a:image.png)

![image.png](attachment:2b44ff00-f855-46cb-869f-36dc59acc932:image.png)

### 3️⃣ Generate Runtime Artifacts

- Click **Generate Runtime Objects** (top toolbar)
- This creates:
  - **Model Provider Class (MPC)**
  - **Data Provider Class (DPC)**
  - Their `_EXT` subclasses for custom logic

### 4️⃣ Redefine Method in DPC_EXT

### 🔹 1. `GET_ENTITYSET`

Fetch all records.

- In SEGW, under Runtime Artifacts folder, DPC_EXT file is there.
- Open your project’s **DPC_EXT class** (e.g., `ZCL_ZMANUAL_ODATA_DPC_EXT`)

![image.png](attachment:ec766ab3-e731-4a2d-bad1-543a642b5f8b:image.png)

- On the left-side, Click on Methods → Inherited Methods
- Right click on `GET_ENTITYSET` and redefine.

```abap
types: begin of str,
		      empid type z30103708EMPL-empid,
		      location type z30103708EMPL-location,
		      name1 type z30103708EMPL-name1,
		      country type z30103708EMPL-country,
      end of str.
 data: itab type table of str.
 select empid location name1 country from z30103708EMPL into table itab.
 MOVE-CORRESPONDING itab to et_entityset.
```

**Activate and Register Service**

- Go to `/n/iwfnd/maint_service`
- Click **Add Service**
- System Alias: `LOCAL`
- Technical Service Name: `ZMANUAL_ODATA*`
- Click **Save**

**Test with SAP Gateway Client**

- Filter for your service
- Click **SAP Gateway Client**
- Choose `EmployeeSet`
- Click **Execute**

![image.png](attachment:95c45b37-8a45-4c76-ade5-36709faaaed7:image.png)

### 🔹 2. `GET_ENTITY`

Fetch a single record by key.

```abap
data   lt_keys  TYPE  /IWBEP/T_MGW_TECH_PAIRS.
data   ls_key   TYPE  /IWBEP/S_MGW_TECH_PAIR.

data  WA           TYPE ZCL_Z30103708_PROJ5_MPC=>TS_WA.
data  empidvalue  TYPE ZCL_Z30103708_PROJ5_MPC=>TS_WA-empid.

lt_keys  =  IO_TECH_REQUEST_CONTEXT->GET_KEYS( ).

Read TABLE  lt_keys  into ls_key with KEY NAME  =  'EMPID'.

empidvalue     =  ls_key-VALUE.

SELECT  single * from Z30103708EMPL into corresponding fields of   WA
where   EMPID   =   empidVALUE.

MOVE-CORRESPONDING wa to er_entity.

```

[]()

![image.png](attachment:26de4c04-b821-4f47-9612-8231c2adfac1:image.png)

---

### 🔹 3. `CREATE_ENTITY`

Insert a new record.

```abap
data   WA   TYPE   ZCL_Z30103708_PROJ5_MPC=>TS_WA..
 
IO_DATA_PROVIDER->READ_ENTRY_DATA(  importing  es_data  =  WA  ).

If wa-EMPID is not initial.
		INSERT into Z30103708EMPL values    WA .ENDIF.
```

![image.png](attachment:c51d1dbb-2aed-4d30-a4e7-2ac28d2f5573:image.png)

### 🔹 4. `UPDATE_ENTITY`

Update an existing record.

```abap
DATA: ls_EMP   TYPE ZCL_Z30103708_PROJ5_MPC=>TS_WA.
    io_data_provider->read_entry_data( IMPORTING es_data = ls_EMP ).

UPDATE Z30103708EMPL SET
LOCATION = LS_EMP-LOCATION
NAME1 = LS_EMP-NAME1COUNTRY = LS_EMP-COUNTRYwhere empid = ls_emp-empid.

er_entity = ls_emp.
```

![image.png](attachment:09719d06-8b78-48ca-80f3-5e832560016f:image.png)

### 🔹 5. `DELETE_ENTITY`

Delete a record by key.

```abap
data  lt_keys     TYPE  /IWBEP/T_MGW_TECH_PAIRS.
data  ls_key      TYPE  /IWBEP/S_MGW_TECH_PAIR.data  empidvalue  TYPE ZCL_Z30103708_PROJ5_MPC=>TS_WA-empid.
    lt_keys  =  IO_TECH_REQUEST_CONTEXT->GET_KEYS( ).Read TABLE  lt_keys  into ls_key with KEY NAME  =  'EMPID'.
 
empidvalue     =  ls_key-VALUE.
lt_keys =  IO_TECH_REQUEST_CONTEXT->GET_KEYS( ).
   
READ TABLE  Lt_keys into ls_key  with KEY NAME = 'EMPID'.

EMPIDvalue       = ls_key-VALUE.

  if EMPIDvalue is not initial.
     DELETE  from Z30103708EMPL  where EMPID  =  EMPIDvalue.
  ENDIF.

```

![image.png](attachment:fdfbc1f0-010f-43f2-bb71-6d89b5a37edc:image.png)

## Testing in SAP Gateway Client

- Go to `/n/iwfnd/maint_service`
- Select your service → Click **SAP Gateway Client**
- Use HTTP methods:
  - `POST` for Create
  - `GET` for Read
  - `PUT` for Update
  - `DELETE` for Delete

## CRUD Overview

| Method          | Purpose                | HTTP Verb | Status Code      |
| --------------- | ---------------------- | --------- | ---------------- |
| `CREATE_ENTITY` | Create new record      | POST      | `201 Created`    |
| `GET_ENTITY`    | Read single record     | GET       | `200 OK`         |
| `GET_ENTITYSET` | Read multiple records  | GET       | `200 OK`         |
| `UPDATE_ENTITY` | Update existing record | PUT       | `204 No Content` |
| `DELETE_ENTITY` | Delete record          | DELETE    | `204 No Content` |

### HANA SQL

```abap
SELECT id, name, country INTO TABLE @DATA(itab) FROM scustom.

LOOP AT itab INTO DATA(wa).
  WRITE:/ wa-id, wa-name, wa-country.
ENDLOOP.
```

**Explanation :**

- `@DATA(itab)` is an **inline declaration** of an internal table.
- `DATA(wa)` is an inline declaration of a **work area**.
- This syntax is part of **modern ABAP**, reducing the need for explicit declarations.

- **HANA** stands for _High-performance Analytic Appliance_.
- It’s an **in-memory database**, meaning data is stored in RAM for faster access.
- Supports **advanced SQL expressions** and **real-time analytics**.

**Key Features:**

- High-speed data processing
- Columnar storage
- Parallel execution
- Real-time reporting

## SAP OData: Association & Navigation

### Data Relationship Concept

| Type        | Description                      |
| ----------- | -------------------------------- |
| Header Data | Parent Entity (e.g., Department) |
| Item Data   | Child Entity (e.g., Employee)    |

**Goal**: Display both header and item data together using OData navigation.

**Create Dept and Employee Table**

![image.png](attachment:9faf1f0d-ca7d-4faf-ac45-a8fb0afcc241:image.png)

![image.png](attachment:fa2f0d52-b3e0-4da8-9b43-a39b32f80787:image.png)

### SEGW Project Setup

1. **Create Project** in SEGW.
2. **Import DDIC Structure**:
   - Header Table is `DEPT`
   - Name: `wa_hdr`
   - ABAP Structure: DEPT Table name(Header Table)
3. **Generate Runtime Artifacts**
4. **Redefine `GET_ENTITYSET` Method** for header

![image.png](attachment:eee98187-ec54-4487-a7e8-7eaf94879dd7:image.png)

### Add Item Entity

1. Import DDIC structure for item table (e.g., `EMP`)
   - Name: `wa_itm`

![image.png](attachment:d6f0fbb2-5bbc-4745-8998-515cd06dfb8e:image.png)

1. Generate runtime artifacts
2. Redefine `GET_ENTITYSET` for item

![image.png](attachment:c86413d7-1952-4b82-b943-ee5e1df8f0bc:image.png)

**After above steps, there will be two entity**

![Untitled.png](attachment:8ece0471-d36f-4f6d-bf60-229679ce8426:Untitled.png)

### Create Association

1. Go to **Association** → Create
2. **Association Name**: `depAss`
3. **Principal Entity**:
   - Entity Type Name: `wa_hdr` (Header)
   - Cardinality: `1`
4. **Dependent Entity**:
   - Entity Type Name: `wa_itm` (Item)
   - Cardinality: `0..n`
5. Tick **Create Related Navigation**
   - Navigation Property: `DepNav`

   ![image.png](attachment:8cfa2159-4d22-4abe-8c60-d8315bbff538:image.png)

6. Click on Next
7. Select **Dependent Property**: `depid`

![image.png](attachment:b7ec8c12-eed0-44bb-93b0-bfa69705980a:image.png)

1. Click Next → **Finish**
2. Generate runtime artifacts

### Service Maintenance

1. Go to **Service Maintenance (/n/iwfnd/maint_service)**
2. Add Service

![image.png](attachment:0d2a813d-408b-4de3-8257-d88290001bf4:image.png)

1. Click on the service and Click on Tick mark
2. Filter you service

![image.png](attachment:3c4c3f2f-20ed-4106-a1b4-d8c8596cf587:image.png)

1. Click on **SAP Gateway Client →** EntitySets → Select wa_hdrSet

![image.png](attachment:5403b3f2-189f-4555-9913-238975e67e90:image.png)

### Display Both Entities Together

- Use method: `GET_EXPANDED_ENTITYSET`

![Untitled.png](attachment:84f05796-736e-4381-b271-7d984df306c5:ec148a74-4a33-4a4c-90f0-2a43e05f2f4b.png)

- Find the above folder, and under it will be `GET_EXPANDED_ENTITYSET` method.
- Right Click on the method and Redefine

Code for GET_EXPANDED_ENTITYSET Method

```abap
data: BEGIN OF ty_deep_entity,
include type ZCL_Z3708_PROJ_MPC_EXT=>ts_wa_hdr.
  DATA: DepNav type ZCL_Z3708_PROJ_MPC_EXT=>tt_wa_itm,
END OF ty_deep_entity.
DATA: it_entity like TABLE of ty_deep_entity,
      wa_entity like LINE OF it_entity.

data: it_header type TABLE of Z3708_DEPT,
      it_item TYPE TABLE of Z3708_EMP.
DATA: wa_odata_item TYPE ZCL_Z3708_PROJ_MPC_EXT=>ts_wa_itm.
DATA(lv_set_name) = IO_TECH_REQUEST_CONTEXT->get_entity_set_name( ).
CASE lv_set_name.
  WHEN 'wa_hdrSet'.
    select * from Z3708_DEPT into TABLE it_header.
      if sy-subrc = 0.
      select * from Z3708_EMP
        into TABLE it_item
        FOR ALL ENTRIES IN it_header
        WHERE deptid = it_header-deptid.
      endif.
      LOOP AT it_header INTO DATA(wa_header).
      MOVE-CORRESPONDING wa_header to wa_entity.
	      LOOP AT it_item INTO DATA(wa_item)
              WHERE deptid = wa_header-deptid.
      MOVE-CORRESPONDING wa_item to wa_odata_item.
      APPEND wa_odata_item to wa_entity-depnav.
      clear: wa_odata_item, wa_item.
      append wa_entity to it_entity.
      clear: wa_entity, wa_header.
            ENDLOOP.
        ENDLOOP.

"CALL METHOD to be created by you, do not use this (for process see below)
CALL METHOD ME->/IWBEP/IF_MGW_CONV_SRV_RUNTIME~COPY_DATA_TO_REF
  EXPORTING
    IS_DATA = it_entity
  CHANGING
    CR_DATA = er_entityset
    .

  ENDCASE.
```

**Go to Service Maintainance and Test**

![image.png](attachment:b9fcc5a6-d47b-4bdf-8dfe-66e5ecbab022:image.png)

### ABAP Pattern for Method Call

1. Go to: `More → Edit → Pattern`
2. Choose: `ABAP Object Function`
3. Enter:
   - **Instance Name**: Project name
   - **Method**: `<project_name>-DPC_EXT`

![image.png](attachment:dee4068a-4e81-46d0-b419-6c36a94f4232:image.png)

- Click on Method, and Search copy and select first one

![image.png](attachment:4362ff99-584a-4f1e-89d4-81958aca39d0:image.png)

- In the code, for blank space in CALL METHOD, Fill as given below
  - `IS_DATA` = it_entity
  - `CR_DATA` = er_entityset

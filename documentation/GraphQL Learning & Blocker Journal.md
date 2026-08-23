# GraphQL Learning & Blocker Journal

## 1. Learning Objective

**Tool selected:** GraphQL

**Reason for selection:**

I chose GraphQL because I had not used it before. My goal was to learn the basics and build a small working prototype with it.

**Prototype objective:**

Build a small inventory prototype that can look up product information using GraphQL.

---

## 2. Learning and Development Log

### 19/08/2026

- **Checked development environment — 4 mins**
  - Discovered that Node.js was not installed on the computer.

- **Installed Node.js — 10 mins**
  - Installed Node.js and verified that both `node` and `npm` commands worked successfully.

- **Created project — 10 mins**
  - Created a separate project directory and initialized it using `npm init -y`.

- **Installed dependencies — 5 mins**
  - Installed the `graphql` and `@graphql-tools/schema` packages successfully.

- **Created prototype file — 20 mins**
  - Created `server.js` and began implementing the GraphQL prototype.

- **First prototype run — 5 mins**
  - Successfully executed a GraphQL query and received structured product data for Blue Sneakers.

- **Tested valid SKU lookup — 5 mins**
  - Tested `NS-JACK-002` and successfully retrieved the Black Jacket's product information.

- **Tested out-of-stock product — 5 mins**
  - Tested `NS-HEAD-003`. The query returned stock `0` and `available: false`.

- **Tested invalid SKU — 5 mins**
  - Tested `NS-9999`. The GraphQL response returned `product: null`.

- **Added and tested all-products query — 15 mins**
  - Added a query that retrieves the complete product collection.
  - Initially tested it with three products and later retested it after expanding the inventory to eight products.

- **Expanded inventory dataset — 15 mins**
  - Added five additional products, increasing the dataset from three to eight products.

- **Tested GraphQL field selection — 10 mins**
  - Modified a products query to request only `name` and `stock`.

- **Added and tested in-stock product filter — 15 mins**
  - Added a `productsInStock` query that filters products where stock is greater than zero.
  - The query returned six products.

- **Added and tested GraphQL argument — 30 mins**
  - Added an optional `minStock` argument to the `products` query.
  - Testing with `minStock: 10` returned products with at least 10 units in stock.

- **Tested optional GraphQL argument — 5 mins**
  - Tested the `products` query without providing `minStock`.
  - The query returned all eight products.

### 2A. Time Management

I kept the prototype relatively small and focused on the core GraphQL functionality rather than trying to build a larger application.

I worked through the prototype in stages, starting with environment setup and the initial query, then moving on to testing, expanding the dataset, adding filters and carrying out final tests. The development log records the estimated time spent on each activity.

---

## 3. Blocker and Troubleshooting Log

### Blocker 1 — Node.js Was Not Installed

**Problem:**

When I first checked the development environment, the `node --version` command was not recognized.

**Resolution:**

I installed Node.js and reopened Command Prompt. I then checked the installation using `node --version` and `npm --version`.

**Outcome:**

Both commands returned version numbers and I was able to continue setting up the project.

---

### Blocker 2 — Project Directory Could Not Be Accessed

**Problem:**

I initially tried to navigate to the Desktop using `%USERPROFILE%\Desktop`, but Windows returned:

```text
The system cannot find the path specified.
```

**Resolution:**

I created the project directly under `C:\Users\Admin\` instead and continued from there.

**Outcome:**

The project was successfully created and initialized using `npm init -y`.

---

### Blocker 3 — `server.js` Was Missing

**Problem:**

After installing the GraphQL packages, I checked the project folder and noticed that `server.js` had not been created.

**Investigation:**

I used the `dir` command to check the contents of the folder and confirmed that the file was missing.

**Resolution:**

I created `server.js` using Notepad from inside the project folder and checked the directory again.

**Outcome:**

The file appeared in the correct project directory and I continued with the prototype.

---

### Blocker 4 — SKU Entered Before Starting the Program

**Problem:**

During testing, I entered `NS-HEAD-003` directly into Command Prompt without first running the Node.js program.

**Error:**

```text
'NS-HEAD-003' is not recognized as an internal or external command
```

**Investigation:**

I realized that Command Prompt was treating the SKU as a Windows command because the Node.js program was not running.

**Resolution:**

I ran `node server.js` first and waited for the `Enter product SKU:` prompt before entering the SKU.

**Outcome:**

The lookup then ran correctly and returned the expected GraphQL response.

---

### Blocker 5 — Syntax Error When Adding the Stock Filter

**Problem:**

After adding the `productsInStock` resolver, the program failed to start.

**Error:**

```text
SyntaxError: Unexpected identifier 'productsInStock'
```

**Investigation:**

I checked the resolver section and found that the previous resolver was not correctly separated from the new one.

**Resolution:**

I added the missing comma between the resolver definitions.

**Outcome:**

The syntax error was fixed and the `productsInStock` query worked, returning the six products that had stock available.

---

### Blocker 6 — Program Became Unresponsive After Modifying Option 2

**Problem:**

After changing Option 2 to accept a minimum stock value, the program became unresponsive.

**Investigation:**

I stopped the program and checked the Option 2 code. I found that I had accidentally left a duplicate `choice === "2"` section and some old code.

**Resolution:**

I removed the duplicated code, corrected the relevant syntax and ran the program again.

**Outcome:**

The program became responsive again. I tested the `minStock` option with a value of `10`, and it returned the expected three products.

---

### Blocker 7 — PowerShell Prevented `npm` From Running

**Problem:**

PowerShell prevented `npm` from running because script execution was disabled.

**Resolution:**

I used `npm.cmd` instead of `npm`.

**Outcome:**

The project initialized successfully and Express was installed without reported vulnerabilities.

---

## 4. Prototype Milestone

The first GraphQL query was successfully executed using:

```text
node server.js
```

The prototype returned:

- SKU: `NS-SHOE-001`
- Product: Blue Sneakers
- Category: Footwear
- Price: 4500
- Stock: 14
- Availability: `true`

This confirmed that the GraphQL schema, query, resolver and mock inventory data were functioning together successfully.

---

## 5. Functional Testing

### Valid Product

- **Input:** `NS-JACK-002`
- **Expected:** Product information should be returned.
- **Actual:** Black Jacket returned with stock of 7 and availability `true`.
- **Status:** PASS

### Out-of-Stock Product

- **Input:** `NS-HEAD-003`
- **Expected:** Product should be returned with zero stock and unavailable status.
- **Actual:** Wireless Headphones returned with stock 0 and availability `false`.
- **Status:** PASS

### Invalid Product

- **Input:** `NS-9999`
- **Expected:** No matching product should be returned.
- **Actual:** GraphQL returned `product: null`.
- **Status:** PASS

### All Products

- **Input:** Products query
- **Expected:** All products should be returned.
- **Actual:** All eight products were returned successfully.
- **Status:** PASS

### Field Selection

- **Input:** `name`, `stock`
- **Expected:** Only the requested fields should be returned.
- **Actual:** Only the requested fields were returned.
- **Status:** PASS

### Minimum-Stock Filter

- **Input:** `minStock: 10`
- **Expected:** Products with stock ≥ 10 should be returned.
- **Actual:** Blue Sneakers, Travel Backpack and Red T-Shirt were returned.
- **Status:** PASS

### In-Stock Filter

- **Input:** `productsInStock`
- **Expected:** Products with stock > 0 should be returned.
- **Actual:** Six products were returned; zero-stock products were excluded.
- **Status:** PASS

### Optional Argument

- **Input:** Products query without `minStock`
- **Expected:** All products should be returned.
- **Actual:** All eight products were returned.
- **Status:** PASS

### Testing Outcome

The functional tests passed. The prototype successfully handled valid product lookups, out-of-stock products, nonexistent SKUs, collection queries, field selection, stock filtering and optional query arguments.

---

## 6. Key Concepts Learned

### GraphQL Schema

Defines the types of data and operations that can be requested.

### GraphQL Query

Specifies the information that the client wants to retrieve.

### Resolver

Provides the logic used to obtain and process the requested data.

### GraphQL Response

Returns the requested data in a structured format.

### Querying Collections

GraphQL can retrieve a collection of objects rather than a single object. The client specifies the fields it wants returned for each object in the collection.

### Field Selection

GraphQL allows the client to specify exactly which fields it wants returned. When the query requested only `name` and `stock`, the response contained only those fields rather than the complete product objects.

### Resolver Logic and Filtering

A GraphQL resolver can contain application logic that determines which data is returned. In this prototype, the `productsInStock` resolver uses a filter condition to return only products where `stock > 0`.

### Query Arguments

GraphQL queries can accept arguments that influence the data returned. The optional `minStock` argument demonstrated how a client can request products meeting a specified stock threshold.

---

## 7. Resources Consulted

- **GraphQL official documentation** — Used to learn GraphQL concepts, schema structure, queries, resolvers, and general documentation.
- **Node.js documentation and resources** — Used to understand the JavaScript runtime environment and project setup.

---

## 8. Final Status

**Prototype status: Complete**

Completed:

- Node.js environment setup
- Project initialization
- GraphQL package installation
- GraphQL schema creation
- Product data creation
- Resolver implementation
- Individual SKU lookups
- Collection queries
- GraphQL field selection
- In-stock filtering
- Minimum-stock filtering using a query argument
- Functional testing
- Troubleshooting and blocker resolution

---

## 9. Reflection

Working with GraphQL was a useful learning experience because it was a technology I had not used before.

The process involved both environment setup issues and implementation errors, including missing files, command-line mistakes, syntax errors and problems caused by duplicated code. I resolved these issues by checking error messages, inspecting the project files, correcting the relevant code and rerunning the prototype to verify the fixes.

As I progressed, I learned how GraphQL schemas, queries, resolvers, field selection and query arguments work together. I also learned that GraphQL allows clients to request only the data they need and that resolver logic can be used to filter and process data before it is returned.

The prototype progressed from a basic product lookup to a working inventory prototype supporting individual SKU lookups, collection queries, field selection, stock filtering and an optional minimum-stock argument. The final tests passed, including valid, out-of-stock and invalid SKU lookups.

Overall, the exercise improved my confidence in learning an unfamiliar technology independently and troubleshooting problems through investigation rather than relying on direct technical guidance.

- On-Premise System
  ## 1. Add Deployment Configuration (BAS / VS Code)
  The steps are the same in **SAP Business Application Studio (BAS)** and **VS Code**.
  ### In VS Code:
  1. Open **Command Palette** → `Ctrl + Shift + P`
  2. Search for **“Deployment Configuration”**
  3. Select **Deployment Configuration Generator**
  ### Configure the following:
  - **Target** → `ABAP`
  - **Target System** →
    - Select your S/4HANA system
    - If not visible:
      - Add system via **Connection Manager** (available with Fiori extensions)
  - **SAPUI5 ABAP Repository Name** → Unique name
  - **Deployment Description** → Your choice
  - **Package** →
    - Use `$TMP` (local), OR
    - Provide a custom package + Transport Request
  A file named `ui5-deploy.yaml` will be created
  ## 2. Deploy the Application
  Run the following in the terminal:
  ```bash
  npm run deploy
  ```
  The app will be deployed to the **on-premise S/4HANA system**
  ## 3. Verify Deployment
  1. Open SAP GUI
  2. Go to transaction code: `SE80`
  3. Select **BSP Application**
  4. Enter the **repository name**
  Your application should be visible here
  ## 4. Create Semantic Object
  1. Go to transaction: `/n/UI2/SEMOBJ`
  2. Click **New Entries**
  3. Provide:
     - Semantic Object
     - Name
     - Description
  4. Save and Display
  ## 5. Open Fiori Launchpad Designer
  Transaction: `/n/UI2/FLPD_CUST`
  (Optional)
  - Set **Custom Transport Request** via **Settings (top right icon)**
  ## 6. Create Catalog
  1. Go to **Catalogs** tab
  2. Click **+** icon at the bottom
  3. Provide:
     - **Title**
     - **ID** (cannot be changed later)
  After creating, perform two steps:
  - Create **Tile**
  - Create **Target Mapping**
  ### 6.1 Create Tile
  1. Go to **Tiles** tab
  2. Click **+**
  3. Choose **Static Tile**
  4. Enter details:
     - Title, Subtitle, Keywords, Icon → Your choice
     - **Semantic Object** → Created earlier
     - **Action** → `display`
  ### 6.2 Create Target Mapping
  1. Go to **Target Mapping** tab
  2. Click **Create Target Mapping**
  3. Enter:
     - **Semantic Object** → Created earlier
     - **Action** → `display`
     - **Application Title / Title** → Your choice
     - **URL** →
       ```
       /sap/bc/ui5_ui5/sap/<Repository_Name>
       ```
     - **ID** → From `manifest.json`
  ## 7. Create Group
  1. Go to **Groups** tab
  2. Provide:
     - Title
     - ID
  3. Click **+**
  4. Search for the **Catalog**
  5. Add the application (click **+ icon**)
  ## Final Step: Access Application
  - Once the **SAP Security/Basis team** provides required roles
  - The app will be visible in the **Fiori Launchpad**

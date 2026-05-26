- SAP Build Work Zone
  ## 1. Create the Fiori Application in BAS
  When creating your app using the **SAP Fiori Application Generator** in **Business Application Studio (BAS)**:
  ### Project Attributes
  - Set **Add Deployment Configuration** → `Yes`
  - Set **Add FLP Configuration** → `Yes`
  ## 2. Configure Deployment Settings
  During the deployment setup, select:
  - **Target** → `Cloud Foundry`
  - **Destination** →
    - Select an existing destination (if required), OR
    - Leave it empty
  - **Router Module** →
    - Choose **"Add application to managed application router"**
  ## 3. Configure Fiori Launchpad (FLP)
  Provide the following details:
  - **Semantic Object** → Your choice
  - **Action** → `display`
  - **Title / Subtitle** → As needed
  ## 4. Build and Deploy the Application
  1. Locate the `mta.yaml` file in your project.
  2. Right-click → **Build MTA Project**
  3. This generates an `mta_archives` folder.
  4. Right-click the generated `.mtar` file → **Deploy MTA Archive**
  ### Login to Cloud Foundry
  - Enter your credentials
  - Use **SSO Passcode** for authentication
  Deployment will start automatically in the terminal.
  # Deployment Configuration in SAP BTP
  ## Step 1: Subscribe to SAP Build Work Zone
  ### Enable User Access (IAM Setup)
  1. Go to **BTP Cockpit → Instances and Subscriptions**
  2. Click **Create** → Select **Cloud Identity Services**
  3. Activate the service via the email sent to your inbox
  ### Create / Manage Users
  - Open **Cloud Identity Services**
  - Go to **User Management**
  - Create users if needed (one admin user exists by default)
  ### Establish Trust Configuration
  1. In **BTP Cockpit → Security → Trust Configuration**
  2. Click **Establish Trust**
  3. Add **Cloud Identity Service**
  ### Assign Roles
  1. Go to **Security → Users**
  2. Select a user
  3. Open **Role Collections**
  4. Assign all **"Launchpad" roles** for admin access
  ### Subscribe to Build Work Zone
  - Go to **Instances and Subscriptions**
  - Subscribe to **SAP Build Work Zone**
  ## Step 2: Configure UI5 Application in Work Zone
  ### Add Application to Work Zone
  1. Open **SAP Build Work Zone**
  2. Go to **Channel Manager**
  3. Click **Refresh** to load deployed applications
  ### Add App to Content Manager
  1. Go to **Content Manager → Content Explorer**
  2. Select **HTML5 Apps**
  3. Find your application
  4. Add your application
  ### Create a Group
  1. In **Content Manager**, click **Create**
  2. Create a **Group**
  3. Add your application to the group
  ### Assign App to Roles
  1. In **Content Manager**, open the role **"Everyone"**
  2. Click **Edit**
  3. Enable (toggle ON) your application assignment
  ### Create a Site
  1. Go to **Site Directory**
  2. Click **Create Site**
  Your application will now be accessible from this site.
  # Final Result
  - App is deployed to **Cloud Foundry**
  - Integrated into **SAP Build Work Zone**
  - Visible via **Launchpad site**

# AI Finance Advisor Using ERP

An enterprise-grade ERP Dashboard and AI Financial Advisor web application built with **React 19**, **Vite**, and **MongoDB Atlas** (using **Python / PyMongo**).

---

## 📌 Project Overview

This application provides financial officers and department leads with real-time analytics across three core business domains:
1. **Finance**: Revenue, monthly spend, cash flow, operational margins, and general ledger transactions.
2. **Sales**: Annual Recurring Revenue (ARR), closed deals, deal pipeline velocity, and quota tracking.
3. **HR & Workforce**: Headcount velocity, payroll burn rate, retention metrics, and organizational requisitions.

It includes an interactive **AI Advisor Chatbot** panel simulating conversational query processing over ERP records.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite, Lucide React (vector icons), Vanilla CSS (enterprise dark/light palette).
* **Database & Cloud**: MongoDB Atlas (`ai_finance_erp` cluster).
* **Backend & Scripting**: Python 3.11, PyMongo (`pymongo[srv]`), `dnspython`, `python-dotenv`.

---

## 🚀 What Was Done in This Project

Here is a summary of all implementations completed so team members can get up to speed quickly:

### 1. Database Connection & Driver Setup
* Configured the Python 3.11 environment and installed database drivers:
  * `pymongo[srv]`: MongoDB Python driver with DNS SRV cluster support.
  * `dnspython`: Required for resolving `mongodb+srv://` connection strings.
  * `python-dotenv`: Safe loading of local environment variables.
* Created [`db_connection.py`](db_connection.py):
  * Manages MongoClient creation and handles connection pooling.
  * Automatically URL-encodes special characters in database passwords (e.g., `@`, `#`, `/`).
  * Includes a built-in `ping` diagnostic function to verify Atlas connectivity.

### 2. Security & Environment Configuration
* Configured [`.env`](.env) for local credentials and generated [`.env.example`](.env.example) as a safe template.
* Updated [`.gitignore`](.gitignore) to ensure `.env`, `.env.*`, and `*credentials.env` are excluded from Git, preventing accidental leaks of MongoDB Atlas user credentials.

### 3. Database Seeding (`seed_db.py`)
* Created and executed [`seed_db.py`](seed_db.py) to seed the MongoDB Atlas cluster (`ai_finance_erp` database).
* Initialized 4 core collections:
  * **`erp_contexts`** (3 documents): Complete KPI metrics, targets, and 12-month chart trajectories for Finance, Sales, and HR.
  * **`transactions`** (24 documents):
    * 8 Finance general ledger transactions (`TX-9401` to `TX-9408`)
    * 8 Sales CRM deals (`DEAL-882` to `DEAL-889`)
    * 8 HR workforce payroll records (`HR-501` to `HR-508`)
  * **`chat_messages`** (2 documents): Initial conversation seeds with mock MCP SQL query metadata.
  * **`suggested_queries`** (4 documents): Context-aware prompt suggestions for user questions.

### 4. Interactive Frontend Dashboard
* Built a responsive 3-column layout:
  * **Left Sidebar**: ERP domain context switcher (Finance, Sales, HR) and database schema tags.
  * **Middle Dashboard**: Executive KPI metric cards, trajectory charts, and audit-ready data table.
  * **Right Chatbot**: AI Financial Advisor conversational assistant with query dispatching.

---

## 📂 Project Structure

```text
├── .env.example             # Template for MongoDB Atlas credentials
├── .gitignore               # Excludes node_modules, dist, and .env files
├── db_connection.py         # MongoDB connection helper and cluster ping test
├── seed_db.py               # Database seeder for MongoDB Atlas
├── package.json             # Frontend dependencies & npm scripts
├── vite.config.js           # Vite configuration
│
├── public/                  # Static assets
└── src/
    ├── App.jsx              # Main application shell with 3-column layout
    ├── App.css              # Grid layout & responsive styles
    ├── index.css            # Global CSS variables & typography
    ├── main.jsx             # React DOM entry point
    │
    ├── components/
    │   ├── LeftSidebar/     # Domain switcher (Finance, Sales, HR)
    │   ├── MiddleDashboard/ # KPI cards, trajectory charts, ledger table
    │   └── RightChatbot/    # AI advisor conversational interface
    │
    ├── data/
    │   └── mockData.js      # Baseline mock dataset for the frontend
    └── test/                # Component unit tests (Vitest)
```

---

## 🏁 Getting Started for Team Members

### 1. Prerequisites
* **Node.js** (v18+ recommended)
* **Python 3.11+**
* MongoDB Atlas account with access to the cluster

---

### 2. Frontend Setup & Run
1. Install npm dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

### 3. Database & Python Setup
1. Install the required Python packages:
   ```bash
   python -m pip install "pymongo[srv]" dnspython python-dotenv
   ```
   *(Note for Windows: If `python` is not mapped in your PATH, invoke using the full path to `python.exe`)*

2. Set up your local `.env` file:
   * Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   * Populate your MongoDB Atlas credentials:
     ```env
     MONGODB_USERNAME=your_username
     MONGODB_PASSWORD=your_password
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.zl0is2d.mongodb.net/?retryWrites=true&w=majority
     MONGODB_DB_NAME=ai_finance_erp
     ```

3. Test your connection to MongoDB Atlas:
   ```bash
   python db_connection.py
   ```
   You should see:
   ```text
   [*] Connecting to MongoDB Atlas cluster...
   Connected successfully to MongoDB Atlas!
   ```

4. Populate or reset the database with mock records:
   ```bash
   python seed_db.py
   ```

---

## ⚠️ Common Troubleshooting

* **IP Whitelist / Network Access**: If `db_connection.py` times out, check **MongoDB Atlas** &rarr; **Network Access** and ensure your current IP address (or `0.0.0.0/0` during development) is allowed.
* **Password with Special Characters**: If your MongoDB user password contains characters like `@`, `:`, or `#`, `db_connection.py` handles URL-encoding automatically when using `MONGODB_PASSWORD`.
* **Windows Python Alias**: If running `python` prompts Microsoft Store, use the direct Python executable path (e.g. `C:\Users\<user>\AppData\Local\Programs\Python\Python311\python.exe -m pip install ...`).

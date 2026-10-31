import os
import random
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv
from db_connection import get_mongo_client

load_dotenv()

DB_NAME = os.getenv("MONGODB_DB_NAME", "ai_finance_erp")

# Deterministic random seed for consistent generation if desired
random.seed(42)

# ==============================================================================
# Enterprise Master Data Catalog
# ==============================================================================

DEPARTMENTS = [
    {"code": "ENG", "name": "R&D Engineering", "cost_center": "CC-100", "headcount_target": 184},
    {"code": "SLS", "name": "Enterprise Sales", "cost_center": "CC-200", "headcount_target": 96},
    {"code": "MKT", "name": "Marketing & Demand Gen", "cost_center": "CC-250", "headcount_target": 35},
    {"code": "PRD", "name": "Product & UX Design", "cost_center": "CC-300", "headcount_target": 42},
    {"code": "CS",  "name": "Customer Success & Support", "cost_center": "CC-350", "headcount_target": 30},
    {"code": "FIN", "name": "Corporate Finance & Treasury", "cost_center": "CC-400", "headcount_target": 18},
    {"code": "OPS", "name": "IT & Infrastructure Ops", "cost_center": "CC-450", "headcount_target": 14},
    {"code": "HR",  "name": "Global People Operations", "cost_center": "CC-500", "headcount_target": 12},
    {"code": "LGL", "name": "Legal & Compliance", "cost_center": "CC-550", "headcount_target": 6},
    {"code": "EXE", "name": "Executive Leadership", "cost_center": "CC-900", "headcount_target": 5},
]

GL_ACCOUNTS = [
    # Assets (1000s)
    {"account_code": "1010", "name": "Operating Cash & Checking", "category": "Current Assets", "type": "Asset", "normal_balance": "Debit"},
    {"account_code": "1020", "name": "Treasury Liquid Money Market", "category": "Current Assets", "type": "Asset", "normal_balance": "Debit"},
    {"account_code": "1100", "name": "Accounts Receivable (A/R)", "category": "Current Assets", "type": "Asset", "normal_balance": "Debit"},
    {"account_code": "1200", "name": "Prepaid Cloud & Software Subscriptions", "category": "Current Assets", "type": "Asset", "normal_balance": "Debit"},
    {"account_code": "1500", "name": "Server Hardware & Office Equipment", "category": "Non-Current Assets", "type": "Asset", "normal_balance": "Debit"},
    {"account_code": "1590", "name": "Accumulated Depreciation", "category": "Contra Assets", "type": "Asset", "normal_balance": "Credit"},
    
    # Liabilities (2000s)
    {"account_code": "2010", "name": "Accounts Payable (A/P)", "category": "Current Liabilities", "type": "Liability", "normal_balance": "Credit"},
    {"account_code": "2020", "name": "Accrued Employee Payroll & Bonuses", "category": "Current Liabilities", "type": "Liability", "normal_balance": "Credit"},
    {"account_code": "2030", "name": "Accrued Corporate Taxes", "category": "Current Liabilities", "type": "Liability", "normal_balance": "Credit"},
    {"account_code": "2200", "name": "Deferred Contract Revenue (Unearned)", "category": "Current Liabilities", "type": "Liability", "normal_balance": "Credit"},
    
    # Equity (3000s)
    {"account_code": "3010", "name": "Common Stock - Par Value", "category": "Equity", "type": "Equity", "normal_balance": "Credit"},
    {"account_code": "3020", "name": "Additional Paid-In Capital (APIC)", "category": "Equity", "type": "Equity", "normal_balance": "Credit"},
    {"account_code": "3050", "name": "Retained Earnings", "category": "Equity", "type": "Equity", "normal_balance": "Credit"},
    
    # Revenue (4000s)
    {"account_code": "4010", "name": "SaaS Platform Recurring Revenue (ARR)", "category": "Operating Revenue", "type": "Revenue", "normal_balance": "Credit"},
    {"account_code": "4020", "name": "Enterprise Implementation Services", "category": "Service Revenue", "type": "Revenue", "normal_balance": "Credit"},
    {"account_code": "4030", "name": "API Usage & Overages Revenue", "category": "Usage Revenue", "type": "Revenue", "normal_balance": "Credit"},
    
    # Cost of Goods Sold (5000s)
    {"account_code": "5010", "name": "Cloud Infrastructure Hosting (AWS/Azure/GCP)", "category": "COGS", "type": "Expense", "normal_balance": "Debit"},
    {"account_code": "5020", "name": "Customer Support & Implementation Payroll", "category": "COGS", "type": "Expense", "normal_balance": "Debit"},
    {"account_code": "5030", "name": "Third-Party AI & LLM Inference APIs", "category": "COGS", "type": "Expense", "normal_balance": "Debit"},
    
    # Operating Expenses (6000s)
    {"account_code": "6010", "name": "Engineering & Technology Payroll", "category": "R&D Expense", "type": "Expense", "normal_balance": "Debit"},
    {"account_code": "6020", "name": "Sales Salaries & Commissions", "category": "Sales Expense", "type": "Expense", "normal_balance": "Debit"},
    {"account_code": "6030", "name": "Marketing Advertising & Lead Acquisition", "category": "Marketing Expense", "type": "Expense", "normal_balance": "Debit"},
    {"account_code": "6040", "name": "G&A Executive & People Operations", "category": "G&A Expense", "type": "Expense", "normal_balance": "Debit"},
    {"account_code": "6050", "name": "Legal, Audit & Compliance Retainers", "category": "G&A Expense", "type": "Expense", "normal_balance": "Debit"},
    {"account_code": "6060", "name": "SaaS Software Tooling & Licenses", "category": "Operating Expense", "type": "Expense", "normal_balance": "Debit"},
    {"account_code": "6070", "name": "Travel, Conferences & Client Entertainment", "category": "Operating Expense", "type": "Expense", "normal_balance": "Debit"},
]

CUSTOMER_NAMES = [
    ("Apex Global Cloud Solutions", "Technology", "North America", "Tier 1"),
    ("CyberShield Systems Inc", "Cybersecurity", "North America", "Tier 1"),
    ("BlueWave Biotech Corp", "Healthcare", "Europe", "Tier 2"),
    ("Zenith Logistics Enterprise", "Supply Chain", "North America", "Tier 1"),
    ("Titan Retail Consortium", "Retail", "Europe", "Tier 1"),
    ("Horizon Health Dynamics", "Healthcare", "North America", "Tier 2"),
    ("Novus Telecom International", "Telecommunications", "APAC", "Tier 1"),
    ("Helios Hardware Supply Inc", "Manufacturing", "North America", "Tier 3"),
    ("Quantum Leap Labs Hosting", "Technology", "Europe", "Tier 2"),
    ("Datacore Infrastructure Ltd", "Cloud Infrastructure", "North America", "Tier 1"),
    ("Vanguard Logistics ERP Sync", "Supply Chain", "North America", "Tier 2"),
    ("Nordic Fintech Partners", "Fintech", "Europe", "Tier 1"),
    ("Cascade Energy Grid", "Utilities", "North America", "Tier 2"),
    ("Starlight Media Enterprise", "Media", "North America", "Tier 2"),
    ("Aegis Security Networks", "Cybersecurity", "APAC", "Tier 2"),
    ("Solaria Renewables Inc", "Clean Energy", "Europe", "Tier 3"),
    ("Orion Autonomous Mobility", "Automotive", "North America", "Tier 1"),
    ("OmniCorp Health Systems", "Healthcare", "North America", "Tier 1"),
    ("Pacific Rim Trading Hub", "Logistics", "APAC", "Tier 2"),
    ("Atlas BioPharma Group", "Life Sciences", "Europe", "Tier 1"),
    ("Sierra Robotics & Automation", "Manufacturing", "North America", "Tier 2"),
    ("Crestview Financial Partners", "Asset Management", "North America", "Tier 1"),
    ("Nexus Digital Retailers", "E-Commerce", "Europe", "Tier 2"),
    ("Equinox Telecom Group", "Telecommunications", "LATAM", "Tier 2"),
    ("Pinnacle Global Banking", "Banking", "Europe", "Tier 1"),
]

VENDOR_NAMES = [
    ("Amazon Web Services (AWS)", "Cloud Infrastructure", "Net 30"),
    ("Microsoft Azure Cloud", "Cloud Infrastructure", "Net 30"),
    ("Google Cloud Platform", "Cloud Infrastructure", "Net 30"),
    ("Snowflake Computing", "Data Warehouse", "Net 45"),
    ("Datadog Enterprise Monitoring", "Observability", "Net 30"),
    ("Salesforce.com Inc", "CRM Software", "Annual Prepay"),
    ("Workday HCM Solutions", "HR & Payroll Software", "Annual Prepay"),
    ("Slack Technologies / Salesforce", "Collaboration", "Annual Prepay"),
    ("Atlassian Cloud Services", "DevOps Tooling", "Net 30"),
    ("CrowdStrike Falcon Cloud", "Endpoint Security", "Annual Prepay"),
    ("PwC Advisory & Tax Services", "Professional Auditing", "Net 60"),
    ("KPMG International LLP", "ERP Compliance Review", "Net 60"),
    ("Latham & Watkins LLP", "Corporate Legal Counsel", "Net 30"),
    ("Dell Enterprise Systems", "Laptops & Hardware", "Net 45"),
    ("Cisco Meraki Networks", "Office IT & Routing", "Net 30"),
    ("WeWork Global Office Spaces", "Facilities & Real Estate", "Net 15"),
    ("Gartner Research & Advisory", "Enterprise Intelligence", "Annual Prepay"),
    ("Stripe Payments Processing", "Merchant Fees", "Daily Net"),
    ("OpenAI Enterprise API", "AI Model Tokens", "Usage Billed"),
    ("Anthropic Claude Business", "AI Inference", "Usage Billed"),
]

FIRST_NAMES = [
    "Alex", "Jordan", "Taylor", "Morgan", "Sam", "Chris", "Pat", "Riley", "Casey", "Avery",
    "Logan", "Jamie", "Devon", "Robin", "Drew", "Prajyot", "Elena", "Liam", "Sophia", "Noah",
    "Emma", "Oliver", "Ava", "Lucas", "Mia", "Ethan", "Isabella", "Aiden", "Harper", "Mason"
]

LAST_NAMES = [
    "Vance", "Kovacs", "Chen", "Patel", "Miller", "Dubois", "Smith", "Johnson", "Williams",
    "Brown", "Jones", "Garcia", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez"
]

JOB_TITLES = {
    "ENG": ["Staff Software Engineer", "Senior Backend Architect", "DevOps Tech Lead", "Fullstack Engineer", "QA Automation Engineer", "Principal Security Engineer"],
    "SLS": ["Enterprise Account Executive", "Regional VP of Sales", "Sales Development Rep (SDR)", "Strategic Deal Specialist", "Solutions Architect"],
    "MKT": ["Director of Product Marketing", "Growth Marketing Lead", "Brand Strategist", "Content & SEO Manager"],
    "PRD": ["Lead Product Manager", "Senior UX/UI Designer", "User Researcher", "Design Systems Engineer"],
    "CS":  ["Customer Success Director", "Implementation Consultant", "Technical Support Specialist"],
    "FIN": ["Controller", "Senior Treasury Analyst", "Revenue Operations Manager", "Staff Accountant"],
    "OPS": ["IT Infrastructure Lead", "Cloud Systems Administrator", "SecOps Analyst"],
    "HR":  ["Head of Talent Acquisition", "Senior People Partner", "Compensation & Benefits Specialist"],
    "LGL": ["Corporate Counsel", "Compliance Director"],
    "EXE": ["Chief Executive Officer", "Chief Financial Officer", "Chief Technology Officer", "Chief Revenue Officer", "Chief Operating Officer"]
}

# ==============================================================================
# Helper Generators
# ==============================================================================

def random_date(start_year=2024, end_year=2026):
    start = datetime(start_year, 1, 1)
    end = datetime(end_year, 10, 26)
    delta = end - start
    random_days = random.randint(0, delta.days)
    random_seconds = random.randint(0, 86399)
    return start + timedelta(days=random_days, seconds=random_seconds)

def build_customers(count=150):
    customers = []
    for i in range(count):
        base_name, industry, region, tier = random.choice(CUSTOMER_NAMES)
        unique_name = f"{base_name} {i+1}" if i >= len(CUSTOMER_NAMES) else base_name
        cust_id = f"CUST-{1000 + i}"
        credit_limit = random.choice([250000, 500000, 1000000, 2500000, 5000000])
        customers.append({
            "customer_id": cust_id,
            "company_name": unique_name,
            "industry": industry,
            "region": region,
            "tier": tier,
            "credit_limit": credit_limit,
            "payment_terms": random.choice(["Net 30", "Net 45", "Net 60"]),
            "status": random.choices(["Active", "Under Review", "Preferred"], weights=[85, 5, 10])[0],
            "created_at": random_date(2023, 2024).strftime("%Y-%m-%d"),
            "contact_email": f"billing@{unique_name.lower().replace(' ', '').replace('.', '').replace('-', '')[:15]}.com"
        })
    return customers

def build_vendors(count=80):
    vendors = []
    for i in range(count):
        base_name, cat, terms = random.choice(VENDOR_NAMES)
        unique_name = f"{base_name} Inc #{i+1}" if i >= len(VENDOR_NAMES) else base_name
        v_id = f"VEND-{500 + i}"
        vendors.append({
            "vendor_id": v_id,
            "vendor_name": unique_name,
            "category": cat,
            "payment_terms": terms,
            "currency": "USD",
            "rating": round(random.uniform(4.2, 5.0), 1),
            "status": "Approved",
            "bank_account_verified": True
        })
    return vendors

def build_employees(target_count=428):
    employees = []
    emp_counter = 1
    for dept in DEPARTMENTS:
        count_for_dept = dept["headcount_target"]
        titles = JOB_TITLES.get(dept["code"], ["Specialist"])
        for _ in range(count_for_dept):
            fn = random.choice(FIRST_NAMES)
            ln = random.choice(LAST_NAMES)
            emp_id = f"EMP-{dept['code']}-{emp_counter:04d}"
            base_salary = random.choice([85000, 115000, 135000, 160000, 195000, 240000])
            if dept["code"] == "EXE":
                base_salary = random.choice([320000, 380000, 450000])
            
            employees.append({
                "employee_id": emp_id,
                "first_name": fn,
                "last_name": ln,
                "full_name": f"{fn} {ln}",
                "email": f"{fn.lower()}.{ln.lower()}{emp_counter % 50}@enterprise-erp.io",
                "department": dept["name"],
                "department_code": dept["code"],
                "cost_center": dept["cost_center"],
                "job_title": random.choice(titles),
                "employment_type": "Full-Time",
                "annual_base_salary": base_salary,
                "monthly_base_salary": round(base_salary / 12, 2),
                "hire_date": random_date(2021, 2026).strftime("%Y-%m-%d"),
                "status": random.choices(["Active", "On Leave"], weights=[97, 3])[0]
            })
            emp_counter += 1
            if len(employees) >= target_count:
                break
        if len(employees) >= target_count:
            break
    return employees

def build_sales_invoices(customers, count=3500):
    invoices = []
    start_date = datetime(2025, 1, 1)
    end_date = datetime(2026, 10, 26)
    delta_days = (end_date - start_date).days

    for i in range(1, count + 1):
        cust = random.choice(customers)
        inv_date = start_date + timedelta(days=random.randint(0, delta_days))
        due_date = inv_date + timedelta(days=30)
        
        # Contract amount distribution ($5K to $500K)
        amount = round(random.choice([
            random.uniform(5000, 25000),
            random.uniform(25000, 85000),
            random.uniform(85000, 250000),
            random.uniform(250000, 520000)
        ]), 2)
        
        tax_amount = round(amount * 0.0825, 2)
        total_billed = round(amount + tax_amount, 2)

        # Status determined by date
        if inv_date < datetime(2026, 8, 1):
            status = random.choices(["Paid", "Audited", "Settled"], weights=[80, 15, 5])[0]
            paid_amount = total_billed
        elif inv_date < datetime(2026, 10, 1):
            status = random.choices(["Paid", "Partially Paid", "Overdue", "Approved"], weights=[60, 15, 10, 15])[0]
            paid_amount = total_billed if status == "Paid" else round(total_billed * 0.5, 2)
        else:
            status = random.choices(["Pending Approval", "Approved", "In Review", "Processing"], weights=[40, 30, 15, 15])[0]
            paid_amount = 0.0

        invoices.append({
            "invoice_number": f"INV-2026-{10000 + i}",
            "customer_id": cust["customer_id"],
            "customer_name": cust["company_name"],
            "industry": cust["industry"],
            "region": cust["region"],
            "invoice_date": inv_date.strftime("%Y-%m-%d"),
            "due_date": due_date.strftime("%Y-%m-%d"),
            "fiscal_quarter": f"Q{(inv_date.month - 1) // 3 + 1}-{inv_date.year}",
            "fiscal_year": inv_date.year,
            "currency": "USD",
            "subtotal": amount,
            "tax_amount": tax_amount,
            "total_amount": total_billed,
            "amount_paid": paid_amount,
            "balance_due": round(total_billed - paid_amount, 2),
            "status": status,
            "line_items": [
                {
                    "item_sku": f"SKU-{random.randint(100, 999)}",
                    "description": "Enterprise SaaS Platform License - Tier Allocation",
                    "quantity": random.randint(10, 500),
                    "unit_price": round(amount * 0.75, 2)
                },
                {
                    "item_sku": "SKU-SERV-01",
                    "description": "Premium Dedicated Solutions Architect & SLA",
                    "quantity": 1,
                    "unit_price": round(amount * 0.25, 2)
                }
            ]
        })
    return invoices

def build_general_ledger_entries(count=8000, customers=None, vendors=None):
    entries = []
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2026, 10, 26)
    delta_days = (end_date - start_date).days

    rev_accounts = [a for a in GL_ACCOUNTS if a["type"] == "Revenue"]
    exp_accounts = [a for a in GL_ACCOUNTS if a["type"] == "Expense"]
    asset_accounts = [a for a in GL_ACCOUNTS if a["type"] == "Asset"]

    for i in range(1, count + 1):
        entry_date = start_date + timedelta(days=random.randint(0, delta_days))
        quarter = f"Q{(entry_date.month - 1) // 3 + 1}-{entry_date.year}"
        tx_type = random.choice(["Revenue Accrual", "Vendor Bill Payment", "Payroll Disbursement", "Cloud Hosting OPEX", "Hardware CapEx", "Audit Adjustment"])
        
        dept = random.choice(DEPARTMENTS)
        
        if "Revenue" in tx_type:
            account = random.choice(rev_accounts)
            entity = random.choice(customers)["company_name"] if customers else "Enterprise Client"
            amount = round(random.uniform(15000, 350000), 2)
            entry_type = "Credit"
        elif "Vendor" in tx_type or "Cloud" in tx_type:
            account = random.choice(exp_accounts)
            entity = random.choice(vendors)["vendor_name"] if vendors else "Enterprise Vendor"
            amount = round(random.uniform(5000, 185000), 2)
            entry_type = "Debit"
        elif "Payroll" in tx_type:
            account = next((a for a in GL_ACCOUNTS if a["account_code"] == "6010"), exp_accounts[0])
            entity = f"{dept['name']} Monthly Payroll"
            amount = round(random.uniform(45000, 290000), 2)
            entry_type = "Debit"
        else:
            account = random.choice(asset_accounts)
            entity = "Treasury Reserve Transfer"
            amount = round(random.uniform(25000, 500000), 2)
            entry_type = "Debit"

        entries.append({
            "journal_entry_id": f"JE-{entry_date.year}-{100000 + i}",
            "transaction_date": entry_date.strftime("%Y-%m-%d"),
            "fiscal_year": entry_date.year,
            "fiscal_quarter": quarter,
            "transaction_type": tx_type,
            "department": dept["name"],
            "cost_center": dept["cost_center"],
            "account_code": account["account_code"],
            "account_name": account["name"],
            "account_category": account["category"],
            "entry_type": entry_type,
            "amount": amount,
            "currency": "USD",
            "contra_account": "1010 - Operating Cash" if entry_type == "Debit" else "1100 - Accounts Receivable",
            "entity": entity,
            "reconciliation_status": random.choices(["Reconciled", "Audited", "Pending Review"], weights=[80, 15, 5])[0],
            "posted_by": f"sys.ledger.sync_{random.randint(1, 4)}@enterprise-erp.io",
            "batch_hash": uuid.uuid4().hex[:12]
        })
    return entries

def build_payroll_records(employees, count=4500):
    records = []
    # Generate monthly payroll runs for 2025 and 2026
    pay_dates = [
        datetime(2025, m, 28) for m in range(1, 13)
    ] + [
        datetime(2026, m, 28) for m in range(1, 10)
    ]

    record_counter = 1
    for p_date in pay_dates:
        # Sample active employees for each payroll run
        sampled_emps = random.sample(employees, min(len(employees), 220))
        for emp in sampled_emps:
            gross = emp["monthly_base_salary"]
            tax = round(gross * 0.22, 2)
            benefits = round(gross * 0.065, 2)
            retirement_401k = round(gross * 0.05, 2)
            net_pay = round(gross - (tax + benefits + retirement_401k), 2)

            records.append({
                "payroll_run_id": f"PAY-{p_date.strftime('%Y%m')}-{record_counter:06d}",
                "pay_period_end": p_date.strftime("%Y-%m-%d"),
                "fiscal_year": p_date.year,
                "fiscal_quarter": f"Q{(p_date.month - 1) // 3 + 1}-{p_date.year}",
                "employee_id": emp["employee_id"],
                "employee_name": emp["full_name"],
                "department": emp["department"],
                "cost_center": emp["cost_center"],
                "gross_pay": gross,
                "tax_withholding": tax,
                "benefits_deduction": benefits,
                "retirement_401k": retirement_401k,
                "net_pay": net_pay,
                "payment_status": "Disbursed",
                "direct_deposit_verified": True
            })
            record_counter += 1
            if len(records) >= count:
                break
        if len(records) >= count:
            break
    return records

def build_department_budgets():
    budgets = []
    quarters = ["Q1-2025", "Q2-2025", "Q3-2025", "Q4-2025", "Q1-2026", "Q2-2026", "Q3-2026", "Q4-2026"]
    for q in quarters:
        for dept in DEPARTMENTS:
            allocated = round(random.uniform(500000, 3500000), 2)
            variance_pct = random.uniform(-0.06, 0.04) # -6% to +4%
            actual = round(allocated * (1 + variance_pct), 2)
            budgets.append({
                "budget_id": f"BDG-{q}-{dept['code']}",
                "fiscal_quarter": q,
                "department": dept["name"],
                "cost_center": dept["cost_center"],
                "allocated_budget": allocated,
                "actual_spend": actual,
                "variance_amount": round(allocated - actual, 2),
                "variance_percentage": f"{round(variance_pct * 100, 2)}%",
                "status": "Under Budget" if actual <= allocated else "Over Budget",
                "approved_by": "CFO Office (Audited)"
            })
    return budgets

# ==============================================================================
# Main Seeding Execution
# ==============================================================================

def seed_huge_erp_database():
    client = get_mongo_client()
    db = client[DB_NAME]

    print(f"\n=======================================================")
    print(f"[*] Seeding Enterprise ERP Dataset into '{DB_NAME}'...")
    print(f"=======================================================\n")

    # 1. Master Data: Chart of Accounts
    print("[1/7] Seeding GL Chart of Accounts ('gl_accounts')...")
    gl_col = db["gl_accounts"]
    gl_col.delete_many({}) # Refresh master data
    gl_col.insert_many(GL_ACCOUNTS)
    gl_col.create_index("account_code", unique=True)
    gl_col.create_index("category")
    print(f"      [OK] Seeded {len(GL_ACCOUNTS)} Chart of Accounts.")

    # 2. Master Data: Customers
    print("[2/7] Generating & Seeding Enterprise Customers ('customers')...")
    cust_col = db["customers"]
    cust_col.delete_many({})
    customers = build_customers(count=150)
    cust_col.insert_many(customers)
    cust_col.create_index("customer_id", unique=True)
    cust_col.create_index("industry")
    cust_col.create_index("region")
    print(f"      [OK] Seeded {len(customers)} Enterprise Customers.")

    # 3. Master Data: Vendors
    print("[3/7] Generating & Seeding Vendors ('vendors')...")
    vend_col = db["vendors"]
    vend_col.delete_many({})
    vendors = build_vendors(count=80)
    vend_col.insert_many(vendors)
    vend_col.create_index("vendor_id", unique=True)
    vend_col.create_index("category")
    print(f"      [OK] Seeded {len(vendors)} Corporate Vendors.")

    # 4. Master Data: Employees
    print("[4/7] Generating & Seeding Workforce Records ('employees')...")
    emp_col = db["employees"]
    emp_col.delete_many({})
    employees = build_employees(target_count=428)
    emp_col.insert_many(employees)
    emp_col.create_index("employee_id", unique=True)
    emp_col.create_index("department_code")
    emp_col.create_index("cost_center")
    print(f"      [OK] Seeded {len(employees)} Employees across 10 Departments.")

    # 5. Transactional Data: Sales Invoices (~3,500 records)
    print("[5/7] Generating & Bulk-Inserting Sales Invoices ('sales_invoices')...")
    inv_col = db["sales_invoices"]
    inv_col.delete_many({})
    sales_invoices = build_sales_invoices(customers, count=3500)
    
    # Batch insertion
    batch_size = 1000
    for i in range(0, len(sales_invoices), batch_size):
        inv_col.insert_many(sales_invoices[i:i + batch_size])
    inv_col.create_index("invoice_number", unique=True)
    inv_col.create_index("invoice_date")
    inv_col.create_index("customer_id")
    inv_col.create_index("status")
    inv_col.create_index("fiscal_quarter")
    print(f"      [OK] Seeded {len(sales_invoices)} Sales Invoices.")

    # 6. Transactional Data: General Ledger Journal Entries (~8,000 records)
    print("[6/7] Generating & Bulk-Inserting General Ledger Entries ('general_ledger')...")
    ledger_col = db["general_ledger"]
    ledger_col.delete_many({})
    gl_entries = build_general_ledger_entries(count=8000, customers=customers, vendors=vendors)
    
    for i in range(0, len(gl_entries), batch_size):
        ledger_col.insert_many(gl_entries[i:i + batch_size])
    ledger_col.create_index("journal_entry_id", unique=True)
    ledger_col.create_index("transaction_date")
    ledger_col.create_index("account_code")
    ledger_col.create_index("department")
    ledger_col.create_index("fiscal_quarter")
    print(f"      [OK] Seeded {len(gl_entries)} General Ledger Journal Entries.")

    # 7. Transactional Data: Payroll Ledger (~4,500 records) & Department Budgets
    print("[7/7] Generating & Bulk-Inserting Payroll Runs ('payroll_ledger') & Budgets ('department_budgets')...")
    pay_col = db["payroll_ledger"]
    pay_col.delete_many({})
    payroll_runs = build_payroll_records(employees, count=4500)
    for i in range(0, len(payroll_runs), batch_size):
        pay_col.insert_many(payroll_runs[i:i + batch_size])
    pay_col.create_index("payroll_run_id", unique=True)
    pay_col.create_index("pay_period_end")
    pay_col.create_index("department")
    print(f"      [OK] Seeded {len(payroll_runs)} Payroll Disbursement Records.")

    budget_col = db["department_budgets"]
    budget_col.delete_many({})
    budgets = build_department_budgets()
    budget_col.insert_many(budgets)
    budget_col.create_index("budget_id", unique=True)
    budget_col.create_index("fiscal_quarter")
    print(f"      [OK] Seeded {len(budgets)} Department Quarterly Budgets.")

    # Summary Report
    print(f"\n=======================================================")
    print(f"[OK] ERP DATABASE SEEDING COMPLETED SUCCESSFULLY!")
    print(f"=======================================================")
    total_docs = 0
    all_collections = db.list_collection_names()
    print(f"Current collections and document counts in '{DB_NAME}':")
    for col in sorted(all_collections):
        count = db[col].count_documents({})
        total_docs += count
        print(f"  * {col:25s}: {count:>7,d} document(s)")
    print(f"-------------------------------------------------------")
    print(f"  TOTAL REPOSITORY RECORDS : {total_docs:>7,d} document(s)")
    print(f"=======================================================\n")

    client.close()

if __name__ == "__main__":
    seed_huge_erp_database()

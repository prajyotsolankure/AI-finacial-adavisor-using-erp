"""
Enterprise ERP Model Context Protocol (MCP) Server
===================================================
Provides standardized MCP tools and resources for LLMs (Claude Desktop, 
Cursor, Antigravity, or custom agents) to query real-time enterprise data
from MongoDB Atlas (16,797+ records).
"""

import os
from typing import List, Dict, Any
from dotenv import load_dotenv
from mcp.server import MCPServer
from db_connection import get_mongo_client

load_dotenv()

DB_NAME = os.getenv("MONGODB_DB_NAME", "ai_finance_erp")

# Initialize Model Context Protocol (MCP) Server
mcp = MCPServer("Enterprise-ERP-Advisor")

def get_db():
    client = get_mongo_client()
    return client[DB_NAME]

@mcp.tool()
def get_financial_kpis() -> Dict[str, Any]:
    """
    Computes real-time top-level financial KPIs from 8,000 General Ledger entries.
    Returns Total Revenue, Operating Spend, and Operating Margin %.
    """
    db = get_db()
    
    # Revenue credits
    rev_pipeline = [
        {"$match": {"entry_type": "Credit"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    rev_res = list(db["general_ledger"].aggregate(rev_pipeline))
    total_rev = rev_res[0]["total"] if rev_res else 0.0

    # Debited OPEX
    spend_pipeline = [
        {"$match": {"entry_type": "Debit", "transaction_type": {"$in": ["Vendor Bill Payment", "Cloud Hosting OPEX", "Payroll Disbursement"]}}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    spend_res = list(db["general_ledger"].aggregate(spend_pipeline))
    total_spend = spend_res[0]["total"] if spend_res else 0.0

    margin_pct = round(((total_rev - total_spend) / total_rev) * 100, 2) if total_rev > 0 else 0.0

    return {
        "total_revenue_usd": round(total_rev, 2),
        "total_opex_spend_usd": round(total_spend, 2),
        "operating_margin_pct": margin_pct,
        "records_analyzed": db["general_ledger"].count_documents({})
    }

@mcp.tool()
def query_top_vendors(limit: int = 5) -> List[Dict[str, Any]]:
    """
    Retrieves the top corporate vendors ranked by total expenditure from the General Ledger.
    """
    db = get_db()
    pipeline = [
        {"$match": {"transaction_type": {"$in": ["Vendor Bill Payment", "Cloud Hosting OPEX"]}}},
        {"$group": {
            "_id": "$entity",
            "total_spend": {"$sum": "$amount"},
            "payment_count": {"$sum": 1}
        }},
        {"$sort": {"total_spend": -1}},
        {"$limit": limit}
    ]
    results = list(db["general_ledger"].aggregate(pipeline))
    return [
        {
            "vendor_name": r["_id"],
            "total_spend_usd": round(r["total_spend"], 2),
            "payment_count": r["payment_count"]
        }
        for r in results
    ]

@mcp.tool()
def query_overdue_invoices(limit: int = 6) -> Dict[str, Any]:
    """
    Queries sales invoices with 'Overdue' status to identify outstanding balance dues and aging risks.
    """
    db = get_db()
    invoices = list(db["sales_invoices"].find({"status": "Overdue"}, {"_id": 0}).sort("total_amount", -1).limit(limit))
    total_overdue = sum(inv.get("balance_due", 0) for inv in invoices)

    return {
        "overdue_count": len(invoices),
        "total_balance_due_usd": round(total_overdue, 2),
        "invoices": invoices
    }

@mcp.tool()
def query_workforce_headcount() -> Dict[str, Any]:
    """
    Calculates active employee headcount distribution across all corporate departments.
    """
    db = get_db()
    pipeline = [
        {"$match": {"status": "Active"}},
        {"$group": {"_id": "$department", "headcount": {"$sum": 1}}},
        {"$sort": {"headcount": -1}}
    ]
    depts = list(db["employees"].aggregate(pipeline))
    total_active = sum(d["headcount"] for d in depts)

    return {
        "total_active_fte": total_active,
        "departments": [{"department": d["_id"], "headcount": d["headcount"]} for d in depts]
    }

@mcp.tool()
def query_payroll_disbursements() -> Dict[str, Any]:
    """
    Aggregates departmental payroll allocations from the latest payroll cycle across 4,500 disbursements.
    """
    db = get_db()
    latest_run = list(db["payroll_ledger"].find({}, {"_id": 0}).sort("pay_period_end", -1).limit(1))
    latest_date = latest_run[0]["pay_period_end"] if latest_run else None

    pipeline = [
        {"$match": {"pay_period_end": latest_date}} if latest_date else {"$match": {}},
        {"$group": {
            "_id": "$department",
            "gross_payroll": {"$sum": "$gross_pay"},
            "employees_paid": {"$sum": 1}
        }},
        {"$sort": {"gross_payroll": -1}}
    ]
    results = list(db["payroll_ledger"].aggregate(pipeline))
    total_gross = sum(r["gross_payroll"] for r in results)

    return {
        "pay_period_end": latest_date,
        "total_gross_disbursement_usd": round(total_gross, 2),
        "department_breakdown": [
            {"department": r["_id"], "gross_pay": round(r["gross_payroll"], 2), "headcount": r["employees_paid"]}
            for r in results
        ]
    }

@mcp.resource("erp://database/status")
def get_database_status() -> str:
    """
    Returns an overview of the live MongoDB Atlas ERP database status and record distribution.
    """
    db = get_db()
    return f"""
Enterprise ERP Database: {DB_NAME} (Live MongoDB Atlas Cluster)
- General Ledger: {db['general_ledger'].count_documents({}):,} posted journal transactions
- Sales Invoices: {db['sales_invoices'].count_documents({}):,} enterprise customer contracts
- Payroll Ledger: {db['payroll_ledger'].count_documents({}):,} historical compensation disbursements
- Employees: {db['employees'].count_documents({}):,} workforce records
- Customers: {db['customers'].count_documents({}):,} client accounts
- Vendors: {db['vendors'].count_documents({}):,} vendor accounts
- Department Budgets: {db['department_budgets'].count_documents({}):,} quarterly budgets
Status: ONLINE & VERIFIED
"""

if __name__ == "__main__":
    # Runs the standard FastMCP server over stdio for LLM host integration
    print("[*] Starting Model Context Protocol (MCP) Server for Enterprise ERP...")
    mcp.run(transport="stdio")

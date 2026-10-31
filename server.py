import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from gemini_service import ask_financial_advisor
from db_connection import get_mongo_client
from erp_operations import (
    get_real_finance_context,
    get_real_sales_context,
    get_real_hr_context,
    execute_user_query_operation
)

load_dotenv()

app = Flask(__name__)
# Enable CORS for Vite frontend (http://localhost:5173)
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_NAME = os.getenv("MONGODB_DB_NAME", "ai_finance_erp")

@app.route("/api/health", methods=["GET"])
def health_check():
    """
    Verifies MongoDB connection and API availability.
    """
    mongo_status = "disconnected"
    doc_count = 0
    try:
        client = get_mongo_client()
        db = client[DB_NAME]
        client.admin.command("ping")
        mongo_status = "connected"
        doc_count = db["general_ledger"].count_documents({})
        client.close()
    except Exception as e:
        mongo_status = f"error: {e}"

    gemini_key_present = bool(os.getenv("GEMINI_API_KEY"))

    return jsonify({
        "status": "healthy" if mongo_status == "connected" else "degraded",
        "mongodb": mongo_status,
        "database": DB_NAME,
        "general_ledger_records": doc_count,
        "gemini_api_configured": gemini_key_present,
        "active_model": "gemini-3.5-flash"
    })

@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Answers financial queries using Gemini AI grounded in real-time MongoDB ERP operations.
    """
    data = request.get_json() or {}
    query = data.get("query", "").strip()
    context_id = data.get("context", "finance").lower()

    if not query:
        return jsonify({"error": "Missing 'query' in request payload."}), 400

    try:
        # 1. Execute targeted real-time MongoDB operation based on prompt
        op_result = execute_user_query_operation(query)
        
        # 2. Feed live operation data to Gemini AI
        result = ask_financial_advisor(query, context_id, op_result=op_result)
        
        return jsonify({
            "success": True,
            "reply": result["reply"],
            "insight": result["insight"],
            "model": result.get("model_used", "gemini-3.5-flash"),
            "mcp_operation": {
                "operation": op_result.get("operation"),
                "summary": op_result.get("summary"),
                "records_matched": len(op_result.get("data", [])),
                "data_sample": op_result.get("data", [])[:3]
            }
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route("/api/context/<context_id>", methods=["GET"])
def get_context(context_id):
    """
    Computes real-time ERP domain context metrics & charts from live MongoDB records.
    """
    try:
        cid = context_id.lower()
        if cid == "finance":
            data = get_real_finance_context()
        elif cid == "sales":
            data = get_real_sales_context()
        elif cid == "hr":
            data = get_real_hr_context()
        else:
            data = get_real_finance_context()

        return jsonify({"success": True, "context": data})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    print(f"\n=======================================================")
    print(f"[*] Starting ERP AI Advisor Backend on http://localhost:{port}")
    print(f"    - Connected to MongoDB Database: '{DB_NAME}' (16,797+ records)")
    print(f"    - Real Data Operations: Enabled across GL, Invoices, HR")
    print(f"    - Powered by Google Gemini AI (gemini-3.5-flash)")
    print(f"=======================================================\n")
    app.run(host="127.0.0.1", port=port, debug=False)

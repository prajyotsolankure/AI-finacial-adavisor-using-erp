import os
import sys
import urllib.parse
import certifi
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

# Default URI with placeholder; can be overridden via MONGODB_URI in .env
DEFAULT_URI = "mongodb+srv://prajyotsolankure799_db_user:<db_password>@cluster0.zl0is2d.mongodb.net/?retryWrites=true&w=majority"

def build_connection_uri(uri: str = None, password: str = None) -> str:
    """
    Constructs a valid MongoDB connection string, safely URL-encoding the password
    if provided separately or replacing '<db_password>'.
    """
    conn_uri = uri or os.getenv("MONGODB_URI", DEFAULT_URI)
    db_password = password or os.getenv("MONGODB_PASSWORD", "")

    if "<db_password>" in conn_uri:
        if not db_password:
            # Check if user forgot to replace the placeholder
            raise ValueError(
                "Please replace '<db_password>' with your actual MongoDB Atlas database user password, "
                "or set MONGODB_PASSWORD in a .env file."
            )
        # Safely quote password in case it contains special characters (@, :, /, #, etc.)
        encoded_password = urllib.parse.quote_plus(db_password)
        conn_uri = conn_uri.replace("<db_password>", encoded_password)

    return conn_uri

_shared_client = None

def get_mongo_client(uri: str = None, password: str = None) -> MongoClient:
    """
    Creates and returns a cached, connection-pooled MongoClient instance.
    """
    global _shared_client
    if _shared_client is not None:
        try:
            _shared_client.admin.command("ping")
            return _shared_client
        except Exception:
            _shared_client = None

    connection_string = build_connection_uri(uri, password)
    _shared_client = MongoClient(
        connection_string,
        tlsCAFile=certifi.where(),
        server_api=ServerApi('1'),
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=15000,
        maxPoolSize=20,
        minPoolSize=1
    )
    return _shared_client

def test_connection(uri: str = None, password: str = None) -> bool:
    """
    Tests MongoDB connection by pinging the admin database.
    """
    print("[*] Connecting to MongoDB Atlas cluster...")
    client = None
    try:
        client = get_mongo_client(uri, password)
        # Ping the admin database to verify connection
        client.admin.command("ping")
        print("Connected successfully to MongoDB Atlas!")
        return True
    except Exception as e:
        print(f"\n[!] Connection Error: {e}")
        print("\nCommon fixes:")
        print("1. Password: Make sure your password in the URI or .env is correct.")
        print("2. IP Whitelist: In MongoDB Atlas -> Network Access, ensure your current IP (or 0.0.0.0/0) is allowed.")
        print("3. Special Characters: If your password has symbols like '@', '#', '%', quote them or use MONGODB_PASSWORD in .env.")
        return False
    finally:
        if client:
            client.close()

if __name__ == "__main__":
    # If password is provided as command-line argument: python db_connection.py <your_password>
    arg_password = sys.argv[1] if len(sys.argv) > 1 else None
    test_connection(password=arg_password)

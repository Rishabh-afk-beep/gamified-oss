from fastapi.encoders import JSONEncoder
from bson import ObjectId
from datetime import datetime
import json

class MongoJSONEncoder(JSONEncoder):
    """Custom JSON encoder for MongoDB ObjectId and datetime"""
    
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)

def convert_objectid(data):
    """Convert ObjectId to string in dict/list"""
    if isinstance(data, dict):
        return {key: convert_objectid(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_objectid(item) for item in data]
    elif isinstance(data, ObjectId):
        return str(data)
    elif isinstance(data, datetime):
        return data.isoformat()
    return data

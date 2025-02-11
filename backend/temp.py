import motor.motor_asyncio 
from datetime import datetime


client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client["test_database"]
collection = db["test_collection"]

async def do_insert():
    document = {"key": "value"}
    result = await db.test_collection.insert_one(document)
    print("result %s" % repr(result.inserted_id))

loop=client.get_io_loop() 
loop.run_until_complete(do_insert())

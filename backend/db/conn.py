import motor.motor_asyncio 
from datetime import datetime


client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client["db30"]
print(db.list_collection_names())
collection = db["users"]

async def do_insert():
    document = {
   "email" : "v@gmail.com",
   "password":"vishu"
  }
    print(await db.list_collection_names())
 
    result = await collection.insert_one(document)
    print("result %s" % repr(result.inserted_id))



loop=client.get_io_loop() 
loop.run_until_complete(do_insert())

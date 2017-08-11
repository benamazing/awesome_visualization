# encoding=utf-8

import pymongo
import os
import json

with open(os.path.dirname(__file__) + '/conf.json') as f:
    conf_str = f.read()
    conf_obj = json.loads(conf_str)
    host = conf_obj.get('mongo_host', 'localhost')

mongo_client = pymongo.MongoClient(host=host)
print(host)

def get_balance(start, end):
    results = []
    db = mongo_client['stock']
    collection = db['account_balance']
    records = collection.find({'date': {'$lte': end, '$gte': start}}).sort('date', 1)
    if records.count() > 0:
        results = [{'date': r['date'], 'assets': float(r['total_assets'])} for r in records]
    return json.dumps(results)


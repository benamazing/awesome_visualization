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

def get_rate_of_return(start, end):
    results = {}
    db = mongo_client['stock']
    balance_c = db['account_balance']
    stock_index_c = db['stock_index']
    records1 = balance_c.find({'date': {'$lte': end, '$gte': start}}).sort('date', 1)
    records2 = stock_index_c.find({'date': {'$lte': end, '$gte': start}}).sort('date', 1)
    asset_rates = []
    index_rates = []
    if records1.count() > 0:
        results1 = [{'date': r['date'], 'assets': float(r['total_assets'])} for r in records1]
        base_1 = results1[0]
        asset_rates = [{'date': r['date'], 'rate': float(r['assets'] / base_1)} for r in results1]
    if records2.count() > 0:
        results2 = [{'date': r['date'], 'index': float(r['close'])} for r in records2]
        base_2 = results2[0]
        index_rates = [{'date': r['date'], 'rate': float(r['index'] / base_2)} for r in results2]
    results['asset_rates'] = asset_rates
    results['index_rates'] = index_rates
    return json.dumps(results)



# encoding=utf-8

import pymongo
import os
import json

with open(os.path.dirname(__file__) + '/conf.json') as f:
    conf_str = f.read()
    conf_obj = json.loads(conf_str)
    host = conf_obj.get('mongo_host', 'localhost')

mongo_client = pymongo.MongoClient(host=host)

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
    holidays = db['stock_holidays'].find().sort("date", 1)
    holidays_set = set()
    for r in holidays:
        holidays_set.add(r['date'])

    records1 = balance_c.find({'date': {'$lte': end, '$gte': start}}).sort('date', 1)
    records2 = stock_index_c.find({'date': {'$lte': end, '$gte': start}}).sort('date', 1)
    asset_rates = []
    index_rates = []
    results1 = [{'date': r['date'], 'assets': float(r['total_assets'])} for r in records1 if r['date'] not in holidays_set]
    if len(results1) > 0:
        base_1 = results1[0]['assets']
        asset_rates = [{'date': r['date'], 'rate': float(r['assets'] / base_1)} for r in results1]
    results2 = [{'date': r['date'], 'index': float(r['close'])} for r in records2 if r['date'] not in holidays_set]
    if len(results2) > 0:
        base_2 = results2[0]['index']
        index_rates = [{'date': r['date'], 'rate': float(r['index'] / base_2)} for r in results2]
    results['asset_rates'] = asset_rates
    results['index_rates'] = index_rates
    return json.dumps(results)

def get_stock_profits(start, end, code):
    results = []
    db = mongo_client['stock']
    hold_stocks_c = db['hold_stocks']
    holidays = db['stock_holidays'].find().sort("date", 1)
    holidays_set = set()
    for r in holidays:
        holidays_set.add(r['date'])
    records = hold_stocks_c.find({'date': {'$lte': end, '$gte': start}}).sort('date', 1)
    for r in records:
        if r['date'] not in holidays_set:
            hold_stocks = r['list']
            for stock in hold_stocks:
                if str(stock['stock_code']) == code:
                    s = {}
                    s['date'] = str(r['date'])
                    s['stock_code'] = code
                    s['profit'] = float(stock['profit'])
                    s['amount'] = round(float(stock['current_amount']), 0)
                    results.append(s)
    return json.dumps(results)

def get_stock_list_by_code(partial_code):
    db = mongo_client['stock']
    stocks_c = db['stock_general_info']
    records = stocks_c.find({'code': {'$regex': '^' + partial_code + '.*'}}, {'code': 1, '_id': 0, 'name': 1}).sort('code', 1)
    results = [{'label': '{0} - {1}'.format(str(r['code']), r['name'].encode('utf-8')), 'value': str(r['code']), 'id': str(r['code'])} for r in records]
    return json.dumps(results)

def get_current_hold_stocks():
    results = []
    db = mongo_client['stock']
    hold_stocks_c = db['hold_stocks']
    enable_balance = float(0)
    balance_c = db['account_balance']
    summary = balance_c.find().sort('date', -1)
    if summary.count() > 0:
        enable_balance = float(summary[0]['enable_balance'])
    records = hold_stocks_c.find().sort('date', -1)
    if records.count() > 0:
        r = records[0]
        hold_stocks = r['list']
        results = [{"stock_code": str(r['stock_code']), "stock_name": r['stock_name'].encode('utf-8'), "amount": round(float(r['current_amount']), 0),
                   "market_value": float(r['current_amount']) * float(r["av_buy_price"]), "profit": float(r['profit'])} for r in hold_stocks]
        # append available asset
        results.append({"stock_code": "available", "stock_name": "可用", "market_value": enable_balance})
        results = sorted(results, key=lambda x: x['market_value'], reverse=True)
    return json.dumps(results)


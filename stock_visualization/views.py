#encoding=utf-8

from . import app
from flask import render_template
from flask import request
import datetime
from . import mongo_service

TIME_FORMAT = '%Y-%m-%d'

# @app.route('/')
# def hello():
#     return render_template('index.html')

@app.route('/assets.json')
def get_balance_json():
    now = datetime.datetime.now()
    stime = now - datetime.timedelta(days=30)
    start_dt = str(request.args.get('start', stime.strftime(TIME_FORMAT)))
    end_dt = str(request.args.get('end', now.strftime(TIME_FORMAT)))
    rtn = mongo_service.get_balance(start_dt, end_dt)
    return rtn

@app.route('/')
@app.route('/assets')
def show_balance():
    return render_template('assets.html')

@app.route('/rates.json')
def get_rate_of_return():
    now = datetime.datetime.now()
    stime = now - datetime.timedelta(days=30)
    start_dt = str(request.args.get('start', stime.strftime(TIME_FORMAT)))
    end_dt = str(request.args.get('end', now.strftime(TIME_FORMAT)))
    rtn = mongo_service.get_rate_of_return(start_dt, end_dt)
    return rtn

@app.route('/stock_profits.json')
def get_stock_profits():
    now = datetime.datetime.now()
    stime = now - datetime.timedelta(days=30)
    start_dt = str(request.args.get('start', stime.strftime(TIME_FORMAT)))
    end_dt = str(request.args.get('end', now.strftime(TIME_FORMAT)))
    code = str(request.args.get('stock_code', now.strftime(TIME_FORMAT)))
    rtn = mongo_service.get_stock_profits(start_dt, end_dt, code)
    return rtn

@app.route('/stock_profits')
def show_stock_profit_trend():
    return render_template('stock_profits.html')
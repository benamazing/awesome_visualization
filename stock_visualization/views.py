#encoding=utf-8

from . import app
from flask import render_template
from flask import request
from flask import url_for, redirect
from flask import session
from flask import flash
from flask import abort
import datetime
from . import mongo_service

TIME_FORMAT = '%Y-%m-%d'

@app.route('/')
def index():
    return redirect('/login')


@app.route('/login', methods =['GET', 'POST'])
def login():
    error = None
    if request.method =='POST':
        result = mongo_service.validate_user(str(request.form['account']), str(request.form['password']))
        if not result:
            error = 'Invalid user/password!'
        else:
            session['logged_in'] = True
            flash('You were successfully logged in!')
            return redirect('/overview')
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    flash('You were logged out')
    return redirect('/login')

@app.route('/main')
def show_main():
    if not session.get('logged_in'):
        abort(401)
    return render_template('account_view.html')

@app.route('/overview')
def show_overview():
    if not session.get('logged_in'):
        abort(401)
    return render_template('overview.html')


@app.route('/assets_trend')
def show_assets_trend():
    if not session.get('logged_in'):
        abort(401)
    return render_template('assets_trend.html')

@app.route('/stock_profit_trend')
def show_stock_profit_trend():
    if not session.get('logged_in'):
        abort(401)
    return render_template('stock_profit_trend.html')


@app.route('/assets.json')
def get_balance_json():
    now = datetime.datetime.now()
    stime = now - datetime.timedelta(days=30)
    start_dt = str(request.args.get('start', stime.strftime(TIME_FORMAT)))
    end_dt = str(request.args.get('end', now.strftime(TIME_FORMAT)))
    rtn = mongo_service.get_balance(start_dt, end_dt)
    return rtn

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
    code = str(request.args.get('stock_code', '000001'))
    rtn = mongo_service.get_stock_profits(start_dt, end_dt, code)
    return rtn

@app.route('/stock_profits')
def show_stock_profits():
    if not session.get('logged_in'):
        abort(401)
        return redirect('/login')
    return render_template('stock_profits.html')

@app.route('/mobile')
def show_mobile():
    return render_template("mobile/test.html")

@app.route('/stock_list.json')
def query_stock_by_code():
    q = str(request.args.get('term', 'N/A'))
    if q != 'N/A':
        rtn = mongo_service.get_stock_list_by_code(q)
        return rtn

@app.route('/current_hold_stocks.json')
def get_current_hold_stocks():
    rtn = mongo_service.get_current_hold_stocks()
    return rtn


@app.route('/mobile/hold_stocks')
def show_hold_stocks_for_mobile():
    return render_template('mobile/hold_stocks.html')

@app.route('/test')
def show_test():
    return render_template('test.html')


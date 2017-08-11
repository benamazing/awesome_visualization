# encoding=utf-8

#import os
#os.chdir(os.path.dirname(__file__))

from flask import Flask

TIME_FORMAT = '%Y-%m-%d'
app = Flask(__name__)

from . import views

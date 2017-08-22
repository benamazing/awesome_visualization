# encoding=utf-8

def consumer():
    r = ''
    while True:
        f = yield r
        if not f:
            return
        print('[CONSUNER] Consuming %s...' % f)
        r = '200 OK'

def produce(c):
    c.send(None)
    n = 0
    while n < 5:
        n = n + 1
        print('[PRODUCER] Producing %s...' % n)
        r = c.send(n)
        print('[PRODUCER] Consumer return: %s' % r)
    c.close()

c = consumer()
produce(c)

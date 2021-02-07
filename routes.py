from flask import Flask, render_template, request
import redis
import json
from prettyprinter import pprint

app = Flask(__name__)

# two decorators, same function
@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html', the_title='Monty Hall Simulation')

@app.route('/api/getLeaderboard', methods=['GET'])
def getLeaderboard():
    results = []
    for result in r.hscan_iter("leaderboard", match='*'):
        results.append(result)
    print("Results:",results)
    results = dict(results)
    sortedResults = dict(sorted(results.items(), key=lambda x:float(x[1][:-1]), reverse=True))
    return json.dumps(sortedResults)

@app.route('/api/updateLeaderboard', methods=['POST'])
def updateLeaderboard():
    key = request.form.get("name")
    val = request.form.get("score")
    print(key, val)
    r.hmset("leaderboard",{key:val})
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

if __name__ == '__main__':
    # we can run docker with redis (there's only a fork on Win) and specify ports
    # $docker run -p 55000:6379 redis
    # the check with $docker ps
    r = redis.Redis(port=55000, decode_responses=True)
    # r.flushdb()
    # r.mset({"Maciej":"66%"})
    # r.hmset("leaderboard",{"Bartek":"70%"})
    # r.hmset("leaderboard",{"Maciek":"80%"})
    # print(r.get("Maciej"))
    # pprint(r.keys())
    for result in r.hscan_iter("leaderboard", match='*'):
        print(result)
    app.run(debug=True)

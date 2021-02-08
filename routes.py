from flask import Flask, render_template, request
import redis
import json
import os
from dotenv import load_dotenv
load_dotenv()

# 1st option) we can run docker with redis (there's only a fork on Windows) and specify ports
# $docker run -p 55000:6379 redis
# then check if redis running with $docker ps
# r = redis.Redis(port=55000, decode_responses=True)
# 2nd option) hosting
username = os.environ.get('USER_REDIS')
password = os.environ.get('PASSWORD_REDIS')
r = redis.Redis(host="redis-17386.c89.us-east-1-3.ec2.cloud.redislabs.com", port=17386, username=username,
                password=password, decode_responses=True)

app = Flask(__name__)

# two decorators, same function
@app.route('/')
@app.route('/index.html')
def index():
    return render_template('index.html', the_title='Monty Hall Simulation')

@app.route('/api/getLeaderboard', methods=['GET'])
def getLeaderboard():
    results = []
    for result in r.keys('*'):
        results.append(r.hgetall(result))
    print("Results:",results)
    sortedResults = sorted(results, key=lambda x:float(x["score"][:-1]), reverse=True)
    return json.dumps(sortedResults)

@app.route('/api/updateLeaderboard', methods=['POST'])
def updateLeaderboard():
    name = request.form.get("name")
    score = request.form.get("score")
    games = request.form.get("games")
    print(name, score, games)
    r.hmset("Leaderboard:"+name,{"name":name, "score":score, "games":games})
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}

if __name__ == '__main__':
    # DEBUGGING
    # r.flushdb()
    # r.mset({"Maciej":"66%"})
    # r.hmset("leaderboard",{"Bartek":"70%"})
    # r.hmset("leaderboard",{"Maciek":"80%"})
    # print(r.get("Maciej"))
    # pprint(r.keys())
    # for result in r.hscan_iter("leaderboard", match='*'):
    #     print(result)
    app.run(debug=True)

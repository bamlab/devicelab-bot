import json
import urllib2
import urllib
import os
from threading import Timer

def call(url, queryParams = {}):
  url = os.environ.get('devicelab_bot_base_url') + url + '?' + urllib.urlencode(queryParams)
  return urllib2.urlopen(url)

def callInstallApp(appName):
  return call('/install', {
    'appName': appName,
  }).read()

def callGetLogs(buildId):
  response = call('/build/' + buildId)
  return json.load(response)

class AppInstaller:
  def __init__(self, appName):
    self.buildId = callInstallApp(appName)
    self.logsCount = 0

  def checkLogs(self):
    logs = callGetLogs(self.buildId)
    for i in range(self.logsCount, len(logs)):
      print logs[i]
      if logs[i] == 'Done': return
    self.logsCount = len(logs)
    Timer(1.0, self.checkLogs).start()

  def install(self):
    Timer(1.0, self.checkLogs).start()

AppInstaller(os.environ.get('app_name')).install()

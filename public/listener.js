// override and listen
var activeRequest = {};
var requestList = [];
var oldOpen = XMLHttpRequest.prototype.open;

function recordRequests () {
  XMLHttpRequest.prototype.open = function (method, url, isAsync) {
    activeRequest = {};
    activeRequest.method = method;
    activeRequest.url = url;
  	oldOpen.apply(this, [method, url, isAsync]);
  }

  XMLHttpRequest.prototype.oldSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function (data) {
    activeRequest.queryParameters = [];
    activeRequest.jsonParameters = [];
    this.oldSend(data);
    if (data) {
      // post request
      data = JSON.parse(data);
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          activeRequest.jsonParameters.push({
            key: key,
            value: data[key]
          })
        }
      }
    } else {
      // get request
      activeRequest.url = this.responseURL.split('?')[0]
      var queryString = this.responseURL.split('?')[1]
      if (queryString) {
        queryString.split('&').forEach(function (part) {
          var split = part.split('=');
          var key = split[0];
          var value = split[1];
          activeRequest.queryParameters.push({
            key: key,
            value: decodeURI(value)
          })
        });
      }
    }
  }

  var oldEventListener = XMLHttpRequest.prototype.addEventListener;
  XMLHttpRequest.prototype.addEventListener = function (eventName, callback) {
  	if (eventName === "load") {
      var newCallback = function () {
      	activeRequest.response = JSON.parse(this.responseText);
        requestList.push(activeRequest);

        // Send the original callback so we don't break anything
        callback.apply({ responseText: this.responseText, status: this.status });
      }
    	oldEventListener.apply(this, [eventName, newCallback])
    }
  }
}
recordRequests()

function areObjectsEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2)
}

function findVulnerabilities () {
  console.log(requestList);

  requestList.forEach(function (req) {
    if (req.queryParameters.length > 0) {
      console.log(req);
      var newUrl = req.url + '?' + req.queryParameters.map(function (p) {
        return p.key + '=' + p.value + "' and '1' == '";
      }).join('&');
      var newReq = new XMLHttpRequest();
      newReq.addEventListener("load", function (){
        var hasRequestChanged = false;
        if (this.status === 200) {
          var result = JSON.parse(this.responseText);
          var hasRequestChanged = !areObjectsEqual(req.response, result);
        } else {
          hasRequestChanged = true;
        }
        if (hasRequestChanged) {
          console.log(req.method + ' ' + req.url + ' is potentially vulnerable')
        }
      });
      newReq.open(req.method, newUrl, false);
      newReq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      newReq.send()
    }
  });

  requestList = [];
}

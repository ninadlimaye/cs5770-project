function submitForm () {
  var name = document.getElementById('name');
  var year = document.getElementById('year');
  var major = document.getElementById('major');

  if (name.value && year.value && major.value) {
    var request = new XMLHttpRequest();
    request.addEventListener("load", function (){
      var result = JSON.parse(this.responseText);
      console.log('POST /users', result);
    });
    request.open("POST", "/users", false);
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.send(JSON.stringify({
      name: name.value,
      year: year.value,
      major: major.value
    }))

    name.value = '';
    year.value = '';
    major.value = '';
  }

  return false;
}

function getMoreData (userName) {
  console.log('get more data ', userName)

  var request = new XMLHttpRequest();
  request.addEventListener("load", function (){
    var user = JSON.parse(this.responseText);
    console.log(user)
  });
  request.open("GET", "/user?name=" + userName, false);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send("")
}



window.onload = function (){
  var request = new XMLHttpRequest();
  request.addEventListener("load", function (){
    var result = JSON.parse(this.responseText);
    var usersList = document.getElementById('users-list');
    result.forEach(function(user) {
      var li = document.createElement('li');
      var link = document.createElement('a');
      link.href = '#';
      link.addEventListener('click', function (){
        getMoreData(user.name)
      })
      li.appendChild(link)
      link.appendChild(document.createTextNode(user.name))
      usersList.appendChild(li)
    });
    console.log('GET /users', result)
  });
  request.open("GET", "/users", false);
  request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  request.send()

}

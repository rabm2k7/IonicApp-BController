angular.module('starter.controllers', [])


.controller('HomeCtrl', function($scope, $ionicPopup, $state) {

        if (typeof(Storage) !== "undefined") {
          if (localStorage.getItem("user-credentials")) {

            return $scope.credentials = JSON.parse(localStorage.getItem("user-credentials"));
            $state.go('tab.account');
          } else {
            $state.go('tab.dash');
          }
        } else {
          //display alert popup - no storage
          var alertPopup = $ionicPopup.alert({
            title: 'Local Storage Unavailable, App Cannot Run!',
            template: 'Please check your system permissions!'
          });
        }


})

.controller('DashCtrl', function($scope, LoginService, $ionicPopup, $state) {
  $scope.data = {};

  $scope.login = function() {

    LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {

      if (typeof(Storage) !== "undefined") {
        if (localStorage.getItem("user-credentials")) {

          var credentials = JSON.parse(localStorage.getItem("user-credentials"));

          $state.go('tab.account');

        } else {

          var credentials = {
            uname: $scope.data.username,
            passw: $scope.data.password
          };

          localStorage.setItem("user-credentials", JSON.stringify(credentials));
          $state.go('tab.account');

        }
      } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
      }

    }).error(function(data) {
      //display alertpop
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
      $state.go('tab.dash');
      setTimeout(function(){   location.reload(); }, 2000);

    });
  }
})

.controller('AccountCtrl', function($scope, $http, $ionicPopup, $state) {

  if (typeof(Storage) !== "undefined") {

    console.log(typeof(Storage) !== "undefined");

    var usercredentials = localStorage.getItem("user-credentials");
    console.log(usercredentials === null);
    if (usercredentials === null) {

      var alertPopup = $ionicPopup.alert({
        title: 'User must be logged in!',
        template: 'Please check your credentials!'
      });
      $state.go('tab.dash');
      setTimeout(function(){   location.reload(); }, 2000);

    }else{

      var settingslist = localStorage.getItem("settingsList");
      if (!settingslist) {

            $scope.settingsList = [{
              text: "Private Data Energy",
              checked: false
            }, {
              text: "Private Data Energy",
              checked: false
            }, {
              text: "Private Data Energy",
              checked: false
            }];

            localStorage.setItem("settingsList", JSON.stringify($scope.settingsList));

    } else {
      $scope.settingsList = JSON.parse(localStorage.getItem("settingsList"));
    }
  }
  } else {
    document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
  }


  $scope.pushNotificationChange = function() {

      var usercredentials = localStorage.getItem("user-credentials");
      var usersettings = $scope.settingsList;

      var data = {
        credentials: usercredentials,
        settings: JSON.stringify(usersettings)
      };

      var dataObj = data;

      localStorage.setItem("settingsList", JSON.stringify(usersettings));

      var res = $http.post('http://192.162.152.128:4002/api/customer', dataObj);

      res.success(function(data, status, headers, config) {
        console.log("Success Message: " + status);
      });

      res.error(function(data, status, headers, config) {
        alert("Failure message: " + JSON.stringify({
          data: data
        }));
      })
  };
});

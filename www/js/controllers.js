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
        var alertPopup = $ionicPopup.alert({
          title: 'Browser Stoarge Problem!',
          template: 'Please check your storage settings!'
        });
      }

    }).error(function(data) {
      //display alertpop
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
      $state.go('tab.dash');
      setTimeout(function() {
        location.reload();
      }, 2000);

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

          setTimeout(function() {
            location.reload();
          }, 2000);

        } else {

          var settingslist = localStorage.getItem("settingsList");
          if (!settingslist) {

            $scope.settingsList = [{
              text: "Collect Smart Meter Data",
              checked: false
            }, {
              text: "Source On my consumption profile",
              checked: false
            }, {
              text: "Share with trusted 3rd party",
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


        var req = {
          url: 'https://192.168.152.128/api/customers',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            "EAN": 3456767558234,
            "customerCert": "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUNRekNDQWVpZ0F3SUJBZ0lSQVA4ais0OWtXME4xbHE5OVZFMGZ3S1V3Q2dZSUtvWkl6ajBFQXdNd01URUwKTUFrR0ExVUVCaE1DVlZNeEZEQVNCZ05WQkFvVEMwaDVjR1Z5YkdWa1oyVnlNUXd3Q2dZRFZRUURFd04wWTJFdwpIaGNOTVRZeE1EQXhNRGN5T0RBMFdoY05NVFl4TWpNd01EY3lPREEwV2pCRk1Rc3dDUVlEVlFRR0V3SlZVekVVCk1CSUdBMVVFQ2hNTFNIbHdaWEpzWldSblpYSXhJREFlQmdOVkJBTVRGMVJ5WVc1ellXTjBhVzl1SUVObGNuUnAKWm1sallYUmxNRmt3RXdZSEtvWkl6ajBDQVFZSUtvWkl6ajBEQVFjRFFnQUVzT3pIWjlpQ1p5b2xaMkxOWmFlNwpmN2ptU214TXNvMkVlNnM5ZVNNKzZFSGhIMUxpY3RDM2VuUHljeVV0Ty9SUXFtcHJOdWM1UHVXbkxudmF0VXppCnBxT0J6RENCeVRBT0JnTlZIUThCQWY4RUJBTUNCNEF3REFZRFZSMFRBUUgvQkFJd0FEQU5CZ05WSFE0RUJnUUUKQVFJREJEQVBCZ05WSFNNRUNEQUdnQVFCQWdNRU1FMEdCaW9EQkFVR0J3RUIvd1JBQzR3aTkzTkRDZzJYMXhVSQpmNFNvaGRmMm9YeDRwazhQTlF1UDlSbGZFNEhXakRFSHdHZW5DRFFFdnRDLytYSFpxZXVTS2R6dlV2VXFUZUkxCldiSmQ4ekE2QmdZcUF3UUZCZ2dFTUtVS0ZDakdaTW9MUkNoRm5KajJRd2xvRkNQTFljQi9FUEU5SUpDT3FKejgKUmhZeE9uQnc3a3lPbnNnMUN4THFZVEFLQmdncWhrak9QUVFEQXdOSkFEQkdBaUVBZ3BUUjJDeE5jaEpxK2p3YQpZTXE2MmU2bzN3NnpBQXIxSDI4V0x5Sk1BK01DSVFDTWUwQnV4UXFzcUc0VTl1bkkvMnN4WXdQYkdHRWNIYkFQClF1TU4yNWpLQ0E9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==",
            "customerId": "1",
            "customerUName": "jim",
            "gridOperator": "Stedin NB",
            "mandate": [{
              "op1": usersettings[0].checked,
              "startDate": "10/02/2016",
              "endDate": "12/31/9999"
            }, {
              "op2": usersettings[1].checked,
              "startDate": "",
              "endDate": "12/31/9999"
            }, {
              "op3": usersettings[2].checked,
              "startDate": "10/2/2016",
              "endDate": "12/31/9999"
            }],
            "supplier": "Nuon"
          }
        }
        console.log(req);

        var res = $http.post(req.url, req);

        res.success(function(data, status, headers, config) {
          console.log("Success Message: " + status);
        });

        res.error(function(data, status, headers, config) {
          alert("Failure message: " + JSON.stringify({
            data: data
          }));
          console.log("Error Message: " + status + data);
        });

        //update blockahin length
        var req2 = {
          url: "http://17ad5f43.ngrok.io/chain",
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }

        var get2 = $http.get(req2.url, req2);

        get2.success(function(data, status, headers, config) {
          console.log("Success Message: " + JSON.stringify(data) + status);
          var currentblock = data.height;
          console.log(currentblock);

          var alertPopup = $ionicPopup.alert({
            title: 'Current Block Number',
            template: 'The current block # is:' + currentblock
          });


        });

        get2.error(function(data, status, headers, config) {
          alert("Failure message: " + JSON.stringify({
            data: data
          }));
          console.log("Error Message: " + status + data);
        });

      };
});

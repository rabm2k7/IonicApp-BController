angular.module('starter.services', [])

.service('LoginService', function($q) {
    return {
        loginUser: function(uname, passw) {
            var deferred = $q.defer();
            var promise = deferred.promise;

            if (uname == 'jim' && passw == 'secret') {
                deferred.resolve('Welcome ' + name + '!');
            } else {
                deferred.reject('Wrong credentials.');
            }
            promise.success = function(fn) {
                promise.then(fn);
                return promise;
            }
            promise.error = function(fn) {
                promise.then(null, fn);
                return promise;
            }
            return promise;
        }
    }
})

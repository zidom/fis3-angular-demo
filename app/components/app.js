'use strict';
var app = angular.module('app', []);
app.controller('AppCtrl', function ($scope) {
    $scope.user = {};
})
    .directive('ghHeader', ['$log', function ($log) {
        return {
            restrict: 'A',
            compile: function (ele) {
                $log.info(ele);
            }
        };
    }]);


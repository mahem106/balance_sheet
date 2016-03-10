'use strict';

$(document).ready(function() {
   $('select').material_select();
 });

 var snap = angular.module('snuffles', []);

   snap.controller('mainCtrl', function($scope, $http) {

     function getTrans() {
       $http({
         method: 'GET',
         url: '/trans'
       })
       .then(function(res) {
         $scope.trans = res.data;
       }, function(err) {
         console.error('error: ', err);
       })
     }

   getTrans();

   function getTotal() {
     $http({
       method: 'GET',
       url: '/total'
     })
     .then(function(res) {
       $scope.total = res.data.total;
     }, function(err) {
       console.error('error: ', err);
     })
   }
   getTotal();

     $scope.addTrans = function() {
      if($scope.newTrans.type === 'none') {
        alert("Please select transaction type.");
      } else if($scope.newTrans.type === 'deposit'){
        $scope.newTrans.type = 'Deposit'
        $scope.newTrans.amount = ($scope.newTrans.amount).toFixed(2);

        $scope.total = (parseFloat($scope.total) + parseFloat($scope.newTrans.amount));
        postTrans($scope.newTrans, JSON.stringify({total: $scope.total}));
        $scope.trans.push($scope.newTrans);
        $scope.newTrans = {};
      } else if ($scope.newTrans.type === 'withdraw') {
        $scope.newTrans.type = 'Withdrawal'
        $scope.newTrans.amount = ($scope.newTrans.amount).toFixed(2);

        $scope.total = (parseFloat($scope.total) - parseFloat($scope.newTrans.amount));
        console.log($scope.total);
        postTrans($scope.newTrans, JSON.stringify({total: $scope.total}));
        $scope.trans.push($scope.newTrans);
        $scope.newTrans = {};
     }
     };

     $scope.delTrans = function(trans) {
       var delIndex = this.transaction.id;
       $http({
         method: 'DELETE',
         url: `/trans/${delIndex}`,
       });
        var tran = $scope.trans.find(function(obj) {
          return obj.id === delIndex;
        });
        console.log(tran);
        $scope.total = (parseFloat($scope.total) - parseFloat(tran.amount));
        $scope.trans.splice(tran, 1);
     }

     function postTrans(data, total) {
       $http.post("/trans", data).success(function(data, status) {
       })
       $http.post("/total", total).success(function(total, status) {
       })
     };


 });

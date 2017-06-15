
 angular.module('App').controller("mainCtrl",['$scope','Answer',function($scope,Answer){
  Answer.updateAll({
    'id': 1
  },{
    'answer': 'This is my new answer !!!'
  },function(data){

  });
}]);

angular.module('favorsApp.controllers', ['favorsApp.services','ionic'])


favorsApp.controller('LoginController',function($scope,$state,UserAuth){

   $scope.userObject = {}


  $scope.login = function(){

    UserAuth.login($scope.userObject).then(function(user){

      $state.transitionTo('app.favors')

    },function(err){

     if(err.code == 'INVALID_EMAIL'){
      // try err.description for human friendly text

     }

     if(err.code == 'INVALID_USER'){
      $scope.userObject.unregistered = true
    }

  })
  }


  $scope.register = function(){
    UserAuth.register($scope.userObject).then(function(user){

      $state.transitionTo('app.favors')
    })

  }

})
// end user registration / login 



favorsApp.controller('FavorNewController',function($scope,$state,FavorStore){

   FavorStore.then(function(store){
    $scope.favors = store;
    console.log($scope.favors)
  })

   $scope.newFavor = {}

   $scope.saveNewFavor = function(){

    $scope.newFavor.date = new Date()

    $scope.favors.$add($scope.newFavor)

    $state.transitionTo('app.favors')

   }

})

// End CRUD   

favorsApp.controller('FavorListController',function($scope,$state,FavorStore){

  FavorStore.then(function(userRef){
    $scope.favors = userRef;
    $scope.navigateTo = function($index, favor){

      $state.transitionTo('app.favordetail', {favorId:$index})
    } 
  })
// promise is a placeholder that a value will be returned later
})


favorsApp.controller('FavorDetailController',function($scope, $state, FavorStore){
  console.log($state.params)
  FavorStore.then(function(userRef){
    //$scope.favor = userRef.$get(parseInt($state.params.favorId))
    $scope.favors = userRef
    $scope.favor = $scope.favors.$child($state.params.favorId)

  })

})

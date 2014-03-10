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



favorsApp.controller('FavorNewController',function($scope,$state,$timeout,FavorStore){

   FavorStore.then(function(store){
    $scope.favors = store;
    console.log($scope.favors);
       $scope.contacts = [];

       var options = new ContactFindOptions();
       //options.filter="";
       options.multiple=true;
       var fields = ["*"];
       navigator.contacts.find(fields, $scope.onSuccess, $scope.onError, options);
  });

    $scope.onSuccess = function(contacts){
        console.log(contacts);
        $timeout(function() {
            $scope.$apply(function() {
                $scope.contacts = contacts;
                console.log($scope.contacts);
            });
        });
    }

    $scope.onError = function(){
        alert("Get contacts error");
    }

   $scope.newFavor = {}

   $scope.saveNewFavor = function(){

    // $scope.newFavor.date = new Date()

    $scope.favors.$add($scope.newFavor)

    $state.transitionTo('app.favors')

   }

    $scope.updateSelection =function($event, id){
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        console.log($event.target.id);
        if($event.target.id == "rating5" && checkbox.checked){
            $scope.newFavor.rating = 5;
        }
        else if($event.target.id == "rating4" && checkbox.checked){
            $scope.newFavor.rating = 4;
        }
        else if($event.target.id == "rating3" && checkbox.checked){
            $scope.newFavor.rating = 3;
        }
        else if($event.target.id == "rating2" && checkbox.checked){
            $scope.newFavor.rating = 2;
        }
        else if($event.target.id == "rating1" && checkbox.checked){
            $scope.newFavor.rating = 1;
        }
    }
})


favorsApp.controller('FavorEditController',function($scope,$state,$timeout,FavorStore){

  // FavorStore.then(function(userRef){
  //   //$scope.favor = userRef.$get(parseInt($state.params.favorId))
  //   $scope.favors = userRef
  //   $scope.favor = $scope.favors.$child($state.params.favorId)

  // })

   // $scope.newFavor = {}
    FavorStore.then(function(userRef){
        //$scope.favor = userRef.$get(parseInt($state.params.favorId))
        $timeout(function() {
            $scope.$apply(function() {
                $scope.favors = userRef;
                console.log($scope.favors);
                $scope.favorFB = $scope.favors.$child($state.params.favorId);
                $scope.favorid = $state.params.favorId;

                $scope.favorFB.$transaction(function(data){
                    console.log(data);
                    $scope.favor = data;
                    console.log($scope.favor);
                    console.log($scope.favor.date.split("T")[0]);
                    $scope.favor.date = $scope.favor.date.split("T")[0];
                });
            });
        });
    })
    $scope.contacts = [];

    $scope.getContacts = function(){
        var options = new ContactFindOptions();
        //options.filter="";
        options.multiple=true;
        var fields = ["*"];
        navigator.contacts.find(fields, $scope.onSuccess, $scope.onError, options);
    }

    $scope.onSuccess = function(contacts){
        $timeout(function() {
            $scope.$apply(function() {
                $scope.contacts = contacts;
                console.log($scope.contacts);
            });
        });
    }

    $scope.onError = function(){
        alert("Get contacts error");
    }
   $scope.updateFavor = function(){
    console.log($scope.favorFB);
       console.log($scope.favor.date);
       //$scope.favorFB.$child('date').$set($scope.favor.date);
       $scope.favorFB.$set($scope.favor);
    //$scope.favors.$update($scope.favor) ;

    $state.transitionTo('app.favors')

   }

    $scope.updateSelection =function($event, id){
        var checkbox = $event.target;
        var action = (checkbox.checked ? 'add' : 'remove');
        console.log($event.target.id);
        if($event.target.id == "rating5" && checkbox.checked){
            $scope.favor.rating = 5;
        }
        else if($event.target.id == "rating4" && checkbox.checked){
            $scope.favor.rating = 4;
        }
        else if($event.target.id == "rating3" && checkbox.checked){
            $scope.favor.rating = 3;
        }
        else if($event.target.id == "rating2" && checkbox.checked){
            $scope.favor.rating = 2;
        }
        else if($event.target.id == "rating1" && checkbox.checked){
            $scope.favor.rating = 1;
        }
    }

})


favorsApp.controller('FavorDetailController',function($scope,$state,FavorStore){

  FavorStore.then(function(userRef){
    //$scope.favor = userRef.$get(parseInt($state.params.favorId))
    $scope.favors = userRef
    $scope.favor = $scope.favors.$child($state.params.favorId)

  })
})  


// End CRUD   

favorsApp.controller('FavorListController',function($scope,$state,FavorStore,$timeout){

  FavorStore.then(function(userRef){
      $scope.favors = [];
      $scope.favorsFB = userRef;
      $timeout(function() {
          $scope.$apply(function() {
              $scope.favorsFB.$transaction(function(data){
                  console.log(data);
                  //$scope.favors = [];
                  var keys = [];
                  for (var key in data) {
                      keys.push(key);
                  }
                  for(var i=0;i<keys.length;i++){
                      //var tmp = {"id":keys[i],data[keys[i]]};
                      data[keys[i]].ide = keys[i];
                      $scope.favors.push(data[keys[i]]);
                  }
                  console.log($scope.favors);
              });
          });
      },3000);


    $scope.navigateTo = function(id, favor){
      $state.transitionTo('app.favordetail', {favorId:id})
    } 
  })
// promise is a placeholder that a value will be returned later
})


favorsApp.controller('FavorDetailController',function($scope, $state, FavorStore){
  console.log('I am ' + $state.params.favorId)
  FavorStore.then(function(userRef){
    //$scope.favor = userRef.$get(parseInt($state.params.favorId))
    $scope.favors = userRef
    $scope.favor = $scope.favors.$child($state.params.favorId)
      $scope.favorid = $state.params.favorId;


  })
    $scope.navigateTo = function(){
        console.log($scope.favor);
        $state.transitionTo('app.favoredit',{"favorId":$scope.favorid});
    }
})


favorsApp.controller('FavorsOverviewController',function($scope,$state,_,FavorStore,$timeout){

  FavorStore.then(function(userRef){

  // removing the blank strings that Firebase inputs
      console.log(userRef);
    $scope.favors = _.compact(userRef);
    //$scope.favors = userRef;

  // getting unique names
      console.log($scope.favors);
    var messy_contacts = _.pluck($scope.favors,'name');
    //  var messy_contacts = $scope.favors;
    var unique_contacts = _.uniq(messy_contacts);
      //var unique_contacts = messy_contacts;
    //$scope.allcontacts = unique_contacts;
      var allcontacts = unique_contacts;
    console.log(allcontacts);

      var favors = [];
      $scope.favorsFB = userRef;
      $timeout(function() {
          $scope.$apply(function() {
              $scope.favorsFB.$transaction(function(data){
                  console.log(data);
                  //$scope.favors = [];
                  var keys = [];
                  for (var key in data) {
                      keys.push(key);
                  }
                  for(var i=0;i<keys.length;i++){
                      //data[keys[i]].ide = keys[i];
                      favors.push(data[keys[i]]);
                  }
                  console.log(favors);
                  $scope.allcontacts = [];
                  for(var i=0;i<allcontacts.length;i++){
                      var receivedCount = 0;
                      var gavedCount = 0;
                      var tmp = {};
                      for(var j=0;j<favors.length;j++){
                          if(favors[j].name.name.formatted==allcontacts[i]){
                              if(favors[j].role == "Received"){
                                  receivedCount++;
                              }
                              else if(favors[j].role == "Gave"){
                                  gavedCount++;
                              }
                          }
                      }
                      tmp.index = i;
                      tmp.name = allcontacts[i];
                      tmp.gavedCount = gavedCount;
                      tmp.receivedCount = receivedCount;
                      $scope.allcontacts.push(tmp);
                  }
              });
          });
      },3000);
  // $scope.allcontacts = _.without(unique_contacts, "");

    var grouped_contacts = _.groupBy($scope.favors, 'name');
    // for(i=0; i < grouped_contacts.length; i++){
    //   _.countBy(grouped_contacts, function(grouped_contacts.role){
    //     return grouped_contacts.role == "Gave" ? 'Gave':'Received'
    //   })
    // }
    // $scope.navigateTo = function($index, favor){

    //   $state.transitionTo('app.favordetail', {favorId:$index})
    //} 
  })
// promise is a placeholder that a value will be returned later
    $scope.navigateTo = function(contactname){
        console.log(contactname);
        $state.transitionTo('app.favorsContactOverview',{contactname:contactname});
    }
})

favorsApp.controller('FavorsContactOverviewController',function($scope,$state,_,FavorStore,$timeout){
    console.log('I am ' + $state.params.contactname);
    FavorStore.then(function(userRef){
        $scope.contact = {};
        console.log(userRef);
        var favors = [];
        $scope.favorsFB = userRef;
        $timeout(function() {
            $scope.$apply(function() {
                $scope.favorsFB.$transaction(function(data){
                    console.log(data);
                    //$scope.favors = [];
                    var keys = [];
                    for (var key in data) {
                        keys.push(key);
                    }
                    for(var i=0;i<keys.length;i++){
                        //data[keys[i]].ide = keys[i];
                        favors.push(data[keys[i]]);
                    }
                    console.log(favors);
                    $scope.allcontacts = [];
                    //for(var i=0;i<allcontacts.length;i++){
                        var receivedCount = 0;
                        var gavedCount = 0;
                        var tmp = {};
                        for(var j=0;j<favors.length;j++){
                            if(favors[j].name==$state.params.contactname){
                                if(favors[j].role == "Received"){
                                    receivedCount++;
                                }
                                else if(favors[j].role == "Gave"){
                                    gavedCount++;
                                }
                            }
                        }
                        tmp.index = i;
                        tmp.name = $state.params.contactname;
                        tmp.gavedCount = gavedCount;
                        tmp.receivedCount = receivedCount;
                        tmp.favors = [];
                        for(var i=0;i<favors.length;i++){
                            if(favors[i].name==$state.params.contactname){
                                tmp.favors.push(favors[i]);
                            }
                        }
                        $scope.contact = tmp;
                    //}
                });
            });
        },3000);
    })

})
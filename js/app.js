var app = angular.module("groceryListApp", ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/grocery_list.html',
        controller: "GroceryListItemsController"

    })

    .when("/addItem", {
        templateUrl: "views/input_item.html",
        controller: "GroceryListItemsController"

    })

    .when("/addItem/edit/:id/", {
        templateUrl: "views/input_item.html",
        controller: "GroceryListItemsController"

    })

    .when("/index", {

    })

    .otherwise({
        redirectTo: "/"
    })

});

app.service("GroceryService", function($http) {
    var groceryService = {}
    groceryService.groceryItems = [];

    $http.get('data/server-data.json')
        .success(function(data) {
            groceryService.groceryItems = data;
            for (var item in groceryService.groceryItems[item]) {
                groceryService.groceryItems[item].date = new Date(groceryService.groceryItems[item].date);
            }

        })
        .error(function(data) {
            alert("Things went wrong...");

        });

    groceryService.findById = function(id) {
        for (var item in groceryService.groceryItems) {
            if (groceryService.groceryItems[item].id == id) {
                return groceryService.groceryItems[item];
            }
        }
    };

    groceryService.getNewID = function() {
        if(groceryService.newID) {
            groceryService.newID++;
            return groceryService.newID;

        } else {
            var maxID = _.max(groceryService.groceryItems, function(entry) {
                return entry.id;
            })
            groceryService.newID = maxID.id + 1;
            return groceryService.newID;

        }
    };

    groceryService.save = function(entry) {
        var updatedItem = groceryService.findById(entry.id);

        if (updatedItem) {
            $http.post('data/updated-item.json', entry)
            .success(function(data) {
                if (data.status == 1) {
                    updatedItem.completed = entry.completed;
                    updatedItem.itemName = entry.itemName;
                    updatedItem.date = entry.date;
                }
            })
            .error(function(data) {


            });

        } else {
            $http.post('data/added-item.json', entry)
                .success(function(data) {
                    entry.id = data.newID;

                })
                .error(function(data) {


                });

            groceryService.groceryItems.push(entry);

        }
    };

    groceryService.removeItem = function(entry) {
        $http.post('data/deleted-item.json', {id: entry.id})
            .success(function(data) {
                if (data.status == 1) {
                    var index = groceryService.groceryItems.indexOf(entry);
                    groceryService.groceryItems.splice(index, 1);
                }
                
            })
            .error(function (data, status) {

            });
    }

    groceryService.markCompleted = function(entry) {
        entry.completed = !entry.completed;

    }

    return groceryService
})

app.controller("HomeController", ["$scope", "GroceryService", function($scope, GroceryService) {
    $scope.appTitle = "Grocery List";
    $scope.removeItem = function(entry) {
        GroceryService.removeItem(entry);

    }

    $scope.markCompleted = function(entry) {
        GroceryService.markCompleted(entry);

    }

    $scope.$watch(function() { return GroceryService.groceryItems; }, function() {
        $scope.groceryItems = groceryItems;

    })

}]);

app.controller("GroceryListItemsController", ["$scope", "$routeParams", "$location", "GroceryService", function($scope, $routeParams, $location, GroceryService) {
    $scope.groceryItems = GroceryService.groceryItems;
    $scope.rp = "Route parameter value: " + $routeParams.id + $routeParams.cat;

    if (!$routeParams.id) {
        $scope.groceryItem = {id: 0, completed: true, itemName: 'cheese', date: new Date()}

    } else {
        $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));

    }

    $scope.save = function () {
        GroceryService.save($scope.groceryItem);
        $location.path("/");

    }
    console.log($scope.groceryItems);
}]);

app.directive("tbGroceryItem", function() {
    return {
        restrict: "E",
        templateUrl: "views/grocery_items.html"
    }
});

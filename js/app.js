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

app.service("GroceryService", function() {
    var groceryService = {}
    groceryService.groceryItems = [
        {id: 1, completed: true, itemName: 'milk', date: new Date('October 22, 2014 00:00:00')},
        {id: 2, completed: true, itemName: 'cookies', date: new Date('October 23, 2014 00:00:00')},
        {id: 3, completed: true, itemName: 'chips', date: new Date('October 24, 2014 00:00:00')},
        {id: 4, completed: true, itemName: 'soda', date: new Date('October 25, 2014 00:00:00')},
        {id: 5, completed: true, itemName: 'lemon', date: new Date('October 26, 2014 00:00:00')},
        {id: 6, completed: true, itemName: 'meat', date: new Date('October 27, 2014 00:00:00')},
        {id: 7, completed: true, itemName: 'lettuce', date: new Date('October 28, 2014 00:00:00')}
    ];

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
            updatedItem.completed = entry.completed;
            updatedItem.itemName = entry.itemName;
            updatedItem.date = entry.date;

        } else {
            entry.id = groceryService.getNewID();
            groceryService.groceryItems.push(entry);

        }
    };

    groceryService.removeItem = function(entry) {
        var index = groceryService.groceryItems.indexOf(entry);
        groceryService.groceryItems.splice(index, 1);

    }

    groceryService.markCompleted = function(entry) {
        entry.completed = !entry.completed;

    }

    return groceryService
})

app.controller("HomeController", ["$scope", "GroceryService", function($scope, GroceryService) {
    $scope.appTitle = GroceryService.groceryItems[0].itemName;
    $scope.removeItem = function(entry) {
        GroceryService.removeItem(entry);

    }

    $scope.markCompleted = function(entry) {
        GroceryService.markCompleted(entry);

    }

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

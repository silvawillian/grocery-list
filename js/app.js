var app = angular.module("groceryListApp", []);

app.controller("HomeController", ["$scope", function($scope) {
    $scope.appTitle = "Grocery List";

}]);

app.controller("GroceryListItemsController", ["$scope", function($scope) {
    $scope.groceryItems = [
        {completed: true, itemName: 'milk', date: '2016-10-22'},
        {completed: true, itemName: 'cookies', date: '2016-10-23'},
        {completed: true, itemName: 'chips', date: '2016-10-24'},
        {completed: true, itemName: 'soda', date: '2016-10-25'},
        {completed: true, itemName: 'lemon', date: '2016-10-26'},
        {completed: true, itemName: 'meat', date: '2016-10-27'},
        {completed: true, itemName: 'lettuce', date: '2016-10-28'}
    ]

}]);
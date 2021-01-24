
var app = angular.module("expensesApp", ['ngRoute'])

app.config(['$routeProvider',function($routeProvider){
    $routeProvider
    .when('/ejemplo2', {
        templateUrl: 'view/vista.html',
        controller: 'ViewControler'
    })
    .when('/ejemplo1',{
        templateUrl: 'view/ejemplo.html',
        controller: 'Viewhead'
    })
    .when('/edit',{
        templateUrl: 'view/nuevo.html',
        controller: 'ViewNuevo'
    })
    .when('/edit/:id',{
        templateUrl: 'view/nuevo.html',
        controller: 'ViewNuevo'
    })
    .otherwise({
        redirectTo: '/'
    })
}])

app.factory('Expenses',function(){
    var service = {}
    service.anotaciones = [
        {id: 1,nombre : 'Programación',descripcion: "Realizar Exposición tema: Integración de Codigo con Etiquetas HTML"},
        {id: 2,nombre : 'Sistemas Operativos',descripcion: "Realizar Taller"},
        {id: 3,nombre : 'Inteligencia Artificial',descripcion: "Realizar Investigación"}
    ]

    service.save = function(entry){
        var toUpdate = service.getById(entry.id)
        if(toUpdate){
            _.extend(toUpdate, entry)
        }else{
            entry.id = service.getNewId()
            service.anotaciones.push(entry)
        }
    }

    service.getNewId = function(){
        if(service.newId){
            service.newId++;
            return service.newId
        }
        else{
            var entryMaxId = _.max(service.anotaciones, function(entry){
                return entry.id
            })
            service.newId = entryMaxId.id + 1;
            return service.newId
        }
    }

    service.getById = function(id) {
        return _.find(service.anotaciones, function(entry){
            return entry.id == id
        })
    }

    service.remove = function(entry){
        service.anotaciones = _.reject(service.anotaciones, function(element){
            return entry.id == element.id
        })
    }

    return service
})

app.controller('ExpensesViewController', ['$scope', function($scope){
    $scope.titulo = 'Integración de Codigo con Etiquetas HTML'
}]);

app.controller('Viewhead',['$scope',function($scope){
    $scope.expense = {
        description: 'food',
        amount: 10
    }
    $scope.incremento = function(){
        $scope.expense.amount++
    }
}]);

app.controller('ViewControler', ['$scope', 'Expenses' ,function($scope, Expenses){
    
    $scope.items = Expenses.anotaciones

    $scope.remove = function(items){
        Expenses.remove(items)
    }

    $scope.$watch(function(){
        return Expenses.anotaciones
    },function(anotaciones){
        $scope.items = anotaciones
    })

}])

app.controller('ViewNuevo', ['$scope', '$routeParams', 'Expenses' , '$location',function($scope, $routeParams, Expenses, $location){
    if(!$routeParams.id){
        $scope.materia = {}
    }else{
        $scope.materia = _.clone(Expenses.getById($routeParams.id))
    }

    $scope.save = function(){
        Expenses.save($scope.materia)
        $location.path('/ejemplo2')
    }
}])
(function() {
  'use strict';

  angular
    .module('app')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, $scope, $filter, webDevTec, toastr, MainFactory) {
    var vm = this;

    vm.awesomeThings = [];
    vm.classAnimation = '';
    vm.creationDate = 1465947483658;
    vm.showToastr = showToastr;

    activate();
    populateData();

    vm.brands = [];
    $scope.selectedBrands = [];
    vm.interactions = [];
    vm.filteredInteractions = [];
    vm.chartData = [];
    vm.users = [];

    vm.barChart = {};
    vm.barChart.type = "BarChart";
    vm.barChart.data = {"cols": [], "rows": []};

    vm.translation = {
      selectAll       : "Selecionar Todos",
      selectNone      : "Selecionar Nenhum",
      reset           : "Reset",
      search          : "Buscar por...",
      nothingSelected : "Nenhum selecionado"
    };

    vm.onBrandSelected = function(){
      if ($scope.selectedBrands.length > 0){
        vm.filteredInteractions = _.filter(vm.interactions, function (interaction) {
          return _.find($scope.selectedBrands, {'id': interaction.brand});
        });
      }
      else{
        vm.filteredInteractions = [];
      }

      vm.populateChartData();
    };

    vm.populateChartData = function () {
      var data = _.groupBy(vm.filteredInteractions, 'user');
      var rows = [];

      angular.forEach(vm.users, function (user, iUser) {
        user.interactions = (data[user.id] ? data[user.id] : []);
      });
      var orderedUsers = $filter('limitTo')($filter('orderBy')(vm.users, 'interactions.length', true), 5);

      angular.forEach(orderedUsers, function (user, iUser) {
        rows.push({c: [
          {v: _.capitalize(user.name.title) + ' ' +  _.capitalize(user.name.first) + ' ' +  _.capitalize(user.name.last)},
          {v: user.interactions.length}
        ]});
      });

      vm.barChart.data = {"cols": [
        {id: "n", label: "Nome Usuário", type: "string"},
        {id: "i", label: "Interações", type: "number"}
      ], "rows": rows};
    };

    $scope.$watch('selectedBrands', function () {
      vm.onBrandSelected();
    });

    function populateData(){
      MainFactory.getBrands()
        .then(function (response) {
          vm.brands = response;

          angular.forEach(vm.brands, function (brand, iBrand) {
            brand.icon = '<img src="' + brand.image + '"/>';
          });
        });

      MainFactory.getInteractions()
        .then(function (response) {
          vm.interactions = response;
          vm.filteredInteractions = vm.interactions;

          vm.onBrandSelected();
        });
      MainFactory.getUsers()
        .then(function (response) {
          vm.users = response;
        });
    };

    function activate() {
      getWebDevTec();
      $timeout(function() {
        vm.classAnimation = 'rubberBand';
      }, 4000);
    }

    function showToastr() {
      toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
      vm.classAnimation = '';
    }

    function getWebDevTec() {
      vm.awesomeThings = webDevTec.getTec();

      angular.forEach(vm.awesomeThings, function(awesomeThing) {
        awesomeThing.rank = Math.random();
      });
    }
  }
})();

angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MovimentacaoCadastroCtrl', function($scope, $location, $cordovaSQLite) {
  $scope.movimento = {};

  $scope.salvar = function() {
    alert(JSON.stringify($scope.movimento));
    var query = 'INSERT INTO movimento (valor, tipo_movimento, categoria_codigo, situacao, data) VALUES (?, ?, ?, ?, ?)';
    $cordovaSQLite.execute(db, query, [
      $scope.movimento.valor,
      $scope.movimento.tipo_movimento,
      $scope.movimento.categoria_codigo,
      $scope.movimento.situacao,
      $scope.movimento.data
    ]).then(function(result) {
      alert(JSON.stringify(result));

      $location.path('/app/movimentacao');
    }, function(erro) {
      alert(JSON.stringify(erro));
    });
  };
});

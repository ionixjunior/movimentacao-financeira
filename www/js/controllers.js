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

.controller('MovimentacaoCtrl', function($scope, $cordovaSQLite) {
  $scope.movimentacao = [];
  $scope.saldo = Number(0);

  $scope.carregaSaldo = function() {
    var query = 'SELECT (SELECT SUM(valor) FROM movimento WHERE tipo_movimento = ? AND situacao = ?) AS receita, (SELECT SUM(valor) FROM movimento WHERE tipo_movimento = ? AND situacao = ?) AS despesa FROM movimento';
    
    $cordovaSQLite.execute(db, query, [2, 'A', 1, 'A'])
      .then(function(dados) {
        alert(JSON.stringify(dados.rows.item(0)));
        if (dados.rows.length > 0) {
          $scope.saldo = Number(dados.rows.item(0)['receita']) - Number(dados.rows.item(0)['despesa']);
        }
      }, function(erro) {
        alert(JSON.stringify(erro));
      });
  };

  $scope.carregaUltimasMovimentacoes = function() {
    var query = 'SELECT codigo, valor, tipo_movimento, data FROM movimento WHERE situacao = ? ORDER BY data DESC, codigo DESC LIMIT 10';
    $cordovaSQLite.execute(db, query, ['A'])
      .then(function(dados) {
        for (var i = 0; i < dados.rows.length; i++) {
          $scope.movimentacao.push(dados.rows.item(i));
        }
      }, function(erro) {
        alert(JSON.stringify(erro));
      });
  };

  $scope.carregaSaldo();
  $scope.carregaUltimasMovimentacoes();
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

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
        if (dados.rows.length > 0) {
          $scope.saldo = Number(dados.rows.item(0)['receita']) - Number(dados.rows.item(0)['despesa']);
        }
      }, function(erro) {
        alert(JSON.stringify(erro));
      });
  };

  $scope.carregaUltimasMovimentacoes = function() {
    var query = 'SELECT movimento.codigo, movimento.valor, movimento.tipo_movimento, movimento.data, categoria_movimento.nome FROM movimento INNER JOIN categoria_movimento ON (categoria_movimento.codigo = movimento.categoria_codigo) WHERE movimento.situacao = ? ORDER BY movimento.data DESC, movimento.codigo DESC LIMIT 10';
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
  $scope.categorias = [];

  $scope.salvar = function() {
    var query = 'INSERT INTO movimento (valor, tipo_movimento, categoria_codigo, situacao, data) VALUES (?, ?, ?, ?, ?)';
    $cordovaSQLite.execute(db, query, [
      $scope.movimento.valor,
      $scope.movimento.tipo_movimento,
      $scope.movimento.categoria_codigo,
      $scope.movimento.situacao,
      $scope.movimento.data
    ]).then(function(result) {
      $location.path('/app/movimentacao');
    }, function(erro) {
      alert(JSON.stringify(erro));
    });
  };

  $scope.carregaCategorias = function() {
    var query = 'SELECT codigo, nome FROM categoria_movimento WHERE situacao = ? ORDER BY nome';
    $cordovaSQLite.execute(db, query, ['A'])
      .then(function(dados) {
        for (var i = 0; i < dados.rows.length; i++) {
          $scope.categorias.push(dados.rows.item(i));
        }
      }, function(erro) {
        alert(JSON.stringify(erro));
      });
  };

  $scope.carregaCategorias();
})

.controller('GerenciamentoCategoriasCtrl', function($scope, $location, $cordovaSQLite) {
  $scope.categorias = [];

  $scope.carregaCategorias = function() {
    var query = 'SELECT codigo, nome FROM categoria_movimento WHERE situacao = ? ORDER BY nome';
    $cordovaSQLite.execute(db, query, ['A'])
      .then(function(dados) {
        for (var i = 0; i < dados.rows.length; i++) {
          $scope.categorias.push(dados.rows.item(i));
        }
      }, function(erro) {
        alert(JSON.stringify(erro));
      })
  };

  $scope.carregaCategorias();
})

.controller('CategoriaCadastroCtrl', function($scope, $location, $cordovaSQLite, $stateParams) {
  $scope.categoria_movimento = {};

  $scope.salvar = function() {
    var parametros = [];
    var query = 'INSERT INTO categoria_movimento (nome, situacao) VALUES (?, ?)';
    parametros[0] = $scope.categoria_movimento.nome;
    parametros[1] = $scope.categoria_movimento.situacao;
    
    if ($scope.categoria_movimento.codigo !== undefined) {
      query = 'UPDATE categoria_movimento SET nome = ?, situacao = ? WHERE codigo = ?';
      parametros[2] = $scope.categoria_movimento.codigo;
    }

    $cordovaSQLite.execute(db, query, parametros).then(function(result) {
      $location.path('/app/gerenciamentocategorias');
    }, function(erro) {
      alert(JSON.stringify(erro));
    });
  };

  $scope.carregaCategoria = function(codigo) {
    var query = 'SELECT * FROM categoria_movimento WHERE codigo = ?';
    $cordovaSQLite.execute(db, query, [codigo])
      .then(function(dados) {
        $scope.categoria_movimento = dados.rows.item(0);
      }, function(erro) {
        alert(JSON.stringify(erro));
      });
  };

  if ($stateParams.codigo !== undefined) {
    $scope.carregaCategoria($stateParams.codigo);
  }
});

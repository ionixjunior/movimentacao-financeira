angular.module('starter.controllers').controller('CtrlMovimentacaoCadastro', ['$scope', '$location', '$cordovaSQLite', '$stateParams', function($scope, $location, $cordovaSQLite, $stateParams) {
	$scope.movimento = {};
	$scope.categorias = [];

	$scope.salvar = function() {
	var parametros = [];
	var query = 'INSERT INTO movimento (valor, tipo_movimento, categoria_codigo, situacao, data) VALUES (?, ?, ?, ?, ?)';
	parametros[0] = $scope.movimento.valor;
	parametros[1] = $scope.movimento.tipo_movimento;
	parametros[2] = $scope.movimento.categoria_codigo;
	parametros[3] = $scope.movimento.situacao;
	parametros[4] = $scope.movimento.data;

	if ($scope.movimento.codigo !== undefined) {
	  query = 'UPDATE movimento SET valor = ?, tipo_movimento = ?, categoria_codigo = ?, situacao = ?, data = ? WHERE codigo = ?';
	  parametros[5] = $scope.movimento.codigo;
	}

	$cordovaSQLite.execute(db, query, parametros).then(function(result) {
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

	$scope.carregaMovimento = function(codigo) {
	var query = 'SELECT * FROM movimento WHERE codigo = ?';
	$cordovaSQLite.execute(db, query, [codigo])
	  .then(function(dados) {
	    $scope.movimento = dados.rows.item(0);
	  }, function(erro) {
	    alert(JSON.stringify(erro));
	  });
	};

	if ($stateParams.codigo !== undefined) {
	$scope.carregaMovimento($stateParams.codigo);
	}

	$scope.carregaCategorias();
}]);
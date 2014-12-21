angular.module('starter.controllers').controller('CtrlMovimentacaoCadastro', ['$scope', '$location', '$cordovaSQLite', '$stateParams', function($scope, $location, $cordovaSQLite, $stateParams) {
	$scope.movimento = {};
	$scope.categorias = [];

	$scope.inserir = function(parametros) {
		var query = 'INSERT INTO movimento (valor, tipo_movimento, categoria_codigo, situacao, data) VALUES (?, ?, ?, ?, ?)';

		$scope.executar(query, parametros);
	};

	$scope.atualizar = function(parametros) {
		var query = 'UPDATE movimento SET valor = ?, tipo_movimento = ?, categoria_codigo = ?, situacao = ?, data = ? WHERE codigo = ?';

		$scope.executar(query, parametros);
	};

	$scope.executar = function(query, parametros) {
		$cordovaSQLite.execute(db, query, parametros).then(function(result) {
			$location.path('/app/movimentacao');
		}, function(erro) {
			alert(JSON.stringify(erro));
		});
	};

	$scope.salvar = function() {
		var parametros = [];
		parametros[0] = $scope.movimento.valor;
		parametros[1] = $scope.movimento.tipo_movimento;
		parametros[2] = $scope.movimento.categoria_codigo;
		parametros[3] = $scope.movimento.situacao;
		parametros[4] = $scope.movimento.data;

		if ($scope.movimento.codigo !== undefined) {
			parametros[5] = $scope.movimento.codigo;

			return $scope.atualizar(parametros);
		}

		return $scope.inserir(parametros);
	};

	$scope.carregaCategorias = function() {
		var parametros = [];
		parametros[0] = 'A';

		var query = 'SELECT codigo, nome FROM categoria_movimento WHERE situacao = ? ORDER BY nome';

		$cordovaSQLite.execute(db, query, parametros)
		.then(function(dados) {
			for (var i = 0; i < dados.rows.length; i++) {
				$scope.categorias.push(dados.rows.item(i));
			}
		}, function(erro) {
			alert(JSON.stringify(erro));
		});
	};

	$scope.carregaMovimento = function(codigo) {
		var parametros = [];
		parametros[0] = codigo;

		var query = 'SELECT * FROM movimento WHERE codigo = ?';

		$cordovaSQLite.execute(db, query, parametros)
		.then(function(dados) {
			$scope.movimento = dados.rows.item(0);
		}, function(erro) {
			alert(JSON.stringify(erro));
		});
	};

	if ($stateParams.codigo !== undefined) {
		$scope.carregaMovimento($stateParams.codigo);
	} else {
		var data = new Date();
		$scope.movimento.tipo_movimento = 1;
		$scope.movimento.situacao = 'A';
	}

	$scope.carregaCategorias();
}]);
angular.module('starter.controllers').controller('CtrlCategoriaCadastro', ['$scope', '$location', '$cordovaSQLite', '$stateParams', function($scope, $location, $cordovaSQLite, $stateParams) {
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
}]);
angular.module('starter.controllers').controller('CtrlGerenciamentoCategorias', ['$scope', '$location', '$cordovaSQLite', function($scope, $location, $cordovaSQLite) {
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
}]);
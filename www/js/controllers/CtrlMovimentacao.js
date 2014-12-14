angular.module('starter.controllers').controller('CtrlMovimentacao', ['$scope', '$timeout', '$cordovaSQLite', function($scope, $timeout, $cordovaSQLite) {
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

	$timeout(function() {
	$scope.carregaSaldo();
	$scope.carregaUltimasMovimentacoes();
	}, 500);
}]);
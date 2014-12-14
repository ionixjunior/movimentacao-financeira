angular.module('starter.controllers').controller('CtrlMovimentacaoHistorico', ['$scope', '$location', '$cordovaSQLite', function($scope, $location, $cordovaSQLite) {
	$scope.movimentacao = [];
	$scope.filtro = {};

	$scope.carregaMovimentacoes = function() {
	$scope.movimentacao = [];
	var query = 'SELECT movimento.codigo, movimento.valor, movimento.tipo_movimento, movimento.data, categoria_movimento.nome FROM movimento INNER JOIN categoria_movimento ON (categoria_movimento.codigo = movimento.categoria_codigo) WHERE movimento.situacao = ? AND data BETWEEN ? AND ? ORDER BY movimento.data DESC, movimento.codigo DESC';
	$cordovaSQLite.execute(db, query, ['A', $scope.filtro.data_inicio, $scope.filtro.data_fim])
	  .then(function(dados) {
	    for (var i = 0; i < dados.rows.length; i++) {
	      $scope.movimentacao.push(dados.rows.item(i));
	    }
	  }, function(erro) {
	    alert(JSON.stringify(erro));
	  });
	};
}]);
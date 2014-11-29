// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var db = null;

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $cordovaSQLite) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    db = $cordovaSQLite.openDB({ name: "controlefinanceiro.db" });
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS usuario (codigo INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, senha TEXT NOT NULL)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS categoria_movimento (codigo INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nome TEXT NOT NULL, situacao TEXT NOT NULL DEFAULT 'A')");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS movimento (codigo INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, valor REAL NOT NULL, tipo_movimento INTEGER NOT NULL, categoria_codigo INTEGER NOT NULL, situacao TEXT NOT NULL DEFAULT 'A', data TEXT NOT NULL, CONSTRAINT fk_movimento_categoria FOREIGN KEY (categoria_codigo) REFERENCES categoria_movimento (codigo) ON DELETE RESTRICT ON UPDATE RESTRICT)");
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.movimentacao', {
      url: "/movimentacao",
      views: {
        'menuContent' :{
          templateUrl: "templates/movimentacao.html"
        }
      }
    })

    .state('app.movimentacaocadastro', {
      url: "/movimentacaocadastro",
      views: {
        'menuContent' :{
          templateUrl: "templates/movimentacaocadastro.html",
          controller: 'MovimentacaoCadastroCtrl'
        }
      }
    })

    .state('app.configuracao', {
      url: "/configuracao",
      views: {
        'menuContent' :{
          templateUrl: "templates/configuracao.html"
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/movimentacao');
});


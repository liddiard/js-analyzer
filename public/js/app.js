var app = angular.module('JsAnalyzer', ['ui.ace']);

app.controller('EditorController', ['$scope', '$http', function($scope, $http) {
    $scope.editorText = "";

    $scope.aceLoaded = function(_editor) {
        _editor.setFontSize(16);
    };

    $scope.evaluate = function() {
        if (this.timeoutId)
            window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(function(){
            $http.post('/api/eval/', {editorText: $scope.editorText})
                .success(function(data){
                    console.log(data);
            });
        }, 1000);
    }

    $scope.$watch(
        "editorText",
        function(newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.evaluate();
            }
        }
    )
}]);

app.controller('ChallengeController', ['$scope', '$http', function($scope, $http) {
    $scope.nodeObjects = [];
    $http.get('/js/nodeObjects.json').success(function(data) {
        $scope.nodeObjects = data;
    });

    $scope.whitelist = [];
    $scope.blacklist = [];
}]);

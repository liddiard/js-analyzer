var app = angular.module('JsAnalyzer', ['ui.ace']);

app.controller('ChallengeController', ['$scope', function($scope) {
    $scope.whitelist = []; // code MUST include these kinds of nodes
    $scope.blacklist = []; // code MUST NOT include these kinds of nodes
    $scope.structure = []; // code should be structured like this
    $scope.nodeObjects = []; // available types of node objects

    $http.get('/js/nodeObjects.json').success(function(data) {
        $scope.nodeObjects = data;
    });
}]);

app.controller('EditorController', ['$scope', '$http', function($scope, $http) {
    $scope.editorText = ""; // user-input text
    $scope.evaluating = false; // has the user entered text that has NOT been evaluated?

    $scope.aceLoaded = function(_editor) {
        _editor.setFontSize(16);
    };

    $scope.evaluate = function() {
        $scope.evaluating = true; // show "evaluating" indicator
        if (this.timeoutId)
            window.clearTimeout(this.timeoutId);
        this.timeoutId = window.setTimeout(function(){
            var payload = {
                editorText: $scope.editorText,
                whitelist: $scope.whitelist,
                blacklist: $scope.blacklist,
                structure: $scope.structure
            };
            $http.post('/api/eval/', payload)
                .success(function(data){
                    console.log(data);
                    $scope.evaluating = false; // hide "evaluating" indicator
                }
            );
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

app.controller('TestingController', ['$scope', '$http', function($scope, $http) {

    $scope.notInBlacklist = function(item) {
        return ($scope.blacklist.indexOf(item.type) === -1);
    };

    $scope.notInWhitelist = function(item) {
        return ($scope.whitelist.indexOf(item.type) === -1);
    };

    $scope.pushStructure = function() {
        /* $scope.structure is an array of "alternative" arrays, which are composed
         * of statement objects. We add a new empty alternative array here. */
        $scope.structure.push([{}]);
    };

    $scope.pushNode = function(index) {
        // add a node to the end of the structure
        $scope.structure[index].push({});
    };

    $scope.removeNode = function(alternative, index, outerIndex) {
        // remove a node from the structure at a specified index
        alternative.splice(index, 1);
        if (!alternative.length)
            $scope.structure.splice(outerIndex, 1); // if the alternative is empty, remove it
    };

    $scope.addChild = function(node) {
        node.child = {};
    };

    $scope.removeChild = function(node) {
        delete node.child;
    };

}]);

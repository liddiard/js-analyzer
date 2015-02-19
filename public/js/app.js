var app = angular.module('JsAnalyzer', ['ui.ace']);

app.controller('ChallengeController', ['$scope', '$http', function($scope, $http) {
    $scope.whitelist = []; // code MUST include these kinds of nodes
    $scope.blacklist = []; // code MUST NOT include these kinds of nodes
    $scope.structure = []; // code should be structured like this
    $scope.nodeObjects = []; // available types of node objects

    $http.get('/js/nodeObjects.json').success(function(data) {
        $scope.nodeObjects = data;
    });

    $scope.prettyPrint = function(type) {
        var obj;
        for (var i = 0; i < $scope.nodeObjects.length; i++) {
            obj = $scope.nodeObjects[i];
            if (obj.type === type)
                return obj.name + " " + obj.category;
        }
    }
}]);

app.controller('EditorController', ['$scope', '$http', function($scope, $http) {
    $scope.editorText = ""; // user-input text
    $scope.evaluating = false; // has the user entered text that has NOT been evaluated?
    $scope.feedback = {
        syntax: "",
        whitelist: [],
        blacklist: [],
        structure: {}
    };

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
                    $scope.feedback = data;
                    $scope.evaluating = false; // hide "evaluating" indicator
                }
            );
        }, 1000);
    };

    $scope.feedbackErrors = function() {
        var e = $scope.feedback;
        return (e.syntax.length || e.whitelist.length || e.blacklist.length ||
                !isEmpty(e.structure));
    };

    $scope.getFeedback = function() {
        var e = $scope.feedback;
        if (!$scope.feedbackErrors())
            return "Success! You passed all the tests!";
        if (e.syntax.length)
            return "It looks like there's a problem with your syntax. Here's the error: "
                    + e.syntax;
        if (e.whitelist.length)
            return "You must use a " + $scope.prettyPrint(e.whitelist[0]) + ".";
        if (e.blacklist.length)
            return "You are not allowed to use a " + $scope.prettyPrint(e.blacklist[0]) + ".";
        else { // has to be a structure error
            var msg = "Looks like you're missing a " + $scope.prettyPrint(e.structure.missing);
            if (e.structure.parent)
                return msg + " inside your " + $scope.prettyPrint(e.structure.parent) + ".";
            if (e.structure.precedingStatement)
                return msg + " after your " + $scope.prettyPrint(e.structure.precedingStatement) + ".";
            if (e.structure.followingStatement)
                return msg + " before your " + $scope.prettyPrint(e.structure.followingStatement) + ".";
            else
                return msg + "."
        }
    };

    $scope.$watch(
        "editorText",
        function(newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.evaluate();
            }
        }
    )
}]);

app.controller('TestingController', ['$scope', function($scope) {

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


// utility functions

function isEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
}

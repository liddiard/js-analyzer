var walk = require('acorn/util/walk');

exports.astContains = function(ast, nodeType) {
// checks if an abstract syntax tree contains a node of type nodeType
    var node = walk.findNodeAt(ast, null, null, nodeType);
    if (typeof node !== 'undefined') return true;
    else return false;
}

exports.validateStructure = function(ast, structure) {
// checks if an AST's structure is valid based on different structural options.
// returns an error object with info on structural errors or an empty object
// if there are no errors.
    var errors = {};

    for (var i = 0; i < structure.length; i++) { // for each alternative

        var alternative = structure[i];
        var cur = 0; // current position in parsedText code

        for (var j = 0; j < alternative.length; j++) { // for each node in each alternative

            var node = walk.findNodeAfter(ast, cur, alternative[j].type);

            if (typeof node !== 'undefined') // node found following previously found node
                cur = node.node.end;
            else { // node NOT found following previously found node
                errors = {};
                errors.missing = alternative[j].type;
                if (j > 0) // this is NOT the first statement
                    errors.precedingStatement = alternative[j-1].type;
                if (j < alternative.length-1) // this is NOT the last statement
                    errors.followingStatement = alternative[alternative.length-1].type;
                break; // this code structure doesn't match this alternative, try another
            }

            if (alternative[j].child) { // this alternative has a child node
                var childNode = walk.findNodeAt(node.node, null, null, alternative[j].child.type);
                if (typeof childNode !== 'undefined')
                    cur = childNode.node.end;
                else { // child node NOT found
                    errors = {};
                    errors.missing = alternative[j].child.type;
                    errors.parent = alternative[j].type;
                    break; // this code structure doesn't match this alternative, try another
                }
            }

            if (j === alternative.length-1)
                return {}; // we've matched a valid code structure, exit now
        }
    }
    return errors;
}

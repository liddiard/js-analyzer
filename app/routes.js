var path = require('path');
var acorn = require('acorn');

module.exports = function(app) {

    // server routes ===========================================================
    // handle things like api calls
    // authentication routes

    // evaluate JavaScript text
    app.post('/api/eval', function(req, res) {
        var requestBody = req.body;

        var evalType = requestBody.evalType; // valid types: whitelist, blacklist, structure
        var criteria = requestBody.criteria;
        var editorText = requestBody.editorText;

        var parsedText = acorn.parse(editorText);

        console.log(parsedText.body[0].type);

        res.json({lorem: 'ipsum'});
    });

    // route to handle creating goes here (app.post)
    // route to handle delete goes here (app.delete)

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/views', 'index.html')); // load our public/index.html file
    });

};

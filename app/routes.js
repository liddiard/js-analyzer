var path = require('path');
var acorn = require('acorn');
var validation = require('./codeValidation')

module.exports = function(app) {

    // server routes ===========================================================

    // evaluate JavaScript editor text
    app.post('/api/eval', function(req, res) {
        var requestBody = req.body;

        var editorText = requestBody.editorText;
        var whitelist = requestBody.whitelist;
        var blacklist = requestBody.blacklist;
        var structure = requestBody.structure;

        var errors = {
            syntax: "",
            whitelist: [],
            blacklist: [],
            structure: {}
        };

        try {
            var parsedText = acorn.parse(editorText);
        }
        catch (ex) {
            errors.syntax = ex.message;
            res.json(errors);
            return;
        }

        /* check for whitelist errors */
        for (var i = 0; i < whitelist.length; i++) {
            if (!validation.astContains(parsedText, whitelist[i]))
                errors.whitelist.push(whitelist[i]);
        }

        /* check for blacklist errors */
        for (var i = 0; i < blacklist.length; i++) {
            if (validation.astContains(parsedText, blacklist[i])) {
                errors.blacklist.push(blacklist[i]);
            }
        }

        /* check for structural errors */
        errors.structure = validation.validateStructure(parsedText, structure);

        res.json(errors);

    });


    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/views', 'index.html')); // load our public/index.html file
    });

};

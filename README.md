# JavaScript Challenge Framework

## Features
- Parses user-input JavaScript code using Acorn.js*
- Options to provide a whitelist and blacklist of node types
- Determine the rough structure of the program, including specifying multiple
alternatives
- Uses Ace code editor on the frontend to provide syntax highlighting and
immediate feedback on syntax errors

## Things I didn't get to
- **Ability to infinitely nest structure rules**: I've done something very similar
using [recursive AngularJS templating in Sepalnote](https://github.com/liddiard/sepalnote/blob/master/notes/templates/include/note_major.html).
- **Prevent nonsensical structure rule nesting**: Right now, the Program Structure
setup will allow you to, for example, require nesting a variable declaration
inside a variable declaration, which of course doesn't make sens.
- **Store structure rules in a database**: Right now, they're stored in
[a JSON file](https://github.com/liddiard/js-analyzer/blob/master/public/js/nodeObjects.json),
which works fine since the rules shouldn't need to be updated frequently, but is
still a little unwieldy.
- **IE 8 compatability testing**: I'm using Angular 1.3, which has
[dropped support for IE 8](https://docs.angularjs.org/guide/ie). It may work fine,
but certain things might be broken.


## Known issues
- There is a very strange display bug in Chrome with the <select multiple> elements.
If one of the <option> elemnts in the menu is added/removed, the <option> elements
following it in the <optgroup> get indented. I've tried removing all CSS and the
problem persists. The display issue is not present in other browsers.

* When deciding among libraries to use, I typically look at documentation,
development activity, and performance. Both Esprima and Acorn had adequate but
not great documentation and are both under active development. According
to the test I ran on [Esprima's testing page](http://esprima.org/test/compare.html),
Acorn was slightly but appreciably faster in most cases. Seeing as I was basically
constructing a REPL, it's likely that the code parsing would be happening frequently,
so performance was a huge concern. Both frameworks look quite adequate for the job,
but this leaned me slightly in favor of Acorn to use in my implementation. 

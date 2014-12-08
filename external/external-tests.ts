import m = require('mithril');

var asd = true;

var prop = <Mithril.Property<string>>m.prop();

var xyz = prop('hello');
var abc = prop();

console.log(abc); // should be 'hello'

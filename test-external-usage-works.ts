import m = require('mithril');

var prop: MithrilProperty<string> = m.prop("str");

console.log(prop()); // should be 'str'

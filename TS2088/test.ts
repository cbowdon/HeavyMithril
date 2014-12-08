/// <reference path="routestatic.d.ts" />

interface TestCtrl extends Mithril.Controller {
    value?: string;
    number?: number;
}


var root = document.createElement('div');

m.route.mode = "search";

m.route<TestCtrl>(root, "/foo1", {
    "/foo1": {
        controller: function() {this.number = 1},
        view: function(ctrl) {
            return m("div", {onclick: function() {
                ctrl.number++
            }}, ctrl.number);
        }
    }
})

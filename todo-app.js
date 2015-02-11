/// <reference path="mithril.d.ts" />
// This is the todolist example from http://lhorie.github.io/mithril/getting-started.html
var Todo = (function () {
    function Todo(data) {
        this.description = m.prop(data.description);
        this.done = m.prop(false);
    }
    return Todo;
})();
// Code _will_ compile without these annotations,
// but will default to MithrilController rather than TodoCtrl
var todo = {
    // The cast to TodoCtrl is a bit ugly, but TS can't otherwise handle the function constructor pattern
    controller: function () {
        var _this = this;
        this.list = [];
        this.description = m.prop("");
        this.add = function () {
            if (_this.description()) {
                _this.list.push(new Todo({ description: _this.description() }));
                _this.description("");
            }
        };
    },
    view: function (ctrl) {
        return m("html", [
            m("body", [
                m("input", { onchange: m.withAttr("value", ctrl.description), value: ctrl.description() }),
                m("button", { onclick: ctrl.add }, "Add"),
                m("table", [
                    ctrl.list.map(function (task) {
                        return m("tr", [
                            m("td", [
                                m("input[type=checkbox]", { onclick: m.withAttr("checked", task.done), checked: task.done() })
                            ]),
                            m("td", { style: { textDecoration: task.done() ? "line-through" : "none" } }, task.description()),
                        ]);
                    })
                ])
            ])
        ]);
    }
};
m.module(document, todo);
//# sourceMappingURL=todo-app.js.map
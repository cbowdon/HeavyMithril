/// <reference path="mithril.d.ts" />
// This is the todolist example from http://lhorie.github.io/mithril/getting-started.html
var Todo = (function () {
    function Todo(data) {
        this.description = m.prop(data.description);
        this.done = m.prop(false);
    }
    return Todo;
})();
var TodoCtrl = (function () {
    function TodoCtrl() {
        var _this = this;
        this.list = [];
        this.description = m.prop("");
        this.add = function () {
            if (_this.description()) {
                _this.list.push(new Todo({ description: _this.description() }));
                _this.description("");
            }
        };
    }
    return TodoCtrl;
})();
var todo = {
    controller: TodoCtrl,
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
/// <reference path="mithril.d.ts" />
// This is the todolist example from http://lhorie.github.io/mithril/getting-started.html

class Todo { // We've lost the namespacing compared to the original,
             // but that's easily fixed with a TypeScript module
    description: MithrilProperty<string>;
    done: MithrilProperty<boolean>;
    constructor(data: { description: string }) {
        this.description = m.prop(data.description);
        this.done = m.prop(false);
    }
}

interface TodoCtrl extends MithrilController {
    list: Todo[];
    description: MithrilProperty<string>;
    add(): void;
}

var todo: MithrilModule<TodoCtrl> = {

    // the cast to TodoCtrl is a bit ugly, but best we can do
    controller: <TodoCtrl>function() {
        this.list = []
        this.description = m.prop("");

        this.add = function() {
            if (this.description()) {
                this.list.push(new Todo({description: this.description()}));
                this.description("");
            }
        }.bind(this);
    },

    view: function(ctrl: TodoCtrl) {
        return m("html", [
            m("body", [
                m("input", {onchange: m.withAttr("value", ctrl.description), value: ctrl.description()}),
                m("button", {onclick: ctrl.add}, "Add"),
                m("table", [
                    ctrl.list.map(function(task: Todo) {
                        return m("tr", [
                            m("td", [
                                m("input[type=checkbox]", {onclick: m.withAttr("checked", task.done), checked: task.done()})
                            ]),
                            m("td", {style: {textDecoration: task.done() ? "line-through" : "none"}}, task.description()),
                        ])
                    })
                ])
            ])
        ]);
    },
};

m.module(document, todo);

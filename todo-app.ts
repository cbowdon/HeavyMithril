/// <reference path="mithril.d.ts" />
// This is the todolist example from http://lhorie.github.io/mithril/getting-started.html

class Todo { // We've lost the namespacing compared to the original,
             // but that's easily fixed with a TypeScript module (and more idiomatic)
    description: MithrilProperty<string>;
    done: MithrilProperty<boolean>;
    constructor(data: { description: string }) {
        this.description = m.prop(data.description);
        this.done = m.prop(false);
    }
}

class TodoCtrl implements MithrilController {
    list: Todo[] = [];
    description = m.prop("");
    add = () => {
        if (this.description()) {
            this.list.push(new Todo({description: this.description()}));
            this.description("");
        }
    };
}

var todo: MithrilModule<TodoCtrl> = {

    controller: TodoCtrl,

    view: function(ctrl) {
        return m("html", [
            m("body", [
                m("input", {onchange: m.withAttr("value", ctrl.description), value: ctrl.description()}),
                m("button", {onclick: ctrl.add}, "Add"),
                m("table", [
                    ctrl.list.map(function(task) {
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

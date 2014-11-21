/// <reference path="typings/tsd.d.ts" />
/// <reference path="mithril.d.ts" />
/// <reference path="mithril-mock.d.ts" />

interface TestCtrl extends MithrilController {
    value?: string;
}
interface TestView {
    (ctrl: TestCtrl): string;
}

(function (mock: MithrilWindow) {
    m.deps(mock)

    QUnit.module("m")
    test("div tag", assert => {
        assert.strictEqual(m("div").tag, "div")
    })
    test("default tag is div", assert => {
        assert.strictEqual(m(".foo").tag, "div")
    })
    test("classname", assert => {
        assert.strictEqual(m(".foo").attrs.className, "foo")
    })
    test("title attribute defaults to div", assert => {
        assert.strictEqual(m("[title=bar]").tag, "div")
    })
    test("setting title", assert => {
        assert.strictEqual(m("[title=bar]").attrs.title, "bar")
    })
    test("setting single-quoted title", assert => {
        assert.strictEqual(m("[title=\'bar\']").attrs.title, "bar")
    })
    test("setting double-quoted title", assert => {
        assert.strictEqual(m("[title=\"bar\"]").attrs.title, "bar")
    })
    test("first child", assert => {
        assert.strictEqual(m("div", "test").children[0], "test")
    })
    test("second child", assert => {
        assert.strictEqual(m("div", "test", "test2").children[1], "test2")
    })
    test("first child (array)", assert => {
        assert.strictEqual(m("div", ["test"]).children[0], "test")
    })
    test("setting title with child", assert => {
        assert.strictEqual(m("div", {title: "bar"}, "test").attrs.title, "bar")
    })
    test("setting title with child array", assert => {
        assert.strictEqual(m("div", {title: "bar"}, "test").children[0], "test")
    })
    test("first child after setting title", assert => {
        assert.strictEqual(m("div", {title: "bar"}, ["test"]).children[0], "test")
    })
    test("tag of first child defaults to div", assert => {
        assert.strictEqual(m("div", {title: "bar"}, m("div")).children[0].tag, "div")
    })
    test("tag for nested m()s", assert => {
        assert.strictEqual(m("div", {title: "bar"}, [m("div")]).children[0].tag, "div")
    })
    test("splat", assert => {
        assert.strictEqual(m("div", {title: "bar"}, "test0", "test1", "test2", "test3").children[3], "test3")
    })
    test("mixed children", assert => {
        assert.strictEqual(m("div", {title: "bar"}, m("div"), m("i"), m("span")).children[2].tag, "span")
    })
    test("children length", assert => {
        assert.strictEqual(m("div", ["a", "b"]).children.length, 2)
    })
    test("child tag", assert => {
        assert.strictEqual(m("div", [m("div")]).children[0].tag, "div")
    })
    test("nested divs", assert => {
        assert.strictEqual(m("div", m("div")).children[0].tag, "div") }) //yes, this is expected behavior: see method signature
    test("undefined child", assert => {
        assert.strictEqual(m("div", [undefined]).tag, "div")
    })
    test("no errors div with child", assert => {
        assert.ok(m("div", [{foo: "bar"}])) }) //as long as it doesn't throw errors, it's fine
    test("no errors svg with g child", assert => {
        assert.ok(m("svg", [m("g")]))
    })
    test("no errors svg with link child", assert => {
        assert.ok(m("svg", [m("a[href='http://google.com']")]))
    })
    test("composing classes (class attr)", assert => {
        assert.strictEqual(m(".foo", {"class": "bar"}).attrs["class"], "foo bar")
    })
    test("composing classes (classname attr)", assert => {
        assert.strictEqual(m(".foo", {className: "bar"}).attrs.className, "foo bar")
    })

    QUnit.module("m.module")
    test("creation", assert => {
        mock.requestAnimationFrame.$resolve()
        var root1 = mock.document.createElement("div")
        var mod1 = m.module<TestCtrl>(root1, {
            controller: function() {this.value = "test1"},
            view: function(ctrl) {return ctrl.value}
        })
        var root2 = mock.document.createElement("div")
        var mod2 = m.module<TestCtrl>(root2, {
            controller: function() {this.value = "test2"},
            view: function(ctrl) {return ctrl.value}
        })
        mock.requestAnimationFrame.$resolve()
        assert.strictEqual(root1.childNodes[0].nodeValue, "test1")
        assert.strictEqual(root2.childNodes[0].nodeValue, "test2")
        assert.strictEqual(mod1.value, "test1")
        assert.strictEqual(mod2.value, "test2")
    })

    QUnit.module("m.withAttr")
    test("extracting attribute value", assert => {
        var value: string
        var handler = m.withAttr("test", function(data) { value = data })
        var el = document.createElement("div")
        var evt = { currentTarget: Object.defineProperty(el, "test", { value: "foo" }) }
        handler(evt)
        assert.strictEqual(value, "foo")
    })

    QUnit.module("m.trust")
    test("value of", assert => {
        assert.strictEqual(m.trust("test").valueOf(), "test")
    })

    QUnit.module("m.prop")
    test("getter", assert => {
        var prop = m.prop("test")
        assert.strictEqual(prop(),"test")
    })
    test("setter", assert => {
        var prop = m.prop("test")
        prop("foo")
        assert.strictEqual(prop(), "foo")
    })
    test("stringify", assert => {
        var prop = m.prop("test")
        assert.strictEqual(JSON.stringify(prop), '"test"')
    })
    test("stringify obj", assert => {
        var obj = {prop: m.prop("test")}
        assert.strictEqual(JSON.stringify(obj), '{"prop":"test"}')
    })
    test("defer", assert => {
        var defer = m.deferred()
        var prop = m.prop(defer.promise)
        defer.resolve("test")
        assert.strictEqual(prop(), "test")
    })
    test("then", assert => {
        var defer = m.deferred()
        var prop = m.prop(defer.promise).then(function () {
            return "test2"
        })
        defer.resolve("test")
        assert.strictEqual(prop(), "test2")
    })
    test("null", assert => {
        var prop = m.prop(null)
        assert.strictEqual(prop(), null)
    })

    QUnit.module("m.deferred")
    test("resolve", assert => {
        var value: string
        var deferred = m.deferred<string>()
        deferred.promise.then<void>(function(data) {value = data})
        deferred.resolve("test")
        assert.strictEqual(value, "test")
    })
    test("changed by then", assert => {
        var value: string
        var deferred = m.deferred<string>()
        deferred.promise.then<string>(function(data) {return "foo"}).then<void>(function(data) {value = data})
        deferred.resolve("test")
        assert.strictEqual(value, "foo")
    })
    test("rejection callback", assert => {
        var value: string
        var deferred = m.deferred()
        deferred.promise.then(null, function(data) {value = data})
        deferred.reject("test")
        assert.strictEqual(value, "test")
    })
    test("rejection callback changed by then", assert => {
        var value: string
        var deferred = m.deferred<string>()
        deferred.promise.then<string>(null, function(data) {return "foo"}).then(function(data) {value = data})
        deferred.reject("test")
        assert.strictEqual(value, "foo")
    })
    test("error handling", assert => {
        var value1: number, value2: any
        var deferred = m.deferred()
        deferred.promise.then(function(data) {throw new Error}).then(function(data) {value1 = 1}, function(data) {value2 = data})
        deferred.resolve("test")
        assert.strictEqual(value1, undefined)
        assert.ok(value2 instanceof Error)
    })
    test("let unchecked exceptions bubbble up", assert => {
        //Let unchecked exceptions bubble up in order to allow meaningful error messages in common cases like null reference exceptions due to typos
        //An unchecked exception is defined as an object that is a subclass of Error (but not a direct instance of Error itself) - basically anything that can be thrown without an explicit `throw` keyword and that we'd never want to programmatically manipulate. In other words, an unchecked error is one where we only care about its line number and where the only reasonable way to deal with it is to change the buggy source code that caused the error to be thrown in the first place.
        //By contrast, a checked exception is defined as anything that is explicitly thrown via the `throw` keyword and that can be programmatically handled, for example to display a validation error message on the UI. If an exception is a subclass of Error for whatever reason, but it is meant to be handled as a checked exception (i.e. follow the rejection rules for A+), it can be rethrown as an instance of Error
        //This test tests two implementation details that differ from the Promises/A+ spec:
        //1) A+ requires the `then` callback to be called in a different event loop from the resolve call, i.e. it must be asynchronous (this requires a setImmediate polyfill, which cannot be implemented in a reasonable way for Mithril's purpose - the possible polyfills are either too big or too slow)
        //2) A+ swallows exceptions in a unrethrowable way, i.e. it's not possible to see default error messages on the console for runtime errors thrown from within a promise chain
        var value1: number, value2: string, value3: any, foo: any
        var deferred = m.deferred()
        try {
            deferred.promise
                .then(function(data) {foo["bar"]["baz"]}) //throws ReferenceError
                .then(function(data) {value1 = 1}, function(data) {value2 = data})
            deferred.resolve("test")
        }
        catch (e) {value3 = e}
        assert.strictEqual(value1, undefined)
        assert.strictEqual(value2, undefined)
        assert.ok(value3 instanceof ReferenceError || value3 instanceof TypeError)
    })
    test("returning another promise", assert => {
        var deferred1 = m.deferred<number>()
        var deferred2 = m.deferred<number>()
        var value1: number, value2: number
        deferred1.promise.then(function(data) {
            value1 = data
            return deferred2.promise
        }).then(function(data) {
            value2 = data
        })
        deferred1.resolve(1)
        deferred2.resolve(2)
        assert.strictEqual(value1, 1)
        assert.strictEqual(value2, 2)
    })
    test("already resolved promises", assert => {
        //https://github.com/lhorie/mithril.js/issues/80
        var deferred = m.deferred<number>(), value: number
        deferred.resolve(1)
        deferred.promise.then(function(data) {
            value = data
        })
        assert.strictEqual(value, 1)
    })
    test("already rejected promises", assert => {
        //https://github.com/lhorie/mithril.js/issues/80
        var deferred = m.deferred(), value: string
        deferred.reject(1)
        deferred.promise.then(null, function(data) {
            value = data
        })
        assert.strictEqual(value, 1)
    })
    test("already twice resolved promises", assert => {
        //https://github.com/lhorie/mithril.js/issues/80
        var deferred = m.deferred<number>(), value: number
        deferred.resolve(1)
        deferred.resolve(2)
        deferred.promise.then(function(data) {
            value = data
        })
        assert.strictEqual(value, 1)
    })
    test("twice resolved promises", assert => {
        //https://github.com/lhorie/mithril.js/issues/80
        var deferred = m.deferred<number>(), value: number
        deferred.promise.then(function(data) {
            value = data
        })
        deferred.resolve(1)
        deferred.resolve(2)
        assert.strictEqual(value, 1)
    })
    test("resolve then reject", assert => {
        //https://github.com/lhorie/mithril.js/issues/80
        var deferred = m.deferred<number>(), value1: number, value2: number
        deferred.promise.then(function(data) {
            value1 = data
        }, function(data) {
            value2 = data
        })
        deferred.resolve(1)
        deferred.reject(2)
        assert.strictEqual(value1, 1)
        assert.strictEqual(value2, undefined)
    })
    test("reject then resolve", assert => {
        //https://github.com/lhorie/mithril.js/issues/80
        var deferred = m.deferred<number>(), value1: number, value2: number
        deferred.promise.then(function(data) {
            value1 = data
        }, function(data) {
            value2 = data
        })
        deferred.reject(1)
        deferred.resolve(2)
        assert.strictEqual(value1, undefined)
        assert.strictEqual(value2, 1)
    })
    test("twice rejected", assert => {
        //https://github.com/lhorie/mithril.js/issues/80
        var deferred = m.deferred(), value: string
        deferred.promise.then(null, function(data) {
            value = data
        })
        deferred.reject(1)
        deferred.reject(2)
        assert.strictEqual(value, 1)
    })
    test("retroactive then with no resolve value", assert => {
        //https://github.com/lhorie/mithril.js/issues/85
        var deferred = m.deferred(), value: number
        deferred.resolve()
        deferred.promise.then(function(data) {
            value = 1
        })
        assert.strictEqual(value, 1)
    })
    test("retroactive then with no reject value", assert => {
        //https://github.com/lhorie/mithril.js/issues/85
        var deferred = m.deferred(), value: number
        deferred.reject()
        deferred.promise.then(null, function(data) {
            value = 1
        })
        assert.strictEqual(value, 1)
    })
    test("call to resolved promise", assert => {
        var deferred = m.deferred(), value: number
        deferred.resolve(1)
        assert.strictEqual(deferred.promise(), 1)
    })
    test("call to resolved and thenned promise", assert => {
        var deferred = m.deferred<number>(), value: number
        var promise = deferred.promise.then(function(data) {return data + 1})
        deferred.resolve(1)
        assert.strictEqual(promise(), 2)
    })
    test("call to rejected promise", assert => {
        var deferred = m.deferred(), value: number
        deferred.reject(1)
        assert.strictEqual(deferred.promise(), undefined)
    })

}(mock.window));

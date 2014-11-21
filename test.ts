/// <reference path="typings/tsd.d.ts" />
/// <reference path="mithril.d.ts" />
/// <reference path="mithril-mock.d.ts" />

interface TestCtrl extends Mithril.Controller {
    value?: string;
}
interface TestView {
    (ctrl: TestCtrl): string;
}

(function (mock: Mithril.MockWindow) {
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

	QUnit.module("m.render")
	test("text", assert => {
		var root = mock.document.createElement("div")
		m.render(root, "test")
		assert.strictEqual(root.childNodes[0].nodeValue,"test")
	})
	test("virtual element", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("div", {"class": "a"}))
		var elementBefore = root.childNodes[0]
		m.render(root, m("div", {"class": "b"}))
		var elementAfter = root.childNodes[0]
		assert.strictEqual(elementBefore, elementAfter)
	})
	test("virtual element (implicitly div)", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m(".a"))
		var elementBefore = root.childNodes[0]
		m.render(root, m(".b"))
		var elementAfter = root.childNodes[0]
		assert.strictEqual(elementBefore, elementAfter)
	})
	test("changing attributes", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("div", {id: "a"}))
		var elementBefore = root.childNodes[0]
		m.render(root, m("div", {title: "b"}))
		var elementAfter = root.childNodes[0]
		assert.notEqual(elementBefore, elementAfter)
	})
	test("changing attributes (css selectors)", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("#a"))
		var elementBefore = root.childNodes[0]
		m.render(root, m("[title=b]"))
		var elementAfter = root.childNodes[0]
		assert.notEqual(elementBefore, elementAfter)
	})
	test("changing inner html", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("#a"))
		var elementBefore = root.childNodes[0]
		m.render(root, "test")
		var elementAfter = root.childNodes[0]
		assert.notEqual(elementBefore, elementAfter)
	})
	test("undefined child nodes become blanks", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("div", [undefined]))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeValue, "")
	})
	test("svg g island", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("svg", [m("g")]))
		var g = root.childNodes[0].childNodes[0]
		assert.strictEqual(g.nodeName, "G")
        assert.strictEqual(g.namespaceURI, "http://www.w3.org/2000/svg")
	})
	test("svg with child link", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("svg", [m("a[href='http://google.com']")]))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeName, "A")
	})
	test("childnodes length", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("div.classname", [m("a", {href: "/first"})]))
		m.render(root, m("div", [m("a", {href: "/second"})]))
		assert.strictEqual(root.childNodes[0].childNodes.length, 1)
	})
	test("added undefined list item is blank", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li")]))
		m.render(root, m("ul", [m("li"), undefined]))
		assert.strictEqual(root.childNodes[0].childNodes[1].nodeValue, "")
	})
	test("blanking list item with undefined", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li"), m("li")]))
		m.render(root, m("ul", [m("li"), undefined]))
		assert.strictEqual(root.childNodes[0].childNodes.length, 2)
        assert.strictEqual(root.childNodes[0].childNodes[1].nodeValue, "")
	})
	test("blanking first list item with undefined", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li")]))
		m.render(root, m("ul", [undefined]))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeValue, "")
	})
	test("clearing list with empty object", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li")]))
		m.render(root, m("ul", [{}]))
		assert.strictEqual(root.childNodes[0].childNodes.length, 0)
	})
	test("replacing a li tag with a b tag", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li")]))
		m.render(root, m("ul", [{tag: "b", attrs: {}}]))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeName, "B")
	})
	test("replacing a li tag with a b tag (new String)", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li")]))
		m.render(root, m("ul", [{tag: new String("b"), attrs: {}}]))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeName, "B")
	})
	test("subtree retain", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li", [m("a")])]))
		m.render(root, m("ul", [{subtree: "retain"}]))
		assert.strictEqual(root.childNodes[0].childNodes[0].childNodes[0].nodeName, "A")
	})
	test("route config (twice)", assert => {
		//https://github.com/lhorie/mithril.js/issues/43
		var root = mock.document.createElement("div")
		m.render(root, m("a", {config: m.route}, "test"))
		m.render(root, m("a", {config: m.route}, "test"))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeValue, "test")
	})
	test("updating null to string", assert => {
		//https://github.com/lhorie/mithril.js/issues/44 (1)
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", [null, m("#bar")]))
		m.render(root, m("#foo", ["test", m("#bar")]))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeValue, "test")
	})
	test("updating null to virtual element", assert => {
		//https://github.com/lhorie/mithril.js/issues/44 (2)
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", [null, m("#bar")]))
		m.render(root, m("#foo", [m("div"), m("#bar")]))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeName, "DIV")
	})
	test("updating string to virtual element", assert => {
		//https://github.com/lhorie/mithril.js/issues/44 (3)
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", ["test", m("#bar")]))
		m.render(root, m("#foo", [m("div"), m("#bar")]))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeName, "DIV")
	})
	test("updating virtual element to string", assert => {
		//https://github.com/lhorie/mithril.js/issues/44 (4)
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", [m("div"), m("#bar")]))
		m.render(root, m("#foo", ["test", m("#bar")]))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeValue, "test")
	})
	test("adding 2nd child", assert => {
		//https://github.com/lhorie/mithril.js/issues/44 (5)
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", [m("#bar")]))
		m.render(root, m("#foo", [m("#bar"), [m("#baz")]]))
		assert.strictEqual((<HTMLDivElement>root.childNodes[0].childNodes[1]).id, "baz")
	})
	test("rendering document html #foo", assert => {
		//https://github.com/lhorie/mithril.js/issues/48
		var root = mock.document
		m.render(root, m("html", [m("#foo")]))
		var result = (<HTMLDivElement>root.childNodes[0].childNodes[0]).id === "foo"
		root.childNodes = [mock.document.createElement("html")]
		assert.ok(result)
	})
	test("adding class shouldn't change children", assert => {
		//https://github.com/lhorie/mithril.js/issues/49
		var root = mock.document.createElement("div")
		m.render(root, m("a", "test"))
		m.render(root, m("a.foo", "test"))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeValue, "test")
	})
	test("removing class shouldn't change children", assert => {
		//https://github.com/lhorie/mithril.js/issues/49
		var root = mock.document.createElement("div")
		m.render(root, m("a.foo", "test"))
		m.render(root, m("a", "test"))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeValue, "test")
	})
	test("removing class and changing children", assert => {
		//https://github.com/lhorie/mithril.js/issues/49
		var root = mock.document.createElement("div")
		m.render(root, m("a.foo", "test"))
		m.render(root, m("a", "test1"))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeValue, "test1")
	})
	test("changing children", assert => {
		//https://github.com/lhorie/mithril.js/issues/49
		var root = mock.document.createElement("div")
		m.render(root, m("a", "test"))
		m.render(root, m("a", "test1"))
		assert.strictEqual(root.childNodes[0].childNodes[0].nodeValue, "test1")
	})
	test("nested virtual elements", assert => {
		//https://github.com/lhorie/mithril.js/issues/50
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", [[m("div", "a"), m("div", "b")], m("#bar")]))
		assert.strictEqual(root.childNodes[0].childNodes[1].childNodes[0].nodeValue, "b")
	})
	test("updating nested virtual elements", assert => {
		//https://github.com/lhorie/mithril.js/issues/50
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", [[m("div", "a"), m("div", "b")], m("#bar")]))
		m.render(root, m("#foo", [[m("div", "a"), m("div", "b"), m("div", "c")], m("#bar")]))
		assert.strictEqual(root.childNodes[0].childNodes[2].childNodes[0].nodeValue, "c")
	})
	test("multiple nested virtual elements", assert => {
		//https://github.com/lhorie/mithril.js/issues/50
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", [[m("div", "a"), m("div", "b")], [m("div", "c"), m("div", "d")], m("#bar")]))
		assert.strictEqual(root.childNodes[0].childNodes[3].childNodes[0].nodeValue, "d" )
        assert.strictEqual((<HTMLDivElement>root.childNodes[0].childNodes[4]).id, "bar")
	})
	test("nested virtual elements and a raw string", assert => {
		//https://github.com/lhorie/mithril.js/issues/50
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", [[m("div", "a"), m("div", "b")], "test"]))
		assert.strictEqual(root.childNodes[0].childNodes[1].childNodes[0].nodeValue, "b" )
        assert.strictEqual(root.childNodes[0].childNodes[2].nodeValue, "test")
	})
	test("nested raw strings", assert => {
		//https://github.com/lhorie/mithril.js/issues/50
		var root = mock.document.createElement("div")
		m.render(root, m("#foo", [["a", "b"], "test"]))
		assert.strictEqual(root.childNodes[0].childNodes[1].nodeValue, "b" )
        assert.strictEqual(root.childNodes[0].childNodes[2].nodeValue, "test")
	})
	test("updating nested virtual elements tag", assert => {
		//https://github.com/lhorie/mithril.js/issues/51
		var root = mock.document.createElement("div")
		m.render(root, m("main", [m("button"), m("article", [m("section"), m("nav")])]))
		m.render(root, m("main", [m("button"), m("article", [m("span"), m("nav")])]))
		assert.strictEqual(root.childNodes[0].childNodes[1].childNodes[0].nodeName, "SPAN")
	})
	test("updating nested virtual element to string", assert => {
		//https://github.com/lhorie/mithril.js/issues/51
		var root = mock.document.createElement("div")
		m.render(root, m("main", [m("button"), m("article", [m("section"), m("nav")])]))
		m.render(root, m("main", [m("button"), m("article", ["test", m("nav")])]))
		assert.strictEqual(root.childNodes[0].childNodes[1].childNodes[0].nodeValue, "test")
	})
	test("updating nested virtual element to trusted string", assert => {
		//https://github.com/lhorie/mithril.js/issues/51
		var root = mock.document.createElement("div")
		m.render(root, m("main", [m("button"), m("article", [m("section"), m("nav")])]))
		m.render(root, m("main", [m("button"), m("article", [m.trust("test"), m("nav")])]))
		assert.strictEqual(root.childNodes[0].childNodes[1].childNodes[0].nodeValue, "test")
	})
	test("changing id", assert => {
		//https://github.com/lhorie/mithril.js/issues/55
		var root = mock.document.createElement("div")
		m.render(root, m("#a"))
		var elementBefore = root.childNodes[0]
		m.render(root, m("#b"))
		var elementAfter = root.childNodes[0]
		assert.notEqual(elementBefore, elementAfter)
	})
	test("removing null elements should not multiply", assert => {
		//https://github.com/lhorie/mithril.js/issues/56
		var root = mock.document.createElement("div")
		m.render(root, [null, "foo"])
		m.render(root, ["bar"])
		assert.strictEqual(root.childNodes.length, 1)
	})
	test("elements should not multiply", assert => {
		//https://github.com/lhorie/mithril.js/issues/56
		var root = mock.document.createElement("div")
		m.render(root, m("div", "foo"))
		assert.strictEqual(root.childNodes.length, 1)
	})
	test("updating virtual element to undefined should result in ''", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("div", [m("button"), m("ul")]))
		var valueBefore = root.childNodes[0].childNodes[0].nodeName
		m.render(root, m("div", [undefined, m("ul")]))
		var valueAfter = root.childNodes[0].childNodes[0].nodeValue
		assert.strictEqual(valueBefore, "BUTTON" )
        assert.strictEqual(valueAfter, "")
	})
	test("updating virtual element to undefined and back again", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("div", [m("ul"), undefined]))
		var valueBefore1 = root.childNodes[0].childNodes[0].nodeName
		var valueBefore2 = root.childNodes[0].childNodes[1].nodeValue
		m.render(root, m("div", [undefined, m("ul")]))
		var valueAfter1 = root.childNodes[0].childNodes[0].nodeValue
		var valueAfter2 = root.childNodes[0].childNodes[1].nodeName
		assert.strictEqual(valueBefore1, "UL" )
        assert.strictEqual(valueAfter1, "" )
        assert.strictEqual(valueBefore2, "" )
        assert.strictEqual(valueAfter2, "UL")
	})
	test("updating style value to empty object should clear style", assert => {
		//https://github.com/lhorie/mithril.js/issues/79
		var root = mock.document.createElement("div")
		m.render(root, m("div", {style: {background: "red"}}))
		var valueBefore = (<HTMLDivElement>root.childNodes[0]).style.background
		m.render(root, m("div", {style: {}}))
		var valueAfter = (<HTMLDivElement>root.childNodes[0]).style.background
		assert.strictEqual(valueBefore, "red" )
        assert.strictEqual(valueAfter, "")
	})
	test("style=... css selector", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("div[style='background:red']"))
		assert.strictEqual((<HTMLDivElement>root.childNodes[0]).style, "background:red")
	})
	test("replacing style with empty object should clear style", assert => {
		var root = mock.document.createElement("div")
		m.render(root, m("div", {style: {background: "red"}}))
		var valueBefore = (<HTMLDivElement>root.childNodes[0]).style.background
		m.render(root, m("div", {}))
		var valueAfter = (<HTMLDivElement>root.childNodes[0]).style.background
		assert.strictEqual(valueBefore, "red" )
        assert.strictEqual(valueAfter, undefined)
	})
/*
	test("name me", assert => {
		var root = mock.document.createElement("div")
		var module = {}, unloaded = false
		module.controller = function() {
			this.onunload = function() {unloaded = true}
		}
		module.view = function() {}
		m.module(root, module)
		m.module(root, {controller: function() {}, view: function() {}})
		return unloaded === true
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/87
		var root = mock.document.createElement("div")
		m.render(root, m("div", [[m("a"), m("a")], m("button")]))
		m.render(root, m("div", [[m("a")], m("button")]))
		return root.childNodes[0].childNodes.length == 2 && root.childNodes[0].childNodes[1].nodeName == "BUTTON"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/87
		var root = mock.document.createElement("div")
		m.render(root, m("div", [m("a"), m("b"), m("button")]))
		m.render(root, m("div", [m("a"), m("button")]))
		return root.childNodes[0].childNodes.length == 2 && root.childNodes[0].childNodes[1].nodeName == "BUTTON"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/99
		var root = mock.document.createElement("div")
		m.render(root, m("div", [m("img"), m("h1")]))
		m.render(root, m("div", [m("a")]))
		return root.childNodes[0].childNodes.length == 1 && root.childNodes[0].childNodes[0].nodeName == "A"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/120
		var root = mock.document.createElement("div")
		m.render(root, m("div", ["a", "b", "c", "d"]))
		m.render(root, m("div", [["d", "e"]]))
		var children = root.childNodes[0].childNodes
		return children.length == 2 && children[0].nodeValue == "d" && children[1].nodeValue == "e"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/120
		var root = mock.document.createElement("div")
		m.render(root, m("div", [["a", "b", "c", "d"]]))
		m.render(root, m("div", ["d", "e"]))
		var children = root.childNodes[0].childNodes
		return children.length == 2 && children[0].nodeValue == "d" && children[1].nodeValue == "e"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/120
		var root = mock.document.createElement("div")
		m.render(root, m("div", ["x", [["a"], "b", "c", "d"]]))
		m.render(root, m("div", ["d", ["e"]]))
		var children = root.childNodes[0].childNodes
		return children.length == 2 && children[0].nodeValue == "d" && children[1].nodeValue == "e"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/120
		var root = mock.document.createElement("div")
		m.render(root, m("div", ["b"]))
		m.render(root, m("div", [["e"]]))
		var children = root.childNodes[0].childNodes
		return children.length == 1 && children[0].nodeValue == "e"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/120
		var root = mock.document.createElement("div")
		m.render(root, m("div", ["a", ["b"]]))
		m.render(root, m("div", ["d", [["e"]]]))
		var children = root.childNodes[0].childNodes
		return children.length == 2 && children[0].nodeValue == "d" && children[1].nodeValue == "e"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/120
		var root = mock.document.createElement("div")
		m.render(root, m("div", ["a", [["b"]]]))
		m.render(root, m("div", ["d", ["e"]]))
		var children = root.childNodes[0].childNodes
		return children.length == 2 && children[0].nodeValue == "d" && children[1].nodeValue == "e"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/120
		var root = mock.document.createElement("div")
		m.render(root, m("div", ["a", [["b"], "c"]]))
		m.render(root, m("div", ["d", [[["e"]], "x"]]))
		var children = root.childNodes[0].childNodes
		return children.length == 3 && children[0].nodeValue == "d" && children[1].nodeValue == "e"
	})
	test("name me", assert => {
		var root = mock.document.createElement("div")

		var success = false
		m.render(root, m("div", {config: function(elem, isInitialized, ctx) {ctx.data = 1}}))
		m.render(root, m("div", {config: function(elem, isInitialized, ctx) {success = ctx.data === 1}}))
		return success
	})
	test("name me", assert => {
		var root = mock.document.createElement("div")

		var index = 0;
		var success = true;
		var statefulConfig = function(elem, isInitialized, ctx) {ctx.data = index++}
		var node = m("div", {config: statefulConfig});
		m.render(root, [node, node]);

		index = 0;
		var checkConfig = function(elem, isInitialized, ctx) {
			success = success && (ctx.data === index++)
		}
		node = m("div", {config: checkConfig});
		m.render(root, [node, node]);
		return success;
	})
	test("name me", assert => {
		var root = mock.document.createElement("div")
		var parent
		m.render(root, m("div", m("a", {
			config: function(el) {parent = el.parentNode.parentNode}
		})));
		return parent === root
	})
	test("name me", assert => {
		var root = mock.document.createElement("div")
		var count = 0
		m.render(root, m("div", m("a", {
			config: function(el) {
				var island = mock.document.createElement("div")
				count++
				if (count > 2) throw "too much recursion..."
				m.render(island, m("div"))
			}
		})));
		return count == 1
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/129
		var root = mock.document.createElement("div")
		m.render(root, m("div", [["foo", "bar"], ["foo", "bar"], ["foo", "bar"]]));
		m.render(root, m("div", ["asdf", "asdf2", "asdf3"]));
		return true
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/98
		//insert at beginning
		var root = mock.document.createElement("div")
		m.render(root, [m("a", {key: 1}), m("a", {key: 2}), m("a", {key: 3})])
		var firstBefore = root.childNodes[0]
		m.render(root, [m("a", {key: 4}), m("a", {key: 1}), m("a", {key: 2}), m("a", {key: 3})])
		var firstAfter = root.childNodes[1]
		return firstBefore == firstAfter && root.childNodes[0].key == 4 && root.childNodes.length == 4
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/98
		var root = mock.document.createElement("div")
		m.render(root, [m("a", {key: 1}), m("a", {key: 2}), m("a", {key: 3})])
		var firstBefore = root.childNodes[0]
		m.render(root, [m("a", {key: 4}), m("a", {key: 1}), m("a", {key: 2})])
		var firstAfter = root.childNodes[1]
		return firstBefore == firstAfter && root.childNodes[0].key == 4 && root.childNodes.length == 3
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/98
		var root = mock.document.createElement("div")
		m.render(root, [m("a", {key: 1}), m("a", {key: 2}), m("a", {key: 3})])
		var firstBefore = root.childNodes[1]
		m.render(root, [m("a", {key: 2}), m("a", {key: 3}), m("a", {key: 4})])
		var firstAfter = root.childNodes[0]
		return firstBefore == firstAfter && root.childNodes[0].key === "2" && root.childNodes.length === 3
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/98
		var root = mock.document.createElement("div")
		m.render(root, [m("a", {key: 1}), m("a", {key: 2}), m("a", {key: 3}), m("a", {key: 4}), m("a", {key: 5})])
		var firstBefore = root.childNodes[0]
		var secondBefore = root.childNodes[1]
		var fourthBefore = root.childNodes[3]
		m.render(root, [m("a", {key: 4}), m("a", {key: 10}), m("a", {key: 1}), m("a", {key: 2})])
		var firstAfter = root.childNodes[2]
		var secondAfter = root.childNodes[3]
		var fourthAfter = root.childNodes[0]
		return firstBefore === firstAfter && secondBefore === secondAfter && fourthBefore === fourthAfter && root.childNodes[1].key == "10" && root.childNodes.length === 4
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/98
		var root = mock.document.createElement("div")
		m.render(root, [m("a", {key: 1}), m("a", {key: 2}), m("a", {key: 3}), m("a", {key: 4}), m("a", {key: 5})])
		var firstBefore = root.childNodes[0]
		var secondBefore = root.childNodes[1]
		var fourthBefore = root.childNodes[3]
		m.render(root, [m("a", {key: 4}), m("a", {key: 10}), m("a", {key: 2}), m("a", {key: 1}), m("a", {key: 6}), m("a", {key: 7})])
		var firstAfter = root.childNodes[3]
		var secondAfter = root.childNodes[2]
		var fourthAfter = root.childNodes[0]
		return firstBefore === firstAfter && secondBefore === secondAfter && fourthBefore === fourthAfter && root.childNodes[1].key == "10" && root.childNodes[4].key == "6" && root.childNodes[5].key == "7" && root.childNodes.length === 6
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/149
		var root = mock.document.createElement("div")
		m.render(root, [m("a", {key: 1}), m("a", {key: 2}), m("a"), m("a", {key: 4}), m("a", {key: 5})])
		var firstBefore = root.childNodes[0]
		var secondBefore = root.childNodes[1]
		var thirdBefore = root.childNodes[2]
		var fourthBefore = root.childNodes[3]
		var fifthBefore = root.childNodes[4]
		m.render(root, [m("a", {key: 4}), m("a", {key: 5}), m("a"), m("a", {key: 1}), m("a", {key: 2})])
		var firstAfter = root.childNodes[3]
		var secondAfter = root.childNodes[4]
		var thirdAfter = root.childNodes[2]
		var fourthAfter = root.childNodes[0]
		var fifthAfter = root.childNodes[1]
		return firstBefore === firstAfter && secondBefore === secondAfter && thirdBefore === thirdAfter && fourthBefore === fourthAfter && fifthBefore === fifthAfter
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/246
		//insert at beginning with non-keyed in the middle
		var root = mock.document.createElement("div")
		m.render(root, [m("a", {key: 1})])
		var firstBefore = root.childNodes[0]
		m.render(root, [m("a", {key: 2}), m("br"), m("a", {key: 1})])
		var firstAfter = root.childNodes[2]
		return firstBefore == firstAfter && root.childNodes[0].key == 2 && root.childNodes.length == 3
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/134
		var root = mock.document.createElement("div")
		m.render(root, m("div", {contenteditable: true}, "test"))
		mock.document.activeElement = root.childNodes[0]
		m.render(root, m("div", {contenteditable: true}, "test1"))
		m.render(root, m("div", {contenteditable: false}, "test2"))
		return root.childNodes[0].childNodes[0].nodeValue === "test2"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/136
		var root = mock.document.createElement("div")
		m.render(root, m("textarea", ["test"]))
		m.render(root, m("textarea", ["test1"]))
		return root.childNodes[0].value === "test1"
	})
	test("name me", assert => {
		var root = mock.document.createElement("div")
		var unloaded = 0
		m.render(root, [
			m("div", {
				key: 1,
				config: function(el, init, ctx) {
					ctx.onunload = function() {
						unloaded++
					}
				}
			})
		])
		m.render(root, [
			m("div", {key: 2}),
			m("div", {
				key: 1,
				config: function(el, init, ctx) {
					ctx.onunload = function() {
						unloaded++
					}
				}
			})
		])
		return unloaded == 0
	})
	test("name me", assert => {
		var root = mock.document.createElement("div")
		var unloadedParent = 0
		var unloadedChild = 0
		var configParent = function(el, init, ctx) {
			ctx.onunload = function() {
				unloadedParent++
			}
		}
		var configChild = function(el, init, ctx) {
			ctx.onunload = function() {
				unloadedChild++
			}
		}
		var unloaded = 0
		m.render(root, m("div", {config: configParent}, m("a", {config: configChild})))
		m.render(root, m("main", {config: configParent}, m("a", {config: configChild})))
		return unloadedParent === 1 && unloadedChild === 0
	})
	test("name me", assert => {
		var root = mock.document.createElement("div")
		var unloadedParent = 0
		var unloadedChild = 0
		var configParent = function(el, init, ctx) {
			ctx.onunload = function() {
				unloadedParent++
			}
		}
		var configChild = function(el, init, ctx) {
			ctx.onunload = function() {
				unloadedChild++
			}
		}
		var unloaded = 0
		m.render(root, m("div", {config: configParent}, m("a", {config: configChild})))
		m.render(root, m("main", {config: configParent}, m("b", {config: configChild})))
		return unloadedParent === 1 && unloadedChild === 1
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/150
		var root = mock.document.createElement("div")
		m.render(root, [m("a"), m("div")])
		m.render(root, [[], m("div")])
		return root.childNodes.length == 1 && root.childNodes[0].nodeName == "DIV"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/156
		var root = mock.document.createElement("div")
		m.render(root, m("div", [
			["a", "b", "c", "d"].map(function() {
				return [m("div"), " "]
			}),
			m("span")
		]))
		return root.childNodes[0].childNodes[8].nodeName == "SPAN"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/157
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li", {key: 0}), m("li", {key: 2}), m("li", {key: 4})]))
		m.render(root, m("ul", [m("li", {key: 0}), m("li", {key: 1}), m("li", {key: 2}), m("li", {key: 3}), m("li", {key: 4}), m("li", {key: 5})]))
		return root.childNodes[0].childNodes.map(function(n) {return n.key}).join("") == "012345"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/157
		var root = mock.document.createElement("div")
		m.render(root, m("input", {value: "a"}))
		m.render(root, m("input", {value: "aa"}))
		return root.childNodes[0].childNodes.length == 0
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/157
		var root = mock.document.createElement("div")
		m.render(root, m("br", {"class": "a"}))
		m.render(root, m("br", {"class": "aa"}))
		return root.childNodes[0].childNodes.length == 0
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/194
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li", {key: 0}), m("li", {key: 1}), m("li", {key: 2}), m("li", {key: 3}), m("li", {key: 4}), m("li", {key: 5})]))
		m.render(root, m("ul", [m("li", {key: 0}), m("li", {key: 1}), m("li", {key: 2}), m("li", {key: 4}), m("li", {key: 5})]))
		return root.childNodes[0].childNodes.map(function(n) {return n.key}).join("") == "01245"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/194
		var root = mock.document.createElement("div")
		m.render(root, m("ul", [m("li", {key: 0}), m("li", {key: 1}), m("li", {key: 2}), m("li", {key: 3}), m("li", {key: 4}), m("li", {key: 5})]))
		m.render(root, m("ul", [m("li", {key: 1}), m("li", {key: 2}), m("li", {key: 3}), m("li", {key: 4}), m("li", {key: 5}), m("li", {key: 6})]))
		m.render(root, m("ul", [m("li", {key: 12}), m("li", {key: 13}), m("li", {key: 14}), m("li", {key: 15}), m("li", {key: 16}), m("li", {key: 17})]))
		return root.childNodes[0].childNodes.map(function(n) {return n.key}).join(",") == "12,13,14,15,16,17"
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/206
		var root = mock.document.createElement("div")
		m.render(root, m("div", undefined))
		m.render(root, m("div", [m("div")]))
		return root.childNodes[0].childNodes.length == 1
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/206
		var root = mock.document.createElement("div")
		m.render(root, m("div", null))
		m.render(root, m("div", [m("div")]))
		return root.childNodes[0].childNodes.length == 1
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/200
		var root = mock.document.createElement("div")

		var unloaded1 = false
		function unloadable1(element, isInit, context) {
			context.onunload = function() {
				unloaded1 = true
			}
		}
		m.render(root, [ m("div", {config: unloadable1}) ])
		m.render(root, [ ])

		var unloaded2 = false
		function unloadable2(element, isInit, context) {
			context.onunload = function() {
				unloaded2 = true
			}
		}
		m.render(root, [ m("div", {config: unloadable2}) ])
		m.render(root, [ ])

		return unloaded1 === true && unloaded2 === true
	})
	test("name me", assert => {
		var root = mock.document.createElement("div")
		m.render(root, [m("div.blue")])
		m.render(root, [m("div.green", [m("div")]), m("div.blue")])
		return root.childNodes.length == 2
	})
	test("name me", assert => {
		//https://github.com/lhorie/mithril.js/issues/277
		var root = mock.document.createElement("div")
		function Field() {
			this.tag = "div";
			this.attrs = {};
			this.children = "hello";
		}
		m.render(root, new Field())
		return root.childNodes.length == 1
	})
	test("name me", assert => {
		var root = mock.document.createElement("div")
		m.render(root, {foo: 123})
		return root.childNodes.length == 0
	})
*/

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

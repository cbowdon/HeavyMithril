/// <reference path="typings/tsd.d.ts" />
/// <reference path="mithril.d.ts" />

// m.prop
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
    var prop = m.prop(defer.promise);

    prop.then(function () {
        return "test2"
    })
    defer.resolve("test")
    assert.strictEqual(prop(), "test2")
})
test("null", assert => {
    var prop = m.prop(null)
    assert.strictEqual(prop(), null)
})

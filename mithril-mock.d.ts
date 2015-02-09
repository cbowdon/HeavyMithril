// For test suite

interface MithrilMock {
    window: MithrilMockWindow;
}

interface MithrilMockWindow extends Window {
    [id: string]: any;
    requestAnimationFrame: RequestAnimationFrame;
    XMLHttpRequest: XMLHttpRequest;
}

interface RequestAnimationFrame {
    (callback: FrameRequestCallback): number;
    $resolve(): void;
}

// Extend array to allow use as literal for NodeList
interface Array<T> {
    item(n: number): T;
}

interface XMLHttpRequest {
    $instances: XMLHttpRequest[];
    $headers: { [id: string]: string };
}

declare var mock: MithrilMock;

declare module 'mithril-mock' {
    var mithrilMock: MithrilMock;
    export = mithrilMock;
}

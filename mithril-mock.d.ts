// For test suite
interface MithrilMock extends Window {
    requestAnimationFrame: RequestAnimationFrame;
}

interface RequestAnimationFrame {
    (callback: FrameRequestCallback): number;
    $resolve(): void;
}

declare var mock: MithrilMock;

declare module 'mithril-mock' {
    export = MithrilMock;
}

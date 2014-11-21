// For test suite
interface MithrilMock {
    window: MithrilWindow;
}

interface MithrilWindow extends Window {
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

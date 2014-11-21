// For test suite

declare module Mithril {

  interface Mock {
      window: MockWindow;
  }

  interface MockWindow extends Window {
      requestAnimationFrame: RequestAnimationFrame;
  }

  interface RequestAnimationFrame {
      (callback: FrameRequestCallback): number;
      $resolve(): void;
  }

}

declare var mock: Mithril.Mock;

declare module 'mithril-mock' {
    var mithrilMock: Mithril.Mock;
    export = mithrilMock;
}

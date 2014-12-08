// For test suite

declare module Mithril {

  interface Mock {
      window: MockWindow;
  }

  interface MockWindow extends Window {
      requestAnimationFrame: RequestAnimationFrame;
      XMLHttpRequest: XMLHttpRequest;
  }

  interface RequestAnimationFrame {
      (callback: FrameRequestCallback): number;
      $resolve(): void;
  }
}

// Extend array to allow use as literal for NodeList
interface Array<T> {
    item(n: number): T;
}

interface XMLHttpRequest {
    $instances: XMLHttpRequest[];
    $headers: { [id: string]: string };
}

declare var mock: Mithril.Mock;

declare module 'mithril-mock' {
    var mithrilMock: Mithril.Mock;
    export = mithrilMock;
}

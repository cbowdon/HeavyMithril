//Mithril type definitions for Typescript

interface MithrilStatic {

    // children is string, virtual element, or an array of either. Roll on union types...
    (selector: string, attributes: MithrilAttributes, ...children: Array<string|MithrilVirtualElement>): MithrilVirtualElement;
    (selector: string, ...children: Array<string|MithrilVirtualElement>): MithrilVirtualElement;

    prop<T>(promise: MithrilPromise<T>) : MithrilPromiseProperty<T>;
    prop<T>(value: T): MithrilProperty<T>;
    // might be that this should be Property<any>
    prop(): MithrilProperty<Object>;

    withAttr(property: string, callback: (value: any) => void): (e: MithrilEvent) => any;

    module<T extends MithrilController>(rootElement: Node, module: MithrilModule<T>): T;

    trust(html: string): string;

    render(rootElement: Element|HTMLDocument): void;
    render(rootElement: Element|HTMLDocument, children: MithrilVirtualElement, forceRecreation?: boolean): void;
    render(rootElement: Element|HTMLDocument, children: MithrilVirtualElement[], forceRecreation?: boolean): void;

    redraw: MithrilRedrawStatic;

    request<T>(options: MithrilXHROptions): MithrilPromise<T>;

    route: MithrilRouteStatic;

    deferred: MithrilDeferredStatic;

    sync<T>(promises: MithrilPromise<T>[]): MithrilPromise<T[]>;

    startComputation(): void;

    endComputation(): void;

    // For test suite
    deps: MithrilDepsStatic;
}

interface MithrilDeferred<T> {
    resolve(value?: T): void;
    reject(value?: any): void;
    promise: MithrilPromise<T>;
}

interface MithrilDeferredStatic {
    onerror(e: Error): void;
    <T>(): MithrilDeferred<T>;
}

interface MithrilSuccessCallback<T, U> {
    (value: T): U;
    (value: T): MithrilPromise<U>;
}

interface MithrilErrorCallback<U> {
    (value: Error): U;
    (value: string): U;
}

interface MithrilPromise<T> {
    (): T;
    (value: T): T;
    then<U>(success: (value: T) => U): MithrilPromise<U>;
    then<U>(success: (value: T) => MithrilPromise<U>): MithrilPromise<U>;
    then<U,V>(success: (value: T) => U, error: (value: Error) => V): MithrilPromise<U>|MithrilPromise<V>;
    then<U,V>(success: (value: T) => MithrilPromise<U>, error: (value: Error) => V): MithrilPromise<U>|MithrilPromise<V>;
}

interface MithrilProperty<T> {
    (): T;
    (value: T): T;
    toJSON(): T;
}

interface MithrilPromiseProperty<T> extends MithrilPromise<T> {
    (): T;
    (value: T): T;
    toJSON(): T;
}

interface MithrilVirtualElement {
    key?: number;
    tag?: string;
    attrs?: MithrilAttributes;
    children?: any[];
}

interface MithrilElementConfig {
    (element: Element, isInitialized: boolean, context?: any): void;
}

// Attributes on a virtual element
interface MithrilAttributes {
    title?: string;
    className?: string;
    class?: string;
    config?: MithrilElementConfig;
}

// Defines the subset of Event that Mithril needs
interface MithrilEvent {
    currentTarget: Element;
}

interface MithrilController {
    (): any;
    onunload?(evt: Event): any;
}

interface MithrilView<T extends MithrilController> {
    (ctrl: T): any; // string | VirtualElement
}

interface MithrilModule<T extends MithrilController> {
    controller: T;
    view: MithrilView<T>;
}

interface MithrilRoutes<T extends MithrilController> {
    [key: string]: MithrilModule<T>;
}

interface MithrilRouteStatic {
    <T extends MithrilController>(rootElement: HTMLDocument, defaultRoute: string, routes: MithrilRoutes<T>): void;
    <T extends MithrilController>(rootElement: Element, defaultRoute: string, routes: MithrilRoutes<T>): void;

    (path: string, params?: any, shouldReplaceHistory?: boolean): void;
    (): string;
    (element: Element, isInitialized: boolean): void;

    mode: string;
    param(key: string): any;
}

interface MithrilRedrawStatic {
    (force?: boolean): void;
    strategy: MithrilProperty<string>;
}

interface MithrilXHROptions {
    method?: string;
    url: string;
    user?: string;
    password?: string;
    data?: any;
    background?: boolean;
    unwrapSuccess?(data: any): any;
    unwrapError?(data: any): any;
    serialize?(dataToSerialize: any): string;
    deserialize?(dataToDeserialize: string): any;
    extract?(xhr: XMLHttpRequest, options: MithrilXHROptions): string;
    type?(data: Object): void;
    config?(xhr: XMLHttpRequest, options: MithrilXHROptions): XMLHttpRequest;
    dataType?: string;
}

interface MithrilDepsStatic {
    (mockWindow: Window): Window;
    factory: Object; // what is this?
}

declare var Mithril: MithrilStatic;
declare var m: MithrilStatic;

declare module 'mithril' {
    export = m;
}

//Mithril type definitions for Typescript

// TODO unghost these when done
declare module Mithril {

    interface Static {

        // children is string, virtual element, or an array of either. Roll on union types...
        (selector: string, attributes: Attributes, ...children: Array<string|VirtualElement>): VirtualElement;
        (selector: string, ...children: Array<string|VirtualElement>): VirtualElement;

        prop<T>(promise: Promise<T>) : PromiseProperty<T>;
        prop<T>(value: T): Property<T>;
        // might be that this should be Property<any>
        prop(): Property<Object>;

        withAttr(property: string, callback: (value: any) => void): (e: Event) => any;

        module<T extends Controller>(rootElement: Node, module: Module<T>): T;

        trust(html: string): string;

        render(rootElement: Element|HTMLDocument): void;
        render(rootElement: Element|HTMLDocument, children: VirtualElement, forceRecreation?: boolean): void;
        render(rootElement: Element|HTMLDocument, children: VirtualElement[], forceRecreation?: boolean): void;

        redraw: RedrawStatic;

        request<T>(options: XHROptions): Promise<T>;

        route: RouteStatic;

        deferred: DeferredStatic;

        sync<T>(promises: Promise<T>[]): Promise<T>;

        startComputation(): void;

        endComputation(): void;

        // For test suite
        deps: DepsStatic;
    }

    interface Deferred<T> {
        resolve(value?: T): void;
        reject(value?: any): void;
        promise: Promise<T>;
    }

    interface DeferredStatic {
        onerror(e: Error): void;
        <T>(): Deferred<T>;
    }

    interface SuccessCallback<T, U> {
        (value: T): U;
        (value: T): Promise<U>;
    }

    interface ErrorCallback<U> {
        (value: Error): U;
        (value: string): U;
    }

    interface Promise<T> {
        (): T;
        (value: T): T;
        then<U>(success: (value: T) => U): Promise<U>;
        then<U>(success: (value: T) => Promise<U>): Promise<U>;
        then<U,V>(success: (value: T) => U, error: (value: Error) => V): Promise<U>|Promise<V>;
        then<U,V>(success: (value: T) => Promise<U>, error: (value: Error) => V): Promise<U>|Promise<V>;
    }

    interface Property<T> {
        (): T;
        (value: T): T;
        toJSON(): T;
    }

    interface PromiseProperty<T> extends Promise<T> {
        (): T;
        (value: T): T;
        toJSON(): T;
    }

    interface VirtualElement {
        key?: number;
        tag?: string;
        attrs?: Attributes;
        children?: any[];
    }

    interface ElementConfig {
        (element: Element, isInitialized: boolean, context?: any): void;
    }

    // Attributes on a virtual element
    interface Attributes {
        title?: string;
        className?: string;
        class?: string;
        config?: ElementConfig;
    }

    // Defines the subset of Event that Mithril needs
    interface Event {
        currentTarget: Element;
    }

    interface Controller {
        (): any;
        onunload?(evt: Event): any;
    }

    interface View<T extends Controller> {
        (ctrl: T): any; // string | VirtualElement
    }

    interface Module<T extends Controller> {
        controller: T;
        view: View<T>;
    }

    interface Routes<T extends Controller> {
        [key: string]: Module<T>;
    }

    interface RouteStatic {
        <T extends Controller>(rootElement: HTMLDocument, defaultRoute: string, routes: Routes<T>): void;
        <T extends Controller>(rootElement: Element, defaultRoute: string, routes: Routes<T>): void;

        (path: string, params?: any, shouldReplaceHistory?: boolean): void;
        (): string;
        (element: Element, isInitialized: boolean): void;

        mode: string;
        param(key: string): any;
    }

    interface RedrawStatic {
        (force?: boolean): void;
        strategy: Property<string>;
    }

    interface XHROptions {
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
        extract?(xhr: XMLHttpRequest, options: XHROptions): string;
        type?(data: Object): void;
        config?(xhr: XMLHttpRequest, options: XHROptions): XMLHttpRequest;
        dataType?: string;
    }

    interface DepsStatic {
        (mockWindow: Window): Window;
        factory: Object; // what is this?
    }
}

declare var Mithril: Mithril.Static;
declare var m: Mithril.Static;

declare module 'mithril' {
    export = m;
}

//Mithril type definitions for Typescript

declare module Mithril {

    interface Static {
        // From app code, I think children is expected to be either string[] (content of divs) or VirtualElement[]
        // however one of the tests says about that param "as long as it doesn't throw errors, it's fine"
        // which would imply any[] is acceptable
        (selector: string, attributes: Attributes, ...children: any[]): VirtualElement;
        (selector: string, ...children: any[]): VirtualElement;

        prop<T>(promise: Promise<T>) : PromiseProperty<T>;
        prop<T>(value?: T): Property<T>;

        withAttr(property: string, callback: (value: any) => void): (e: Event) => any;

        module<T extends Controller>(rootElement: Node, module: Module<T>): T;

        trust(html: string): string;

        render(rootElement: Element, children?: any): void;
        render(rootElement: HTMLDocument, children?: any): void;

        redraw(): void;

        route<T extends Controller>(rootElement: Element, defaultRoute: string, routes: { [key: string]: Module<T> }): void;
        route<T extends Controller>(rootElement: HTMLDocument, defaultRoute: string, routes: { [key: string]: Module<T> }): void;
        route(path: string, params?: any, shouldReplaceHistory?: boolean): void;
        route(): string;
        route(element: Element, isInitialized: boolean): void;

        request<T>(options: XHROptions): Promise<T>;

        deferred: DeferredStatic;

        sync<T>(promises: Promise<T>[]): Promise<T>;

        startComputation(): void;

        endComputation(): void;

        // For test suite
        deps(mockWindow: Window): Window;
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

    interface Promise<T> {
        (value?: T): T;
        then<U>(successCallback: (value: T) => Promise<U>, errorCallback?: (value: any) => any): Promise<U>;
        then<U>(successCallback: (value: T) => U, errorCallback?: (value: any) => any): Promise<U>;
    }

    interface Property<T> {
        (value?: T): T;
        toJSON(): T;
    }

    interface PromiseProperty<T> extends Property<Promise<T>>, Promise<T> {
    }

    interface VirtualElement {
        tag: string;
        attrs: Attributes;
        children: any[];
    }

    // Attributes on a virtual element
    interface Attributes {
        [id: string]: string;
        title?: string;
        className?: string;
    }

    // Defines the subset of Event that  needs
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

    interface XHROptions {
        method: string;
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
    }

}

declare var Mithril: Mithril.Static;
declare var m: Mithril.Static;

declare module 'mithril' {
    export = m;
}

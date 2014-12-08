//Mithril type definitions for Typescript

// TODO unghost these when done
declare module Mithril {

    interface Static {
        (selector: string, attributes: Attributes, ...children: any[]): VirtualElement;
        (selector: string, ...children: any[]): VirtualElement;
        route: RouteStatic;
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
        // Returning 'any' not quite correct (should be void)
        // but this resolves TS2088: lacks call signature
        <T extends Controller>(rootElement: HTMLDocument, defaultRoute: string, routes: Routes<T>): void;
        <T extends Controller>(rootElement: Element, defaultRoute: string, routes: Routes<T>): void;

        (path: string, params?: any, shouldReplaceHistory?: boolean): void;
        (): string;
        (element: Element, isInitialized: boolean): void;

        mode: string;
        param(key: string): any;
    }
}

declare var Mithril: Mithril.Static;
declare var m: Mithril.Static;

declare module 'mithril' {
    export = m;
}

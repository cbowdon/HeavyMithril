//Mithril type definitions for Typescript

//TODO interfaces module, get rid of Mithril prefixes everywhere

interface MithrilStatic {
    // From app code, I think children is expected to be either string[] (content of divs) or MithrilVirtualElement[]
    // however one of the tests says about that param "as long as it doesn't throw errors, it's fine"
    // which would imply any[] is acceptable
	(selector: string, attributes: MithrilAttributes, ...children: any[]): MithrilVirtualElement;
	(selector: string, ...children: any[]): MithrilVirtualElement;

    prop<T>(promise: MithrilPromise<T>) : MithrilPromiseProperty<T>;
	prop<T>(value?: T): MithrilProperty<T>;

	withAttr(property: string, callback: (value: any) => void): (e: MithrilEvent) => any;

	module<TCtrl, TView>(rootElement: Node, module: MithrilModule<TCtrl, TView>): TCtrl;

	trust(html: string): string;

	render(rootElement: Element, children?: any): void;
	render(rootElement: HTMLDocument, children?: any): void;

	redraw(): void;

	route<TCtrl, TView>(rootElement: Element, defaultRoute: string, routes: { [key: string]: MithrilModule<TCtrl, TView> }): void;
	route<TCtrl, TView>(rootElement: HTMLDocument, defaultRoute: string, routes: { [key: string]: MithrilModule<TCtrl, TView> }): void;
	route(path: string, params?: any, shouldReplaceHistory?: boolean): void;
	route(): string;
	route(element: Element, isInitialized: boolean): void;

	request<T>(options: MithrilXHROptions): MithrilPromise<T>;

	deferred: MithrilDeferredStatic;

	sync<T>(promises: MithrilPromise<T>[]): MithrilPromise<T>;

	startComputation(): void;

	endComputation(): void;

    // For test suite
	deps(mockWindow: Window): Window;
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

interface MithrilPromise<T> {
	(value?: T): T;
	then<U>(successCallback: (value: T) => MithrilPromise<U>, errorCallback?: (value: any) => any): MithrilPromise<U>;
	then<U>(successCallback: (value: T) => U, errorCallback?: (value: any) => any): MithrilPromise<U>;
}

interface MithrilProperty<T> {
    (value?: T): T;
    toJSON(): T;
}

interface MithrilPromiseProperty<T> extends MithrilProperty<MithrilPromise<T>>, MithrilPromise<T> {
}

interface MithrilVirtualElement {
	tag: string;
	attrs: MithrilAttributes;
	children: any[];
}

// Attributes on a virtual element
interface MithrilAttributes {
    [id: string]: string;
    title?: string;
    className?: string;
}

// Defines the subset of Event that Mithril needs
interface MithrilEvent {
    currentTarget: Element;
}

// TODO might be able to replace TView with: (ctrl: TCtrl) => string;
interface MithrilModule<TCtrl, TView> {
	controller: TCtrl;
	view: TView;
}

interface MithrilXHROptions {
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
	extract?(xhr: XMLHttpRequest, options: MithrilXHROptions): string;
	type?(data: Object): void;
	config?(xhr: XMLHttpRequest, options: MithrilXHROptions): XMLHttpRequest;
}

declare var Mithril: MithrilStatic;
declare var m: MithrilStatic;

declare module 'mithril' {
    export = MithrilStatic;
}

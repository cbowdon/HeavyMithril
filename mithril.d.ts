//Mithril type definitions for Typescript

interface MithrilStatic {
	(selector: string, attributes: Object, children?: any): MithrilVirtualElement;
	(selector: string, children?: any): MithrilVirtualElement;

    prop<T>(promise: MithrilPromise<T>) : MithrilPromiseProperty<T>;
	prop<T>(value?: T): MithrilProperty<T>;

	withAttr(property: string, callback: (value: any) => void): (e: Event) => any;

	module(rootElement: Node, module: MithrilModule): Object;

	trust(html: string): String;

	render(rootElement: Element, children?: any): void;
	render(rootElement: HTMLDocument, children?: any): void;

	redraw(): void;

	route(rootElement: Element, defaultRoute: string, routes: { [key: string]: MithrilModule }): void;
	route(rootElement: HTMLDocument, defaultRoute: string, routes: { [key: string]: MithrilModule }): void;
	route(path: string, params?: any, shouldReplaceHistory?: boolean): void;
	route(): string;
	route(element: Element, isInitialized: boolean): void;

	request<T>(options: MithrilXHROptions): MithrilPromise<T>;

	deferred: MithrilDeferredStatic;

	sync<T>(promises: MithrilPromise<T>[]): MithrilPromise<T>;

	startComputation(): void;

	endComputation(): void;

	deps(Object: any): Object;
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
	attrs: Object;
	children: any;
}

interface MithrilModule {
	controller: Function;
	view: Function;
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

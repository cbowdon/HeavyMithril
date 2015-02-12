all: *.ts
	tsc $^ --sourceMap --module commonjs --noImplicitAny

lax: *.ts
	tsc $^ --sourceMap --module commonjs

todo: todo-app.ts
	tsc $^ --sourceMap --noImplicitAny

watch: *.ts
	tsc $^ --noImplicitAny --sourceMap --watch

clean:
	rm *.js.map

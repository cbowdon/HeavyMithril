all: *.ts
	tsc $^ --sourceMap --module commonjs --noImplicitAny

lax: *.ts
	tsc $^ --sourceMap --module commonjs

watch: *.ts
	tsc $^ --noImplicitAny --sourceMap --watch

clean:
	rm *.js.map

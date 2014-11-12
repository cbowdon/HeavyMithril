all: *.ts
	tsc $^ --noImplicitAny --sourceMap --module commonjs

watch: *.ts
	tsc $^ --noImplicitAny --sourceMap --watch

clean:
	rm *.js *.js.map

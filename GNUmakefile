all: *.ts
	tsc $^ --noImplicitAny --sourceMap --module commonjs
	#tsc $^ --sourceMap --module commonjs

watch: *.ts
	tsc $^ --noImplicitAny --sourceMap --watch

clean:
	rm *.js.map

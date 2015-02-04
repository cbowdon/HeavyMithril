all: *.ts
	tsc $^ --sourceMap --module commonjs #--noImplicitAny

watch: *.ts
	tsc $^ --noImplicitAny --sourceMap --watch

clean:
	rm *.js.map

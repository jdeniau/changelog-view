.PHONY: demo clean install

demo: clean install demo/demo.svg

install: node_modules

node_modules: yarn.lock
	yarn install

clean:
	rm demo/changelog-demo.json || true

demo/demo.svg: demo/changelog-demo.json
	cat demo/changelog-demo.json | yarn svg-term --window --no-cursor --width 100 --height 20 --out demo/demo.svg

demo/changelog-demo.json: clean
	asciinema rec demo/changelog-demo.json -c 'yarn demo'

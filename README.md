# Life WASM

[![Build Status](https://travis-ci.org/rclement/life-wasm.svg?branch=master)](https://travis-ci.org/rclement/life-wasm)

> Conway's Game of Life using Rust and WebAssembly

Personal implementation of the [Rust WASM book](https://rustwasm.github.io/book/).

## Setup

Install `wasm-pack` for Rust:
```
cargo install wasm-pack
```

## Build

```
wasm-pack build

(cd pkg && npm link)
(cd www && npm install)
(cd www && npm link life-wasm)
(cd www && npm run build)
```

## Testing

Unit-tests: `cargo test`

WASM integration tests: `wasm-pack test --chrome --firefox --headless`

## Dev server

`cd www && npm run dev`

# License

MIT License

Copyright (c) 2018 Romain Clement
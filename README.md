# Life WASM

Conway's Game of Life using Rust and WebAssembly.

Personal implementation of the [Rust WASM book](https://rustwasm.github.io/book/).

## Setup

Install `wasm-pack` for Rust:
```
cargo install wasm-pack
```

## Build

```
wasm-pack build

cd pkg
npm link
cd ..

cd www
npm install
npm link life-wasm
npm run build
cd ..
```

## Testing

Unit-tests: `cargo test`

WASM integration tests: `wasm-pack test --firefox --headless`

## Dev server

`cd www && npm run dev`

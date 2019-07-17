#!/bin/bash

set -euo pipefail

cargo build --release --target wasm32-unknown-unknown
wasm2wat target/wasm32-unknown-unknown/release/pwasm_tutorial_contract.wasm --no-check > target/pwasm_tutorial_contract-unopt.wat

# rm target/pwasm_tutorial_contract.wasm
# ~/code/wasm-utils/target/debug/wasm-build --skip-optimization --target=wasm32-unknown-unknown ./target pwasm_tutorial_contract
# cp target/pwasm_tutorial_contract.wasm 6.wasm

rm target/pwasm_tutorial_contract.wasm
wasm-build --target=wasm32-unknown-unknown ./target pwasm_tutorial_contract
# cp target/pwasm_tutorial_contract.wasm 7.wasm
wasm2wat target/pwasm_tutorial_contract.wasm --no-check > target/pwasm_tutorial_contract.wat

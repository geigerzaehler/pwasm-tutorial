import * as FS from 'fs'

main().catch((e) => console.error(e))

async function main () {
  const b = await FS.promises.readFile('./step-5/target/pwasm_tutorial_contract.wasm')
  const mod = await WebAssembly.compile(b)
  const mem = new WebAssembly.Memory({ initial: 2, maximum: 16 })
  console.log(mem)
  const is = await WebAssembly.instantiate(mod, {
    env: {
      memory: mem,
      sender: function () {},
      value: function () {},
      input_length: function () {},
      fetch_input: function () {},
      panic: function () {},
      storage_write: function () {},
      ret: function () {},
    }
  })
  console.log(WebAssembly.Module.exports(mod))
  console.log(WebAssembly.Module.imports(mod))
}

import Web3 from 'web3'
import {Contract} from 'web3-eth-contract';
import {HttpProvider} from 'web3-providers'
import * as FS from 'fs'
import * as Util from 'util'

export const devAccId = "0x00a329c0648769A73afAc7F9381E08FB43dBEA72"
export const otherAccId = '0x6b709B10388EDf1a7486bB2166444E08c00f6860'
export const contractId = '0xee35211C4D9126D520bBfeaf3cFee5FE7B86F221'

let debug = false

class DebugProvider {
  private httpProvider: any

  constructor (httpProvider: HttpProvider) {
    this.httpProvider = httpProvider
  }

  public supportsSubscriptions(): boolean {
    return false
  }

  public sendPayload(): void {
    throw new Error('Dont call "sendPayload" directly')
  }

  public subscribe(): void {
    throw new Error('Subscription not supported')
  }

  public async send(method: string, parameters: any[]): Promise<any> {
    if (debug) {
      console.log(`SEND     ${method}`, parameters)
    }

    const response = await this.httpProvider.send(method, parameters)

    if (debug) {
      console.log('RECEIVE ', Util.inspect(response, { colors: true }))
    }

    return response
  }
}

const httpProvider = new HttpProvider('http://localhost:8545', { keepAlive: false } as any)
const provider = new DebugProvider(httpProvider)
const web3 = new Web3(provider as any)

main().catch((e) => console.error(e))

async function main () {
  await web3.eth.personal.unlockAccount(devAccId, "", null as any)

  // debug = true
  console.log(await deployTokenContract())
  // const c = makeContract();
  // const bn = await c.methods.balanceOf(devAccId).call({
  //   from: devAccId
  // })
  // console.log(bn.toString())

  // debugger
  // console.log(await c.methods.transfer(otherAccId, 10).send({
  //   from: devAccId
  // }))
}

export async function deployTokenContract (): Promise<string> {
  const tokenContract = makeTokenContract();
  const tokenDeployTransaction = tokenContract.deploy({arguments: [1000]} as any);
  const contract = await tokenDeployTransaction.send({ gas: "8000000", from: devAccId, gasPrice: '0x0' } as any)
  return contract.address
}

function makeTokenContract (): Contract {
  const step = 5
  const abi = JSON.parse(FS.readFileSync(`./step-${step}/target/json/TokenInterface.json`, 'utf8'));
  // convert Wasm binary to hex format
  const codeHex = '0x' + FS.readFileSync(`./step-${step}/target/pwasm_tutorial_contract.wasm`).toString('hex');
  const tokenContract = new web3.eth.Contract(abi, contractId, { data: codeHex, from: devAccId, transactionConfirmationBlocks: 1 } as any);
  return tokenContract
}

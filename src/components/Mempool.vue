<template>
  <div>
    get mempool count: {{ count }}
  </div>

  <!-- <div @click="onStart">Start</div> -->
  <button type="button"  @click="onStart">Start</button>
</template>

<script setup>
import { provide, ref } from 'vue'
import { BigNumber, ethers, utils } from 'ethers'
import { get } from 'lodash-es'
import { contract_seaport, topic_seaportOrdersMatched } from './config'

import abi from './seaportabi.json'
const count = ref(0)

const url = 'wss://mainnet.infura.io/ws/v3/390b9494e39f45178910876a08bc5c3e'
const wsProvider = new ethers.providers.WebSocketProvider(url)

const iface = new ethers.utils.Interface(abi)
// const contract  = new ethers.Contract('0x00000000006c3852cbEf3e08E8dF289169EdE581', abi, wsProvider)

const filter = {
  address: contract_seaport,
  topics: [
    topic_seaportOrdersMatched
  ],
  fromBlock: 'pending'
}
const onStart = async () => {
  wsProvider.on(filter, async tx => {
    count.value++

    console.log(tx)
    const transaction = await wsProvider.getTransaction(tx.transactionHash)
    console.log(transaction)

    const gasPrice = transaction.gasPrice
    const gasLimit = transaction.gasLimit
    const from = transaction.from

    const decodedData = iface.parseTransaction({
      data: transaction.data,
      value: transaction.value
    })
    console.log(decodedData)

    let nft = '0x0'
    let tokenId = '0'

    // opensea function: fulfillAdvancedOrder  fulfillAvailableOrders  fulfillBasicOrder
    if (decodedData.name === 'fulfillBasicOrder') {
      nft = get(decodedData, 'args.parameters.offerToken', '0x0')
      tokenId = get(decodedData, 'args.parameters.offerIdentifier', '0')
      console.log(`nft: ${nft}`)
      console.log(`tokenId: ${BigNumber.from(tokenId).toString()}`)
    }
    console.log('--------------------')
  })
}



</script>



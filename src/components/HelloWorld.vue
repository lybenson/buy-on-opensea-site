<template>
  <button type="button" @click="buyOnOpensea">buy</button>
</template>

<script setup>
import axios from 'axios'
import { Seaport } from "@opensea/seaport-js"
import { ethers } from "ethers"
import { get } from 'lodash-es'

const buyOnOpensea = async () => {
  const order = await getOrder()
  await window.ethereum.send("eth_requestAccounts");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  const accounts = await provider.listAccounts()
  const account = accounts[0] // 买方

  console.log(account)

  const seaport = new Seaport(signer);

  if (!order) {
    throw new Error('listing not exist')
  }

  const orderHash = order.order_hash
  const status = await seaport.getOrderStatus(orderHash)

  if (status && !status.isCancelled && !status.isValidated) {
    // 订单有效
    buy(seaport, order, account)
  } else {
    throw new Error('listing not exist')
  }
}

const getOrder = async () => {
  const contractAddress = '0xDaA3812B8FD34D01711105a6DFb669c50ab8fee3'
  const tokenId = '424'
  const response = await axios.get(`https://testnets-api.opensea.io/v2/orders/goerli/seaport/listings?asset_contract_address=${contractAddress}&token_ids=${tokenId}&limit=1`)

  return get(response, 'data.orders[0]', null)
}

const buy = async (seaport, order, account) => {
  const protocolData = get(order, 'protocol_data', null)
  if (!protocolData) throw new Error('listing not exist')

  // 注意余额
  // WETH 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
  const { executeAllActions } = await seaport.fulfillOrder({
    order: protocolData,
    accountAddress: account
  })
  await executeAllActions()
}

</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

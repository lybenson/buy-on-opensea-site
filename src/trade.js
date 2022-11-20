import { OpenSeaSDK, Network } from 'opensea-js'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/3cd10dfcd70843698ff07d2278c8be3f')

const openseaSDK = new OpenSeaSDK(provider, {
  networkName: Network.Main,
  apiKey: '40392d7387d34dea8751d0b639379f20'
})

const getOrder = async () => {
  const order = await openSeaSDK.api.getOrder({
    assetContractAddress: '0x6c869a43a9d362ef870d75dae56a01887578421d',
    tokenId: '2107',
    side: 'ask'
  })

  console.log(order);
}
getOrder()
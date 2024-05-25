import * as WarpArBundles from 'warp-arbundles'

const pkg = WarpArBundles && WarpArBundles?.default ? WarpArBundles.default : WarpArBundles
const { createData, ArweaveSigner } = pkg


export function createDataItemSigner (wallet: any, data: any, tags: any, target: any, anchor: any) {
  const signer = async ({ data, tags, target, anchor } : any) => {
    const signer = new ArweaveSigner(wallet)
    const dataItem = createData(data, signer, { tags, target, anchor })
    return dataItem.sign(signer)
      .then(async () => ({
        id: await dataItem.id,
        raw: await dataItem.getRaw()
      }))
  }

  return signer
}

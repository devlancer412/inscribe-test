import { Ordit, JsonRpcDatasource } from "@sadoprotocol/ordit-sdk";
import * as ecc from "@bitcoinerlab/secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { CustomInscriber } from "./CustomInscriber";
import cbor from "cbor";

const MNEMONIC =
  "ensure phrase charge immense attend electric project mail try cactus daughter birth";
const network = "testnet";
const datasource = new JsonRpcDatasource({ network });

bitcoin.initEccLib(ecc);

const payload = {
  network: {
    type: "Testnet",
  },
  contentType: "text/html",
  content: "My inscription text",
  payloadType: "PLAIN_TEXT",
  appFeeAddress: "2NEYt8s1QPVmTmFTefMLidtmy66ZoqfSz7n",
  appFee: 1500,
  suggestedMinerFeeRate: 10,
};

const main = async () => {
  // init wallet
  const wallet = new Ordit({
    bip39: MNEMONIC,
    network,
  });

  wallet.setDefaultAddress("taproot");

  const mediaContent =
    "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";

  // new inscription tx
  const transaction = new CustomInscriber({
    network,
    address: wallet.selectedAddress,
    publicKey: wallet.publicKey,
    changeAddress: wallet.selectedAddress,
    destinationAddress:
      "tb1p6auqj3udsl4nd3xeze9jgde8zsweu622ejks0y4ksetgtpc7zpxqgvynsk",
    mediaContent: mediaContent,
    mediaType: "image/png",
    feeRate: 1,
    meta: {
      // Flexible object: Record<string, any>
      title: "xFAKEGOATx",
      artist: "RARE SCRILLA",
      description:
        "This pepe is a remix of PEPEGOAT from the RARE PEPE Trading Card Series I did in 2016, and is considered my first official published work on the Bitcoin blockcahin. PEPEGOAT and this work will be featured in the {R(Evolutionaries);} Art Dubai 2024 gallery, this March, which is celebrating 10 years of tokenized Cryptoart on the blockchain. It is being published in the Fake Rare Collection. Series 17 year 2024",
      type: "png",
    },
    outputs: [
      // {
      //   address: "2N3JmiPLSwkjGMBMJcyXXfi7moV4wkb5MzR",
      //   value: 1500,
      // },
    ],

    postage: 600, // base value of the inscription in sats
  });

  // generate deposit address and fee for inscription
  const revealed = await transaction.generateCommit();
  console.log(revealed); // deposit revealFee to address

  // confirm if deposit address has been funded
  const ready = await transaction.isReady();

  console.log(ready);

  if (ready) {
    // build transaction
    await transaction.build();

    // sign transaction
    const signedTxHex = wallet.signPsbt(transaction.toHex(), {
      isRevealTx: true,
    });

    // Broadcast transaction
    const tx = await datasource.relay({ hex: signedTxHex });
    console.log(tx);
  }
};

main();

const metadataCheck = () => {
  const metadataHex1 =
    "a4657469746c656a7846414b45474f415478666172746973746c5241524520534352494c4c416b6465736372697074696f6e79019b54686973207065706520697320612072656d6978206f662050455045474f41542066726f6d20746865205241524520504550452054726164696e6720436172642053657269657320492064696420696e20323031362c20616e6420697320636f6e73696465726564206d79206669727374206f6666696369616c207075626c697368656420776f726b206f6e2074686520426974636f696e20626c6f636b636168696e2e2050455045474f415420616e64207468697320776f726b2077696c6c20626520666561747572656420696e20746865207b522845766f6c7574696f6e6172696573293b7d2041727420447562616920323032342067616c6c6572792c2074686973204d617263682c2077686963682069732063656c6562726174696e67203130207965617273206f6620746f6b656e697a65642043727970746f617274206f6e2074686520626c6f636b636861696e2e204974206973206265696e67207075626c697368656420696e207468652046616b65205261726520436f6c6c656374696f6e2e2053657269657320313720796561722032303234647479706563706e67";
  const metadataHex2 =
    "7b227469746c65223a227846414b45474f415478222c22617274697374223a225241524520534352494c4c41222c226465736372697074696f6e223a2254686973207065706520697320612072656d6978206f662050455045474f41542066726f6d20746865205241524520504550452054726164696e6720436172642053657269657320492064696420696e20323031362c20616e6420697320636f6e73696465726564206d79206669727374206f6666696369616c207075626c697368656420776f726b206f6e2074686520426974636f696e20626c6f636b636168696e2e2050455045474f415420616e64207468697320776f726b2077696c6c20626520666561747572656420696e20746865207b522845766f6c7574696f6e6172696573293b7d2041727420447562616920323032342067616c6c6572792c2074686973204d617263682c2077686963682069732063656c6562726174696e67203130207965617273206f6620746f6b656e697a65642043727970746f617274206f6e2074686520626c6f636b636861696e2e204974206973206265696e67207075626c697368656420696e207468652046616b65205261726520436f6c6c656374696f6e2e2053657269657320313720796561722032303234222c2274797065223a22706e67227d";

  const buffer1 = cbor.decode(metadataHex1);
  const metadataHexDash = cbor.encode(buffer1);
  const buffer2 = Buffer.from(metadataHex2, "hex");

  console.log(buffer1);

  const metadataStr1 = buffer1.toString("utf-8");
  const metadataStr2 = buffer2.toString("utf8");

  // console.log("1", metadataStr1);
  console.log("2", metadataStr2);
};

// metadataCheck();

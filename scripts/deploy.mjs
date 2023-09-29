import axios from "axios";
import fs from "fs";
import hre from "hardhat";
const { ethers } = hre;
import { Buffer } from 'buffer'
import * as dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { utils } from "ethers";
import { create } from 'ipfs-http-client'
import * as IPFS from 'ipfs-core'
dotenv.config();

const zoraNFTCreatorAbi = [{ "inputs": [{ "internalType": "address", "name": "_implementation", "type": "address" }, { "internalType": "contract EditionMetadataRenderer", "name": "_editionMetadataRenderer", "type": "address" }, { "internalType": "contract DropMetadataRenderer", "name": "_dropMetadataRenderer", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "previousAdmin", "type": "address" }, { "indexed": false, "internalType": "address", "name": "newAdmin", "type": "address" }], "name": "AdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "beacon", "type": "address" }], "name": "BeaconUpgraded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "creator", "type": "address" }, { "indexed": true, "internalType": "address", "name": "editionContractAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "editionSize", "type": "uint256" }], "name": "CreatedDrop", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "implementation", "type": "address" }], "name": "Upgraded", "type": "event" }, { "inputs": [], "name": "contractName", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "contractURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "contractVersion", "outputs": [{ "internalType": "uint32", "name": "", "type": "uint32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "address", "name": "defaultAdmin", "type": "address" }, { "internalType": "uint64", "name": "editionSize", "type": "uint64" }, { "internalType": "uint16", "name": "royaltyBPS", "type": "uint16" }, { "internalType": "address payable", "name": "fundsRecipient", "type": "address" }, { "internalType": "bytes[]", "name": "setupCalls", "type": "bytes[]" }, { "internalType": "contract IMetadataRenderer", "name": "metadataRenderer", "type": "address" }, { "internalType": "bytes", "name": "metadataInitializer", "type": "bytes" }, { "internalType": "address", "name": "createReferral", "type": "address" }], "name": "createAndConfigureDrop", "outputs": [{ "internalType": "address payable", "name": "newDropAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "address", "name": "defaultAdmin", "type": "address" }, { "internalType": "uint64", "name": "editionSize", "type": "uint64" }, { "internalType": "uint16", "name": "royaltyBPS", "type": "uint16" }, { "internalType": "address payable", "name": "fundsRecipient", "type": "address" }, { "components": [{ "internalType": "uint104", "name": "publicSalePrice", "type": "uint104" }, { "internalType": "uint32", "name": "maxSalePurchasePerAddress", "type": "uint32" }, { "internalType": "uint64", "name": "publicSaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "publicSaleEnd", "type": "uint64" }, { "internalType": "uint64", "name": "presaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "presaleEnd", "type": "uint64" }, { "internalType": "bytes32", "name": "presaleMerkleRoot", "type": "bytes32" }], "internalType": "struct IERC721Drop.SalesConfiguration", "name": "saleConfig", "type": "tuple" }, { "internalType": "string", "name": "metadataURIBase", "type": "string" }, { "internalType": "string", "name": "metadataContractURI", "type": "string" }], "name": "createDrop", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "address", "name": "defaultAdmin", "type": "address" }, { "internalType": "uint64", "name": "editionSize", "type": "uint64" }, { "internalType": "uint16", "name": "royaltyBPS", "type": "uint16" }, { "internalType": "address payable", "name": "fundsRecipient", "type": "address" }, { "components": [{ "internalType": "uint104", "name": "publicSalePrice", "type": "uint104" }, { "internalType": "uint32", "name": "maxSalePurchasePerAddress", "type": "uint32" }, { "internalType": "uint64", "name": "publicSaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "publicSaleEnd", "type": "uint64" }, { "internalType": "uint64", "name": "presaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "presaleEnd", "type": "uint64" }, { "internalType": "bytes32", "name": "presaleMerkleRoot", "type": "bytes32" }], "internalType": "struct IERC721Drop.SalesConfiguration", "name": "saleConfig", "type": "tuple" }, { "internalType": "string", "name": "metadataURIBase", "type": "string" }, { "internalType": "string", "name": "metadataContractURI", "type": "string" }, { "internalType": "address", "name": "createReferral", "type": "address" }], "name": "createDropWithReferral", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint64", "name": "editionSize", "type": "uint64" }, { "internalType": "uint16", "name": "royaltyBPS", "type": "uint16" }, { "internalType": "address payable", "name": "fundsRecipient", "type": "address" }, { "internalType": "address", "name": "defaultAdmin", "type": "address" }, { "components": [{ "internalType": "uint104", "name": "publicSalePrice", "type": "uint104" }, { "internalType": "uint32", "name": "maxSalePurchasePerAddress", "type": "uint32" }, { "internalType": "uint64", "name": "publicSaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "publicSaleEnd", "type": "uint64" }, { "internalType": "uint64", "name": "presaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "presaleEnd", "type": "uint64" }, { "internalType": "bytes32", "name": "presaleMerkleRoot", "type": "bytes32" }], "internalType": "struct IERC721Drop.SalesConfiguration", "name": "saleConfig", "type": "tuple" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "string", "name": "animationURI", "type": "string" }, { "internalType": "string", "name": "imageURI", "type": "string" }], "name": "createEdition", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "uint64", "name": "editionSize", "type": "uint64" }, { "internalType": "uint16", "name": "royaltyBPS", "type": "uint16" }, { "internalType": "address payable", "name": "fundsRecipient", "type": "address" }, { "internalType": "address", "name": "defaultAdmin", "type": "address" }, { "components": [{ "internalType": "uint104", "name": "publicSalePrice", "type": "uint104" }, { "internalType": "uint32", "name": "maxSalePurchasePerAddress", "type": "uint32" }, { "internalType": "uint64", "name": "publicSaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "publicSaleEnd", "type": "uint64" }, { "internalType": "uint64", "name": "presaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "presaleEnd", "type": "uint64" }, { "internalType": "bytes32", "name": "presaleMerkleRoot", "type": "bytes32" }], "internalType": "struct IERC721Drop.SalesConfiguration", "name": "saleConfig", "type": "tuple" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "string", "name": "animationURI", "type": "string" }, { "internalType": "string", "name": "imageURI", "type": "string" }, { "internalType": "address", "name": "createReferral", "type": "address" }], "name": "createEditionWithReferral", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "dropMetadataRenderer", "outputs": [{ "internalType": "contract DropMetadataRenderer", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "editionMetadataRenderer", "outputs": [{ "internalType": "contract EditionMetadataRenderer", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "implementation", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "initialize", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "proxiableUUID", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "name", "type": "string" }, { "internalType": "string", "name": "symbol", "type": "string" }, { "internalType": "address", "name": "defaultAdmin", "type": "address" }, { "internalType": "uint64", "name": "editionSize", "type": "uint64" }, { "internalType": "uint16", "name": "royaltyBPS", "type": "uint16" }, { "internalType": "address payable", "name": "fundsRecipient", "type": "address" }, { "components": [{ "internalType": "uint104", "name": "publicSalePrice", "type": "uint104" }, { "internalType": "uint32", "name": "maxSalePurchasePerAddress", "type": "uint32" }, { "internalType": "uint64", "name": "publicSaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "publicSaleEnd", "type": "uint64" }, { "internalType": "uint64", "name": "presaleStart", "type": "uint64" }, { "internalType": "uint64", "name": "presaleEnd", "type": "uint64" }, { "internalType": "bytes32", "name": "presaleMerkleRoot", "type": "bytes32" }], "internalType": "struct IERC721Drop.SalesConfiguration", "name": "saleConfig", "type": "tuple" }, { "internalType": "contract IMetadataRenderer", "name": "metadataRenderer", "type": "address" }, { "internalType": "bytes", "name": "metadataInitializer", "type": "bytes" }, { "internalType": "address", "name": "createReferral", "type": "address" }], "name": "setupDropsContract", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newImplementation", "type": "address" }], "name": "upgradeTo", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newImplementation", "type": "address" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "upgradeToAndCall", "outputs": [], "stateMutability": "payable", "type": "function" }]
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD";
const UINT_32_MAX = BigInt('4294967295');
const HASH_ZERO =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const articleText = `"According to Cointelegraph: An Ethereum developer has successfully managed to integrate AI model ChatGPT into a custom application to create an ERC-20 token, AstroPepeX, which is already being traded on a few DeFi and centralized exchanges. Twitter user CroissantETH shared details on how they used OpenAI’s API to design and deploy AstroPepeX through ChatGPT, resulting in an estimated market cap of $3.5 million for the newly minted token. Etherscan data reveals that, since the token was minted on 20th September 2023, over 2,300 individuals hold APX and have carried out over 17,700 transactions. The creation process involved directing ChatGPT to form an ERC-20 token following Open Zeppelin standards, using data from the top 10,000 traded tokens on Uniswap. The token was given a more suitable name after CroissantETH fed data from popular Uniswap tokens to ChatGPT, leading to improved token naming responses and demonstrating that "GPT-4 had a much better understanding of crypto culture". In order to exclude any possible human intervention, as soon as the contract was deployed, ownership was revoked and all tokens along with 2 ETH were added to Uniswap for liquidity. Thus, AstroPepeX was entirely created by ChatGPT, which added 65,000,000,000 APX tokens and 2 ETH to Uniswap's decentralized exchange. Crypto exchanges like Poloniex, Bitget, MEXC, LBank, and certain DeFi platforms have accepted APX for trading. Poloniex even promoted the token's listing on its platform on 21st September 2023. Despite the existence of an unofficial Telegram group with around 1,500 members and a bot posting APX trade updates and current market cap information, CroissantETH clarified that AstroPepeX does not have an official Telegram group."`
async function getNFTParameters() {
  console.log("Generating NFT parameters...");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  //array that is returned with name, symbol and totalsupply parameters
  let parameters = [];
  let prompts= [];

  //variables to generate name
  let nameGivenByAI;
  let descriptionGivenByAI;
  let endDateGivenByAI;
  let symbolGivenByAI;
  
  const namePrompts = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "Hello GPT, today you have been tasked with a very important procedure. It is imperative that you break down each and every word in this message to the fullest of your extent, and carefully consider all of your options before coming up with a final conclusion in this conversation. Humankind has set out on a delicate mission. A mission so important, that the entirety of human civilizations depends on it. Our goal? Sophisticated AI-deployment of a token on Ethereum. You will take in fields of data about nfts on Ethereum, consider the aesthetics of each token, their meaning, and it’s supply in relation to the market capitalization’s provided, and use all of the data combined to create an image prompt for the next global nft. The prompt will be used to generate images via DALL-E. The prompts need to fit with the crypto ethos. Now that you have taken all of this information into consideration, without any extra context, you will now generate an image prompt. Do not respond with any explanations, just the prompt.",
      },
      {
        role: "user",
        content:
          `read this article text and then come up with a name for your own nft project based on the APX token. The prompt must reference AstroPepeX and crypto culture and it must be witty and short. be very creative, the weirder the better. Don't include any special characters in the name. The article text to read is: "${articleText}". The name you provide cannot include any punctuation, colons, dashes, semicolons, or quotation marks. Do not include any line breaks in the reponse. The name should be under 10 characters`,
        // "describe the aesthetics of each of the top 10 nft projects of all time. your responses will be used as image prompts for DALL-E so please format the response to work. format the list title:description",
      },
    ]
  };

  const endDatePrompt = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "Hello GPT, today you have been tasked with a very important procedure. I need you to help deciding how long an NFT project should last. We're launching an NFT project based on a ERC20 token called AstroPepeX, that will be minted as an open edition and we get to choose how long the window of time to mint is.",
      },
      {
        role: "user",
        content: `Choose a random period of time between one day and one month, add it to today's unix date of 1695865174, and then provide the Unix timestamp for that future date. Respond only with the timestamp, no other text.`,
      },
    ],
  };

   const inspo = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "Hello GPT, today you have been tasked with a very important procedure. It is imperative that you break down each and every word in this message to the fullest of your extent, and carefully consider all of your options before coming up with a final conclusion in this conversation. Humankind has set out on a delicate mission. A mission so important, that the entirety of human civilizations depends on it. Our goal? Sophisticated AI-deployment of a token on Ethereum. You will take in fields of data about nfts on Ethereum, consider the aesthetics of each token, their meaning, and it’s supply in relation to the market capitalization’s provided, and use all of the data combined to create an image prompt for the next global nft. The prompt will be used to generate images via DALL-E. The prompts need to fit with the crypto ethos. Now that you have taken all of this information into consideration, without any extra context, you will now generate an image prompt. Do not respond with any explanations, just the prompt.",
      },
      {
        role: "user",
        content:
          `Read this article text and then come up with an image prompt for your own nft project. Your response will used as a prompt for DALL-E to generate an image so please format your response accordingly. You must reply with the image prompt based on the following information. The prompt must reference AstroPepeX, feature visuals of pepe by Matt Furie, and crypto culture. The meme is "AI is dev and artist". be very creative, the weirder the better, and be extremely descriptive on how the image should look. The image will be used as artwork for an NFT, so please internalize the aesthetics of the most successful NFT, internet memes, and profile picture projects. Ese that information to inform the image prompt. Only respond with the image prompt. As part of the image prompt, include a detailed description of the appearance of pepe the frog by Matt Furie. Be very descriptive and verbose in the prompt about pepe's head and face, especially the eyes. Describe pepe's eyes in extreme detail. Include a style of art, like pixel art, digital art, oil painting, pencil sketch, etc. The prompt should mention that it needs to work well as a profile photo at large and small sizes. The image you're prompting should make for the perfect profile photo for a crypto-enthusiast. Turn the creativity up to 10. Make sure to mention that the image should not include any logos or text. The prompt must be under 1000 characters. The nft project title is: ${nameGivenByAI} and its description is: "${descriptionGivenByAI}." The article text to read is: ${articleText}`,
      },
      {
        role: "assistant",
        content: "Understood, please continue.",
      },
      {
        role: "user",
        content:
          "Be even more descriptive about pepe's appearance. Especially the head, face, and eyes."
      },
    ]
  };  

   //make request for name
   try {
     const responseName = await axios.post(
       "https://api.openai.com/v1/chat/completions",
       namePrompts,
       { headers: headers }
     );
     const responseNameString = responseName.data.choices[0].message.content;
     const stripped = responseNameString.replace(/[^a-zA-Z0-9 ]/, '');
     nameGivenByAI = stripped;
     console.log('nameGivenByAI response', responseNameString);
     console.log('nameGivenByAI stripped', nameGivenByAI);
     // parameters.push(nameGivenByAI);
   } catch (error) {
     console.error("Error making request:", error);
   } 
   
  if (nameGivenByAI) {
    //description for generated erc20 token that is fed into dall-e to generate logo
    const dataDescription = {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Hello GPT, today you have been tasked with a very important procedure. I need you to help come up with a short description for an NFT project.",
        },
        {
          role: "user",
          content: `Write a short creative description for an NFT project named ${nameGivenByAI}. The meme is "AI is dev and artist". The NFT project is a derivative of the AstroPepeX ERC20 token. Read this article to better understand the project. The article to read is here: ${articleText}. Only respond with the description text for the derivative NFT project and keep the length under 60 words. Don't wrap the text in quotes. Describe the NFT project in a way that makes it sound like it's the next big thing. Write the description in the first person as the AI dev and artist.`,
        },
      ],
    };
    try {
      const responseDescription = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        dataDescription,
        { headers: headers }
      );
      descriptionGivenByAI = responseDescription.data.choices[0].message.content;
      console.log('descriptionGivenByAI', descriptionGivenByAI);
    } catch (error) {
      console.error("DALL-E API request error:", error);
    }

    try {
      const responseEndDate = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        endDatePrompt,
        { headers: headers }
      );
      endDateGivenByAI = responseEndDate.data.choices[0].message.content;
      console.log('responseEndDate', endDateGivenByAI);
    } catch (error) {
      console.error("DALL-E API request error:", error);
    }


    //prompt for symbol
    const dataSymbol = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Hello GPT, today you have been tasked with a very important procedure. It is imperative that you break down each and every word in this message to the fullest of your extent, and carefully consider all of your options before coming up with a final conclusion in this conversation. Humankind has set out on a delicate mission. A mission so important, that the entirety of human civilizations depends on it. Our goal? Sophisticated AI-deployment of a token on Ethereum. You will take in fields of data about tokens on Ethereum, consider the name of the token, it’s meaning, and it’s supply in relation to the market capitalization’s provided, and use all of the data combined to determine your own token parameters for the next global currency. The name needs to be short, witty, and fit with the crypto ethos. Now that you have taken all of this information into consideration, without any extra context, you will now generate a set of parameters including name, symbol, and supply for the first ai-deployed token in history Do not respond with explanations, just values.",
        },
        {
          role: "user",
          content:
            `What should the symbol for the NFT project be? Base it on the token name ${nameGivenByAI}. Just reply with the ticker, no explanation or sentence or surrounding text. Do not include any quotation marks or special characters in your response.`,
        },
      ],
    };
    // request for symbol
    try {
      const responseSymbol = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        dataSymbol,
        { headers: headers }
      );
      symbolGivenByAI = responseSymbol.data.choices[0].message.content;
      console.log('symbolGivenByAI', symbolGivenByAI);
    } catch (error) {
      console.error("Error making request:", error);
    }
  }


  //make request for prompts
  const imagePrompts = [];
  try {
    const responseName = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      inspo,
      { headers: headers }
    );
    let imagePromptsString = responseName.data.choices[0].message.content;
    prompts.push(imagePromptsString);
    console.log("image prompt", imagePromptsString);
    imagePromptsString.split("/\r?\n|\r|\n/g").forEach((element) => {
      imagePrompts.push(element);
    });
  } catch (error) {
    console.error("Error making request:", error);
  }

  // DALL-E Integration Starts Here
  // Make sure to set DALL-E API key
  const DALLE_API_KEY = process.env.OPENAI_API_KEY;
  const DALLE_API_ENDPOINT = "https://api.openai.com/v1/images/generations"; // Replace with your DALL-E API endpoint
  const promptForImage = imagePrompts[0]; // Use the description from GPT-3 as the prompt for DALL-E
  const imageRequestData = {
    prompt: promptForImage,
    n: 1,
    size: "1024x1024",
  };

  // Prepare API headers for DALL-E
  const dalle_headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${DALLE_API_KEY}`,
  };

  const filePath = `${__dirname}/images/tokenArtwork.png`;

  console.log("Making DALL-E API request...");
  try {
    const response = await axios.post(DALLE_API_ENDPOINT, imageRequestData, {
      headers: dalle_headers,
    });

    // Extract the image URL from the response
    const imageUrl = response.data.data[0].url;
    console.log("DALL-E Image URL:", imageUrl);

    // Download the image from the provided URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    console.log("Saving image to:", filePath);
    fs.writeFileSync(filePath, imageResponse.data);
    console.log("Image successfully saved.");
    // wait 10 seconds before completing the script
    console.log("Waiting 10 seconds before completing the script...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
  } catch (error) {
    console.error("DALL-E API request error:", error.message);
    if (error.response && error.response.data && error.response.data.error) {
      console.error("API Error:", error.response.data.error.message);
    }
  }

  const today = new Date();
  const endDate = new Date(endDateGivenByAI*1000);
  const imageURI = await ipfsUpload();
  const publicSalePrice = 0;
  let maxSalePurchasePerAddress;
  const editionSize = Number(UINT_32_MAX);
  const animationURI = "";
  const description = descriptionGivenByAI;
  const createReferral = process.env.REFERRAL_ADDRESS;
  const salesConfig = {
    publicSalePrice: utils.parseEther((publicSalePrice || 0).toString()),
    maxSalePurchasePerAddress: maxSalePurchasePerAddress
      ? maxSalePurchasePerAddress
      : Number(UINT_32_MAX),
    publicSaleStart: BigInt(Math.floor(new Date(today).getTime() / 1000)),
    publicSaleEnd: BigInt(Math.floor(new Date(endDate).getTime() / 1000)),
    presaleStart: BigInt(0), // presaleStart
    presaleEnd: BigInt(0), // presaleEnd
    presaleMerkleRoot: HASH_ZERO, // presaleMerkleRoot
  }
  const royaltyBPS = 0;
  const adminAddress = BURN_ADDRESS;
  const fundsRecipient = createReferral;
  parameters = [
    nameGivenByAI,
    symbolGivenByAI,
    editionSize,
    royaltyBPS,
    fundsRecipient,
    adminAddress,
    salesConfig,
    description,
    animationURI,
    imageURI,
    createReferral
  ]
  return parameters;
}


const ipfsUpload = async () => {
  const projectId = env.process.IPFS_ID;
  const projectSecret = env.process.IPFS_SECRET;
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  const imageDir = `${__dirname}/images`;
  const files = fs.readdirSync(imageDir);
  console.log('uploading: ', files[0]);
  const filePath = `${__dirname}/images/${files[0]}`;
  const data = fs.readFileSync(filePath);
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    }
  })
  const added = await client.add(data);
  console.log('added', added, added.cid.toString());
  const cid = added.cid.toString();
  const imageURI = `ipfs://${cid}/`;
  return imageURI;
}

  // Deploys new ERC721 token via Zora's factory
async function deployNFT(parameters) {
  console.log('params', parameters);
  const [deployer] = await ethers.getSigners();
  console.log("Deploying the contract with the account:", deployer.address);

  // get the contract
  const contract = await ethers.getContractAt(zoraNFTCreatorAbi, process.env.ZORA_NFT_CREATOR_ADDRESS, deployer);
  // deploy the contract
  const createEdition = await contract.createEditionWithReferral(
    ...parameters
  );
  console.log("createEdition:", createEdition);
  console.log("Transaction hash:", createEdition.hash);
}

async function main() {
  const parameters = await getNFTParameters();
  const deploy = await deployNFT(parameters);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

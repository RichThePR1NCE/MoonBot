const express = require("express");
const http = require('http');
const Web3=  require("web3")
const ethers = require("ethers");
const fetch = require("node-fetch");
const app = express();

// const factory_api = require("./factory_abi.json") ;
const axios = require('axios');

const PORT = process.env.PORT || 3888;

const { blacklist } = require("./config");
const { Fetcher, Route, ChainId, Token } = require("@pancakeswap-libs/sdk-v2");
const { reverse } = require("dns");
const { execPath } = require("process");

const wss = "wss://evocative-greatest-general.bsc.quiknode.pro/0932a08586c2915cc148a479af588d5fd8363193/" ;
const web3 = new Web3(wss)
const provider = new ethers.providers.WebSocketProvider(wss);

const secretKey = "c2ca7e051a62835af9b258776712f8048200d03ddcb21c35509d16a03d9dece4"
const PANCAKESWAP_ROUTER_ADDRESS =  "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const PANCAKESWAP_FACTORY_ADDRESS = "0xca143ce32fe78f1f7019d7d551a6402fc5350c73" ;
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" ;
const USDT = "0x55d398326f99059ff775485246999027b3197955" ;
const slippage = 0;
const MAX_SLIPPAGE = 15;  
let pancakeSwapAbi =  [
  {"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},
  ];

let pancakeSwapContract = "0x10ED43C718714eb63d5aA57B78B54704E256024E".toLowerCase();
const swapAbi = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"uint256","name":"_decimals","type":"uint256"},{"internalType":"uint256","name":"_supply","type":"uint256"},{"internalType":"uint256","name":"_txFee","type":"uint256"},{"internalType":"uint256","name":"_burnFee","type":"uint256"},{"internalType":"uint256","name":"_charityFee","type":"uint256"},{"internalType":"address","name":"_FeeAddress","type":"address"},{"internalType":"address","name":"tokenOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"FeeAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_BURN_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_CHARITY_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_TAX_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"}],"name":"deliver","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"excludeAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"includeAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isCharity","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"isExcluded","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tAmount","type":"uint256"},{"internalType":"bool","name":"deductTransferFee","type":"bool"}],"name":"reflectionFromToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"setAsCharityAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"rAmount","type":"uint256"}],"name":"tokenFromReflection","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalBurn","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalCharity","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_txFee","type":"uint256"},{"internalType":"uint256","name":"_burnFee","type":"uint256"},{"internalType":"uint256","name":"_charityFee","type":"uint256"}],"name":"updateFee","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const abi = [{"inputs":[{"internalType":"address","name":"_factory","type":"address"},{"internalType":"address","name":"_WBNB","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"WBNB","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"amountTokenDesired","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountIn","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsIn","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"}],"name":"getAmountsOut","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"name":"quote","outputs":[{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETH","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidityETHSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermit","outputs":[{"internalType":"uint256","name":"amountToken","type":"uint256"},{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountTokenMin","type":"uint256"},{"internalType":"uint256","name":"amountETHMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityETHWithPermitSupportingFeeOnTransferTokens","outputs":[{"internalType":"uint256","name":"amountETH","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"approveMax","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"removeLiquidityWithPermit","outputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapETHForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactETHForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForETHSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokensSupportingFeeOnTransferTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactETH","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMax","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapTokensForExactTokens","outputs":[{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]

let isTrading = false;

function calculate_gas_price(action, amount){
  if (action==="buy"){
    return amount.add(30)
  }else{
    return amount;
  }
}

const getTokenPrice = async (tokenAddress) => {

  var reserve = await getPoolReserve(tokenAddress) ;
  let reserve0 = parseInt(reserve.reveres0.toHexString().toString()) ;
  let reserve1 = parseInt(reserve.reveres1.toHexString().toString()) ;

  console.log("reserve0", reserve0) ;
  console.log("reserve1", reserve1) ;

  const price = reserve1/reserve0 ;
  return price;
}
async function getTokenPriceByToken(tokenAddress1, tokenAddress2) {
  const tokenAbi = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function",
      "stateMutability":"view"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function",
      "stateMutability":"view"
    },
  ] ;
  const web3 = new Web3("https://bsc-dataseed1.binance.org");
  // const BNBTokenAddress = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c" //BNB

  let tokenRouter = await new web3.eth.Contract( tokenAbi, tokenAddress1 );
  let tokenDecimals = await tokenRouter.methods.decimals().call();
  let tokensToSell = 1 ;
  tokensToSell = setDecimals(tokensToSell, tokenDecimals);
  
  let amountOut;
  try {
      let router = await new web3.eth.Contract( pancakeSwapAbi, pancakeSwapContract );
      amountOut = await router.methods.getAmountsOut(tokensToSell, [tokenAddress1 , tokenAddress2]).call();
      amountOut =  web3.utils.fromWei(amountOut[1]);
  } catch (error) {
    const token_price = await getTokenPrice(tokenAddress1) ; /*token USDT price */
    if(token_price) {
      return token_price;
    }
    else {
      console.log("get_price_error", "Token contains unverified infomartions") ;
    }
  }
  
  if(!amountOut) return 0;
  return amountOut;
}
function setDecimals( number, decimals ){
  number = number.toString();
  let numberAbs = number.split('.')[0]
  let numberDecimals = number.split('.')[1] ? number.split('.')[1] : '';
  while( numberDecimals.length < decimals ){
      numberDecimals += "0";
  }
  return numberAbs + numberDecimals;
}

function router(account) {
  return new ethers.Contract(
    PANCAKESWAP_ROUTER_ADDRESS,
      [
          'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
          'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
          'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
          'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
          'function swapExactTokensForETH (uint amountOutMin, address[] calldata path, address to, uint deadline) external payable',
          'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
      ],
      account
  );
}

const getPoolReserve = async (tokenAddress) => {
  
  const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
  const pair_abi = [
    {
      "inputs": [],
      "name": "getReserves",
      "outputs": [
        {
          "internalType": "uint112",
          "name": "_reserve0",
          "type": "uint256"
        },
        {
          "internalType": "uint112",
          "name": "_reserve1",
          "type": "uint256"
        },
        {
          "internalType": "uint32",
          "name": "_blockTimestampLast",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ] ;

  const factory_abi = [
    {
      "inputs": [],
      "name": "INIT_CODE_PAIR_HASH",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "getPair",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const pancakeFactoryContract = new web3.eth.Contract(factory_abi, PANCAKESWAP_FACTORY_ADDRESS);

  let reserve =  pancakeFactoryContract.methods.getPair(tokenAddress, WBNB).call()
  .then(async (pairAddress)  => {
    
    const pairContract = new ethers.Contract(pairAddress, pair_abi, provider);
    const reveres = await pairContract.getReserves();
    const [_reserve0, _reserve1] = reveres ;

    return {reveres0: _reserve0, reveres1: _reserve1} ;
  
  })
  .catch(error => {
    console.error("get_reserve_error",error);
  });
  return reserve ;
}

async function getLiquidity(tokenAddress) {
  // Use PancakeSwap SDK to get liquidity of token pair
  const pair = await Fetcher.fetchPairData(new Token(ChainId.MAINNET, WBNB, 18), new Token(ChainId.MAINNET, tokenAddress, 18), provider);
  const reserves = pair.tokenAmounts;
  const liquidity = reserves[0].toSignificant(6);
  return liquidity;
}

function erc20(account,tokenAddress) {
  return new ethers.Contract(
      tokenAddress,
      [{
          "constant": true,
          "inputs": [{"name": "_owner", "type": "address"}],
          "name": "balanceOf",
          "outputs": [{"name": "balance", "type": "uint256"}],
          "payable": false,
          "type": "function"
      },
      {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
      {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
      {"inputs": [], "name": "name","outputs": [{"internalType":"string","name": "","type": "string"}],"stateMutability": "view","type": "function"},
      {
        "constant": false,
        "inputs": [{"name": "_spender","type": "address"},{"name": "_value","type": "uint256"}],
        "name": "approve",
        "outputs": [{"name": "","type": "bool"}],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
    ],
      account
  );
}

const getTokenMarketCap = async(tokenAddress, tokenPrice) => {
  // const tokenAbi = [{"constant":true,"inputs":[],"name":"totoalSupply","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]; // example token ABI
  const tokenAbi = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function",
      "stateMutability":"view"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function",
      "stateMutability":"view"
    },
  ] ;
  const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
  const totalSupply = await tokenContract.methods.totalSupply().call() ;
  const decimals = await tokenContract.methods.decimals().call();

  console.log("totalSupply", totalSupply);
  
  const marketCap = (totalSupply / Math.pow(10, decimals)) * tokenPrice;
  return  marketCap ;

}

const buyToken = async(account, tokenContract, gasLimit, gasPrice)=>{
  //buyAmount how much are we going to pay for example 0.1 BNB
  
  try {
    const buyAmount = 0.5/*amount of ethers */
    // const slippage = 15 ;
    //Slippage refers to the difference between the expected price of a trade and the price at which the trade is executed
    //amountOutMin how many token we are going to receive
    let amountOutMin = 0;
    /* convert decimals to the ethers */
    const amountIn = ethers.utils.parseUnits(buyAmount.toString(), 'ether');
    const amounts = await router(account).getAmountsOut(amountIn, [WBNB, tokenContract]); /*convert WBNB */ 
    if (parseInt(slippage) !== 0) {
      const amounts = await router(account).getAmountsOut(amountIn, [WBNB, tokenContract]);
      amountOutMin = amounts[1].sub(amounts[1].div(100).mul(`${slippage}`));
    }
    // amountOutMin = amounts[1].sub(amounts[1].div(5));
    
    const token = await getERC20Token(account, tokenContract); /*Get token info */
    const isPassed = await checkScam(account, tokenContract, amountOutMin);
    if (!isPassed) return false;

    // const tokenBalance = await erc20(account, WBNB).balanceOf(account.address) ;
    // console.log("address", account.address) ;
    
    // console.log("tokenBalance", tokenBalance) ;
    // console.log("amountIn", amountIn) ;

    // if(tokenBalance < amountIn) {
    //   console.log("-Wallet doesn't have token") ;
    //   return false ;
    // }

    
    const tx = await router(account).swapExactETHForTokens(amountOutMin, [WBNB, tokenContract], account.address, Date.now()  + 10 * 1000 * 60,
      {
          'value': amountIn,
          'gasLimit': gasLimit,
          'gasPrice': gasPrice
      }
    );

    const receipt = await tx.wait();
    console.log(`Token ${token.symbol} passed all security checks.`);
    if (receipt && receipt.blockNumber && receipt.status === 1) { // 0 - failed, 1 - success
      console.log(`Transaction https://bscscan.com/tx/${receipt.transactionHash} mined, status success`);
      return true;
    } else if (receipt && receipt.blockNumber && receipt.status === 0) {
      console.log(`Transaction https://bscscan.com/tx/${receipt.transactionHash} mined, status failed`);
      return false;
    } else {
      console.log(`Transaction https://bscscan.com/tx/${receipt.transactionHash} not mined`);
      return false;
    }
  } catch(err) {

  }
}

const sellToken = async(account,tokenContract,gasLimit, gasPrice,value=99)=>{
  try {
    const sellTokenContract = new ethers.Contract(tokenContract,swapAbi,account)
    const contract = new ethers.Contract(PANCAKESWAP_ROUTER_ADDRESS,abi,account)
    const accountAddress = account.address
    const tokenBalance = await erc20(account,tokenContract).balanceOf(accountAddress);
    let amountOutMin = 0;
    const amountIn = tokenBalance.mul(value).div(100)
    const amounts = await router(account).getAmountsOut(amountIn, [tokenContract,WBNB]);
    if (parseInt(slippage) !== 0) {
      amountOutMin = amounts[1].sub(amounts[1].mul(1).div(100));
    } else {
      amountOutMin = amounts[1]
    }

    const token = await getERC20Token(account, tokenContract); /*Get token info */
    const token_price = await getTokenPriceByToken(tokenContract, USDT) ; /*token USDT price */
    const pool_liquidity = await getLiquidity(tokenContract) ;
    const pool_liquidity_price = pool_liquidity * token_price ;
    
    const approve = await sellTokenContract.approve(PANCAKESWAP_ROUTER_ADDRESS, ethers.constants.MaxUint256) ;
    const receipt_approve = await approve.wait();
    
    console.log("sell_amountIn", amountIn) ;
    console.log("sell_amountOutMin", amountOutMin) ;
    console.log(`Token ${token.symbol} passed all security checks.`);
    
    if (receipt_approve && receipt_approve.blockNumber && receipt_approve.status === 1) { 
      console.log(`Approved https://bscscan.com/tx/${receipt_approve.transactionHash}`);
      const swap_txn = await contract.swapExactTokensForETHSupportingFeeOnTransferTokens(
        amountIn ,amountOutMin, 
        [tokenContract, WBNB],
        accountAddress,
        Date.now()  + 10 * 1000 * 60,
        {
          'gasLimit': gasLimit * 2,
          'gasPrice': gasPrice,
        }
      )
      const receipt = await swap_txn.wait();
      if (receipt && receipt.blockNumber && receipt.status === 1) { // 0 - failed, 1 - success
        console.log(`Transaction https://bscscan.com/tx/${receipt.transactionHash} mined, status success`);
      } else if (receipt && receipt.blockNumber && receipt.status === 0) {
        console.log(`Transaction https://bscscan.com/tx/${receipt.transactionHash} mined, status failed`);
      } else {
        console.log(`Transaction https://bscscan.com/tx/${receipt.transactionHash} not mined`);
      }
    }
  }catch(e) {
    
  }
}

const init = async function () {
  const customWsProvider = new ethers.providers.WebSocketProvider(wss);
  const wallet = new ethers.Wallet(secretKey);
  const account = wallet.connect(customWsProvider)
  const iface = new ethers.utils.Interface([
    'function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)',
    'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)',
    'function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin,address[] calldata path,address to,uint deadline)'
  ]);


  customWsProvider.on("pending", (tx) => {
    customWsProvider.getTransaction(tx).then(async function (transaction) {
    // now we will only listen for pending transaction on pancakeswap factory
    if(transaction && transaction.to){
      if (transaction.to.toLowerCase() !== PANCAKESWAP_ROUTER_ADDRESS.toLowerCase() || isTrading) return;
      console.log("from", transaction.from);
      console.log("to", transaction.to);
      const transactionFrom = transaction.from ;
      const value = web3.utils.fromWei(transaction.value.toString())
      const gasPrice= web3.utils.fromWei(transaction.gasPrice.toString())
      const gasLimit= web3.utils.fromWei(transaction.gasLimit.toString())
      // for example we will be only showing transaction that are higher than 30 BNB
      
      if(value > 5) {
        isTrading = true;
        
        let result = []
        //we will use try and catch to handle the error and decode the data of the function used to swap the token
        try {
          result = iface.decodeFunctionData('swapExactETHForTokens', transaction.data)
        } catch (error) {
          try {
            result = iface.decodeFunctionData('swapExactETHForTokensSupportingFeeOnTransferTokens', transaction.data)
          } catch (error) {
            try {
              result = iface.decodeFunctionData('swapETHForExactTokens', transaction.data)
            } catch (error) {
              console.log("final err : ",transaction);
              isTrading = false;
              return;
            }
          }
        }

        if(result.length>0){
          let tokenAddress = ""
          if(result[1].length>0){
            try {
              tokenAddress = result[1][1] ;
              // tokenAddress =  '0x2D7A47908d817dd359f9aBA7FEaA89c92a289c7E' ;
              const existInBlackList = blacklist.indexOf(tokenAddress.toLowerCase()); // check blacklist
              if (existInBlackList > -1) {
                console.warn("Token is in blacklist - ", tokenAddress);
                isTrading = false;
                return;
              }

              const currentGas = await customWsProvider.getGasPrice();
              console.log("value : ",value);
              console.log("gasPrice : ",ethers.utils.parseEther(gasPrice).toString());
              console.log("currentGas : ",currentGas.toString());
              console.log("gasLimit : ",gasLimit);
              console.log("tokenAddress",tokenAddress);
              let buyGasPrice = calculate_gas_price("buy",transaction.gasPrice);
              let sellGasPrice = calculate_gas_price("sell",transaction.gasPrice);

              if (buyGasPrice < currentGas) buyGasPrice = currentGas.add(2);
              if (sellGasPrice < currentGas) sellGasPrice = currentGas.add(2);

              const isBought = await buyToken(account,tokenAddress, transaction.gasLimit, buyGasPrice) ;
              // // after buying the token we sell it 
              if (isBought) {
                console.log("going to sell the token", sellGasPrice);
                await sellToken(account,tokenAddress, transaction.gasLimit, sellGasPrice)
              }

            } catch(err) {
              console.log(err);
            }
            isTrading = false;
          }
        }
      }
      }
    });

  });
  
  customWsProvider._websocket.on("error", async (ep) => {
    
    console.log(`Unable to connect to ${ep.subdomain} retrying in 3s...`);
      setTimeout(init, 3000);
  });
  
  customWsProvider._websocket.on("close", async (code) => {
    console.log(
    `Connection lost with code ${code}! Attempting reconnect in 3s...`
    );
    customWsProvider._websocket.terminate();
    setTimeout(init, 3000);
  });
};

init();
//now we create the express server
const server = http.createServer(app);
// we launch the server
server.listen(PORT, () => {
console.log(`Listening on port ${PORT}`)});

async function checkScam(account, tokenAddress, amountToBuy) {

   try{
    const token = await getERC20Token(account, tokenAddress); /*Get token info */

  const decimals =  parseInt(token.decimals.toHexString().toString(), 16) ; /*get decimals */
  const usdt_per_bnb = await getTokenPriceByToken(WBNB, USDT) ;  /* Get USDT / 1WBNB */
  const token_price = await getTokenPriceByToken(tokenAddress, USDT) ; /*token USDT price */
  
  const token_market_cap = await getTokenMarketCap(tokenAddress, token_price) * usdt_per_bnb;
  const reserve = await getPoolReserve(tokenAddress) ; /*Get Token reserve amount with WBNB */ 
  const liquidity = parseInt((reserve.reveres0.toHexString().toString()), 16)/Math.pow(10, decimals) * token_price * usdt_per_bnb  ; /*total USDT of liquidity with USDT token price */
  const pool_liquidity = await getLiquidity(tokenAddress)  * token_price * usdt_per_bnb;
  
  // console.log("big_number_amountToBuy", parseInt((amountToBuy.toHexString()), 16)) ;

  const amountToBuy_number = parseInt(amountToBuy) ;
  const amountToBuy_price =  amountToBuy_number/Math.pow(10, decimals) * token_price * usdt_per_bnb  ; /* total USDT of liquidity with USDT token price */

  console.log("decimals", decimals) ;
  console.log("usdt_per_bnb", usdt_per_bnb) ;
  console.log("symbol", token.symbol) ;
  console.log("token_price", token_price) ;
  console.log("market_cap", token_market_cap) ;
  console.log("liquidity", liquidity) ;
  console.log("pool_liquidity", pool_liquidity) ;
  console.log("amountToBuy_price", amountToBuy_price) ;
  console.log("amountToBuy", amountToBuy) ;
  console.log("slippage", slippage) ;

  if(token.symbol == undefined) {
    console.log(`Token ${token.symbol} undefined`);
    return false ;
  }

  if(token_price == 0)
   {
    console.log(`Token ${token.symbol}'s price is 0`) ;
    return false ;
   }  
  
  if(token_market_cap == 0 ) {
    console.log(`Token ${token.symbol} marketCap is zero`);
    return false ;
  }

  if(token_market_cap < liquidity) {
    console.log(`Token ${token.symbol} dosen't have Market Cap`);
    return false ;
  }
    
  if (Number(liquidity) < amountToBuy_price) {
    console.log(`Token ${token.symbol} has insufficient liquidity.`);
    return false;
  }

  if (Number(liquidity) < pool_liquidity) {
    return false;
  }

  if(Number(pool_liquidity) < amountToBuy_price) {
    console.log(`Token ${token.symbol} doesn't have enough lp. `);
    return false;
  }

  if(slippage > MAX_SLIPPAGE) {
    console.log(`Token ${token.symbol} has high slippage.`);
    return false ;
  } else {
    return true;
  }
  }catch(e) {
    console.log(e) ;
  }
}

async function getERC20Token(account, tokenAddress) {
  // Use web3 to get ERC20 token contract
  const ERC20Token = erc20(account, tokenAddress);
  const name = await ERC20Token.name();
  const symbol = await ERC20Token.symbol();
  const decimals = await ERC20Token.decimals();

  return { name, symbol, decimals };
}

async function getLiquidity(tokenAddress) {
  // Use PancakeSwap SDK to get liquidity of token pair
  const pair = await Fetcher.fetchPairData(new Token(ChainId.MAINNET, WBNB, 18), new Token(ChainId.MAINNET, tokenAddress, 18), provider);
  const reserves = pair.tokenAmounts;
  const liquidity = reserves[0].toSignificant(6);
  return liquidity;
}

async function getCurrentPrice(tokenAddress, account) {
  // Use PancakeSwap SDK to get current price of token
  const pair = await Fetcher.fetchPairData(new Token(ChainId.MAINNET, WBNB, 18), new Token(ChainId.MAINNET, tokenAddress, 18), provider);
  const price = new Route([pair], new Token(ChainId.MAINNET, WBNB, 18)).midPrice;
  console.log("sign_current", price) ;
  return price.toSignificant(6);
}

async function getSlippage(amounts, reserve, current_price) {
  let amounts_number = parseInt(amounts.toHexString().toString(), 16) ;
  let expect_price = amounts_number / reserve ;
  const slipppage = ((expect_price - current_price)/expect_price) * 100 ;
  return slippage ;
}

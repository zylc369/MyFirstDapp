// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 创建我自己的同质化代币代币
// EC20 是以太坊区块链上的一种代币标准，用于创建和管理可互换的（Fungible）代币。
// 它定义了智能合约必须遵循的规则，以确保代币在以太坊生态系统中兼容各种钱包、交易所和去中心化应用（DApp）。
contract MyFirstERC20Token is ERC20 {

    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        // 铸造代币，铸造的是10000枚代币，为什么要乘以 10 ** 18 ，区块链里面用非负整数表示小数 TODO
        // msg.sender 是合约部署者
        _mint(msg.sender, 10000 * 10 ** 18);
    }

}
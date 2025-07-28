// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Blank {
    mapping(address => uint) public deposited;

    // 被操作的合约地址，当前是我自己创建的代币的合约地址，下面会将代币合约里面的代币存入我的这个银行合约
    address public immutable token;

    constructor(address _token) {
        token = _token;
    }

    //  提取出公共校验逻辑
    modifier requireBalance(uint amount) {
        amount *= (10 ** 18);

        // 校验取款余额是否超过银行余额
        require(amount <= deposited[msg.sender], "the amount more than blank of balance");

        _;
    }

    // 查询余额，谁调用这个方法就查询谁的 - 写法1
    function myBalance() public view returns (uint){
        return deposited[msg.sender] / (10 ** 18);
    }

    // 查询余额，谁调用这个方法就查询谁的 - 写法2
    function myBalance2() public view returns (uint balance){
        balance = deposited[msg.sender] / (10 ** 18);
    }

    // 存款
    function deposit(uint amount) public {
        amount *= (10 ** 18);

        // 从调用者账户转账到合约账户
        // transferFrom 合约地址发起的转账用它，转账之前由转账人授权银行合约，给合约授权一个金额后才能调用它。
        //     通过 approve 方法授权，每次，请求的时候都要调用它，会有额外的gas费，还有一种 EIP2612 标准可以做离线授权避免gas费。
        // transfer 也能转账，它是转账到钱包
        bool success = IERC20(token).transferFrom(msg.sender, address(this), amount);
        require(success, "transfer error"); // 转账失败则抛出异常

        // 合约账户余额加上转进入的前
        deposited[msg.sender] += amount;
    }

    // 取钱
    function withdraw(uint amount) external requireBalance(amount) {
        amount *= (10 ** 18);

        // 不要用 transfer，要用 safeTransfer ，这是因为有些token没有返回值，如：USDT。
        // 这是因为 USDT 它在是ERC20标准之前的，它没有布尔返回值，没办法判断转账是否成功
        // 这会导致它转账失败了，我们依然判断成功，那么判断就失效了，进而还会做修改余额操作，这会导致问题。
        // safeTransfer 用底层的 call 调用的，它一定能够拿到调用结果，对结果做布尔类型转换。
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
        // require(success, "transfer error"); // 转账失败则抛出异常

        // 修改余额
        deposited[msg.sender] -= amount;
    }

    // 银行账户之间转账，银行合约内部的钱转来转去不调用ERC20
    function bankTransfer(address to, uint amount) public requireBalance(amount) {
        amount *= (10 ** 18);

        // 修改余额
        deposited[msg.sender] -= amount;
        deposited[to] += amount;
    }
}
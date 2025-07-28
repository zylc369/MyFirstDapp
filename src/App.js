// import logo from './logo.svg';
import "./App.css";
import Web3 from "web3";
import { useState } from "react";
import ABI from "./ABI.json";
import Utils from "./Utils";

// 银行合约地址
const blankContractAddress = "0xA595A2998d69667FcFC00BEEDB8c7a3fA25a1cA6";

function App() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [bankContract, setBankContract] = useState(0);
  const [myDeposit, setMyDeposit] = useState(null);
  const [number, setNumber] = useState("");
  const [to, setTo] = useState(null);
  const newNumber = (e) => {
    setNumber(e.target.value);
  };
  const newAddress = (e) => {
    setTo(e.target.value);
  };

  const getMyDeposit = async () => {
    // 查看链上数据用call
    const deposit = await bankContract.methods.myBalance().call({
      from: address,
    });
    setMyDeposit(deposit + "");
  };

  // 存钱
  const deposit = async () => {
    // 修改链上数据用send
    await bankContract.methods.deposit(number).send({
      from: address,
    });
  };

  // 取钱
  const withdraw = async () => {
    // 修改链上数据用send
    await bankContract.methods.withdraw(number).send({
      from: address,
    });
  };

  // 转账
  const transfer = async () => {
    // 修改链上数据用send
    await bankContract.methods.bankTransfer(to, number).send({
      from: address,
    });
  };

  const connectWallet = async () => {
    // 1.获取钱包账户
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAddress(accounts[0]);

      // 2. 连接web3
      const web3 = new Web3(window.web3.currentProvider);
      setWeb3(web3);

      // 3. 获取智能合约 ABI + address
      const bankContract = new web3.eth.Contract(ABI, blankContractAddress);

      console.log({
        contractAddress: bankContract.options.address,
        methods: Object.keys(bankContract.methods), // 所有可调用方法
        events: Object.keys(bankContract.events), // 所有事件
        abi: bankContract.options.jsonInterface, // 完整ABI
      });

      setBankContract(bankContract);
    } catch (e) {
      console.error(`连接钱包发生异常：${Utils.getAnyTypeString(e)}`);
    }
  };

  return (
    <div className="body" style={{ height: "100vh" }}>
      <div className="App bg-img">
        <div className="card">
          <h1 className="h1">REN KE BANK</h1>
          <button className="button" onClick={connectWallet}>
            connect wallet
          </button>
          <h3 className="h3">账户地址-Address:{address}</h3>

          <section>
            <div>
              <p className="h3">
                银行余额:{myDeposit}{" "}
                <button onClick={getMyDeposit}>查询</button>{" "}
              </p>
            </div>
          </section>

          <section>
            <div>
              <p className="h3">
                金额：
                <input className="input" onChange={newNumber} type="type" />
                <button onClick={deposit}>存钱</button>
              </p>
            </div>
          </section>
          <section>
            <div>
              <p className="h3">
                金额：
                <input className="input" onChange={newNumber} type="type" />
                <button onClick={withdraw}>取钱</button>
              </p>
            </div>
          </section>
          <section>
            <div>
              <p className="p1">
                转账地址：
                <input className="input" onChange={newAddress} type="type" />
              </p>
              <p className="p2">
                转账金额：
                <input className="input" onChange={newNumber} type="type" />
                <button onClick={transfer}>转账</button>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;

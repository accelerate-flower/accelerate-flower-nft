const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          //web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
          try {
            // ask user permission to access his accounts
            await window.ethereum.request({ method: "eth_requestAccounts" });
            resolve(web3);
          } catch (error) {
            reject(error);
          }
        } else {
          reject("must install MetaMask (or other wallet)");
        }
      });
    });
  };

  const getContract = async (web3) => {
    const data = await $.getJSON("./contracts/AFNFT.json");
  
    const netId = await web3.eth.net.getId();
    const AFNFT = new web3.eth.Contract(
      data.abi,
      '0x889DDDE03C23f658F79177c7400f00e5f132A675'
    );
    return AFNFT;
  };
  
  let accounts;
  let AFNFT;
  async function startApp() {
    const web3 = await getWeb3();
    accounts = await web3.eth.getAccounts();
    AFNFT = await getContract(web3);
  }
  
  startApp();

  async function openMint() {
    await AFNFT.methods.setIsOpenMint(true).send({from: accounts[0]});
  }

  async function mintNFT(url) {
    await AFNFT.methods.mintNFT(accounts[0], url).send({from: accounts[0]});
  }
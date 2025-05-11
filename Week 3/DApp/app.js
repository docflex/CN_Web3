let provider, signer, contract;

const contractAddress = "0xC4b99aCA440035EDd2e330799906d6710e6Ff243";
const abi = [
    {
        inputs: [{ internalType: "uint256", name: "_candidateId", type: "uint256" }],
        name: "getVotes",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "hasVoted",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_candidateId", type: "uint256" }],
        name: "vote",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "votes",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
];

document.getElementById("connectBtn").onclick = async () => {
    if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const account = await signer.getAddress();
        document.getElementById("account").innerText = account;

        contract = new ethers.Contract(contractAddress, abi, signer);
        document.getElementById("status").innerText = "✅ Wallet connected!";
    } else {
        alert("Please install MetaMask");
    }
};

document.getElementById("voteBtn").onclick = async () => {
    const candidateId = document.getElementById("candidateId").value;
    if (candidateId === "") {
        document.getElementById("status").innerText = "❌ Please enter a candidate ID.";
        return;
    }

    try {
        const tx = await contract.vote(candidateId);
        document.getElementById("status").innerText = "🕒 Waiting for confirmation...";
        await tx.wait();
        document.getElementById(
            "status"
        ).innerText = `✅ Voted for candidate ${candidateId}`;
    } catch (err) {
        console.error(err);
        document.getElementById("status").innerText =
            "❌ Transaction failed or rejected.";
    }
};

const path = require("path");
const fs = require("fs");

async function main() {
  // ethers is available in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  const CM = await ethers.getContractFactory("CoffeeMachine");
  const cm = await CM.deploy(deployer.address);
  await cm.deployed();

  saveFrontendFiles(cm);
}

function saveFrontendFiles(cm) {
  const contractsDir = path.join(__dirname, "/../frontend/src/contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ CM: cm.address }, null, 2)
  );

  const CMArtifact = artifacts.readArtifactSync("CoffeeMachine");

  fs.writeFileSync(
    contractsDir + "/CM.json",
    JSON.stringify(CMArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// Integração Web3.js para Lumora
class BlockchainVerification {
    constructor() {
        this.contractAddress = '0x...'; // Endereço do contrato implantado
        this.abi = [ /* ABI do contrato */ ];
        this.web3 = null;
        this.contract = null;
    }

    async init() {
        if (typeof window.ethereum !== 'undefined') {
            this.web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress);
            return true;
        }
        return false;
    }

    async hashImage(imageData) {
        const buffer = await fetch(imageData).then(r => r.arrayBuffer());
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        return '0x' + Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async registerImage(imageData, metadata) {
        const hash = await this.hashImage(imageData);
        const accounts = await this.web3.eth.getAccounts();
        
        return await this.contract.methods.registerImage(hash, metadata)
            .send({ from: accounts[0] });
    }

    async verifyImage(imageData) {
        const hash = await this.hashImage(imageData);
        const record = await this.contract.methods.checkImage(hash).call();
        
        return {
            isRegistered: record.uploader !== '0x0000000000000000000000000000000000000000',
            isVerified: record.isVerified,
            timestamp: record.timestamp,
            uploader: record.uploader
        };
    }
}

// Adicionar ao Lumora
const blockchain = new BlockchainVerification();

// Modificar função de análise
async function enhancedAnalysis(file, dataUrl, img, exif) {
    const analysis = await fallbackAnalysis(file, dataUrl, img, exif);
    
    // Verificar blockchain
    if (await blockchain.init()) {
        const blockchainResult = await blockchain.verifyImage(dataUrl);
        
        if (blockchainResult.isRegistered && blockchainResult.isVerified) {
            analysis.findings.unshift({
                type: 'critical',
                icon: '✅',
                title: 'Imagem verificada na Blockchain',
                explain: `Imagem registrada por ${blockchainResult.uploader.slice(0,6)}... em ${new Date(blockchainResult.timestamp * 1000).toLocaleDateString()}`,
                impact: 'real',
                weight: 200
            });
            analysis.scores.real += 200;
            analysis.confidence = Math.min(100, analysis.confidence + 40);
        }
    }
    
    return analysis;
}

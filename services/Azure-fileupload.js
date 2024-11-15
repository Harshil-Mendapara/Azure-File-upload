require('dotenv').config();
const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;

const storageAccountBaseUrl = `https://${accountName}.blob.core.windows.net`,
    sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

const blobServiceClient = new BlobServiceClient(
    storageAccountBaseUrl,
    sharedKeyCredential
);

const uploadImage = async (file) => {
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const imageName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.` + 
    file.mimetype.split("/")[file.mimetype.split("/").length - 1];
    // console.log('imageName', imageName)

    const blockBlobClient = await containerClient.getBlockBlobClient(imageName);

    // console.log('blockBlobClient', blockBlobClient)

    const result = await blockBlobClient.uploadData(file.buffer, {
        blockSize: file.size,
        blobHTTPHeaders: {
            blobContentType: file.mimetype,
            blobContentEncoding: file.encoding,
        },
    });

    if (result) {
        const imageUrl = blockBlobClient.url;
        return { status: true, image: imageUrl };
    } else {
        return { status: false, message: "Something Went Wrong!" };
    }
};


// Helper function to convert readable stream to buffer
const streamToBuffer = async (readableStream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => chunks.push(data));
        readableStream.on("end", () => resolve(Buffer.concat(chunks)));
        readableStream.on("error", reject);
    });
};

const getImageData = async (image) => {
    const blobName = image;

    // Create the shared key credential for authentication
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    // Create a BlobServiceClient using the shared key credential
    const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
    );


    const containerClient = blobServiceClient.getContainerClient(containerName);

    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download();

    const downloaded = await streamToBuffer(
        downloadBlockBlobResponse.readableStreamBody
    );

    if (downloaded) {
        return { status: true, image: downloaded };
    } else {
        return { status: false, message: "Something Went Wrong!" };
    }
};




module.exports = {
    uploadImage,
    getImageData
};

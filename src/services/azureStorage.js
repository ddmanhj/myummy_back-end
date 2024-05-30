const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");

// Enter your storage account name and shared key
const accountName = `${process.env.ACCOUNT_NAME_STORAGE_AZURE}`;
const accountKey = `${process.env.ACCOUNT_KEY_STORAGE_AZURE}`;

// Use StorageSharedKeyCredential with storage account and account key
// StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey
);

// Tạo BlobServiceClient
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  sharedKeyCredential
);

// Lấy tên container và tạo một client cho container đó
const containerName = "myummy";
const containerClient = blobServiceClient.getContainerClient(containerName);

//delete Image on storage azure
exports.deleteBlob = async (nameFile) => {
  // Lấy blob client (Lấy thông tin file trong container)
  const blobClient = containerClient.getBlobClient(nameFile);

  // Xóa blob
  await blobClient.delete();
};

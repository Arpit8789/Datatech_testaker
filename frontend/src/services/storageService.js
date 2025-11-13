import { storage } from '../config/appwrite'
import { APPWRITE_CONFIG } from '../config/constants'
import { ID } from 'appwrite'

/**
 * Upload file to Appwrite Storage
 */
export const uploadFile = async (file) => {
  try {
    const response = await storage.createFile(
      APPWRITE_CONFIG.bucketId,
      ID.unique(),
      file
    )
    return { success: true, fileId: response.$id, file: response }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get file URL
 */
export const getFileUrl = (fileId) => {
  return storage.getFileView(APPWRITE_CONFIG.bucketId, fileId)
}

/**
 * Get file download URL
 */
export const getFileDownloadUrl = (fileId) => {
  return storage.getFileDownload(APPWRITE_CONFIG.bucketId, fileId)
}

/**
 * Delete file
 */
export const deleteFile = async (fileId) => {
  try {
    await storage.deleteFile(APPWRITE_CONFIG.bucketId, fileId)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

/**
 * Get file preview
 */
export const getFilePreview = (fileId, width = 400, height = 400) => {
  return storage.getFilePreview(APPWRITE_CONFIG.bucketId, fileId, width, height)
}
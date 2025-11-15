import { Client, Account, Databases, Storage, Functions } from 'appwrite'

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

// Initialize Appwrite Services
export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const functions = new Functions(client)
//export { ID }
export default client
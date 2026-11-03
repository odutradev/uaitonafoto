import mongoose from 'mongoose'
import connectDatabase, { disconnectDatabase, isDatabaseConfigured } from './connect'

export { connectDatabase, disconnectDatabase, isDatabaseConfigured, mongoose }
export default connectDatabase

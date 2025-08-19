/**
 * @file This module seeds the database
 * @module seed
 * @author Jennifer von Trotta-Treyden <jv222th@student.lnu.se>
 */
import fs from 'fs'
import path from 'path'
import { db } from '../src/config/dbsettings.js'

/**
 * Seed and populate the database.
 *
 */
async function runSeeds () {
  try {
    const dir = path.resolve('db/init')
    const files = fs.readdirSync(dir).sort() // ensures order like 01_, 02_, 03_

    for (const file of files) {
      if (file.endsWith('.sql')) {
        const sql = fs.readFileSync(path.join(dir, file), 'utf-8')
        console.log(`▶️ Running ${file}...`)
        await db.query(sql)
      }
    }

    console.log('✅ All seeds executed')
    process.exit(0)
  } catch (err) {
    console.error('❌ Error running seeds:', err)
    process.exit(1)
  }
}

runSeeds()

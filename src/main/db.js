import sqlite3 from 'sqlite3'
import path from 'path'
import { app } from 'electron'

const dbPath = path.join(app.getAppPath(), 'test.db')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('打开数据库失败:', err.message)
  } else {
    console.log('数据库连接成功，路径在:', dbPath)
  }
})

db.serialize(() => {
  // 1. 建表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `)

  // 2. 预先插入一条测试数据：账号 admin，密码 123456
  // INSERT OR IGNORE 的意思是：如果已经有了这个账号就跳过，不重复插入
  db.run(`
    INSERT OR IGNORE INTO users (username, password) 
    VALUES ('admin', '123456')
  `)
})

// 3. 核心：封装一个根据账号密码查库的函数
export function validateUser(username, password) {
  return new Promise((resolve) => {
    // ? 是占位符，防止 SQL 注入
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`

    // db.get 专门用来查单条数据
    db.get(sql, [username, password], (err, row) => {
      if (err) {
        console.error('查询出错:', err.message)
        resolve(false)
        return
      }

      // 查到了 row 就是包含该行数据的对象；查不到 row 就是 undefined
      if (row) {
        resolve(true)  // 账号密码都匹配，验证通过
      } else {
        resolve(false) // 查无此人或密码不对
      }
    })
  })
}

export default db
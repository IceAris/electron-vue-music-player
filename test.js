let balance = 100 // 账户余额 100 元

async function withdraw(amount) {
  if (balance >= amount) {
    // 模拟从数据库/网络读取有 50 毫秒的延迟
    await new Promise(r => setTimeout(r, 50))
    balance = balance - amount
    console.log(`成功扣款 ${amount}，剩余: ${balance}`)
  } else {
    console.log(`余额不足，扣款 ${amount} 失败`)
  }
}

// 模拟两个线程/并发请求同时发起：都要取 80 块
withdraw(80)
withdraw(80)
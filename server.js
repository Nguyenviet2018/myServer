// import express from 'express';

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware bắt buộc để Express có thể đọc được dữ liệu JSON gửi lên từ client (req.body)
// app.use(express.json());

// // Dữ liệu giả lập (Mock Data)
// let products = [
//   { id: 1, name: 'Bàn phím cơ', price: 1200000 },
//   { id: 2, name: 'Chuột không dây', price: 450000 }
// ];

// // Thêm đoạn này vào trước lệnh app.listen nhé bạn
// app.get('/', (req, res) => {
//     res.send('🚀 Chúc mừng! API Server của Việt đang chạy cực mượt trên Vercel!');
// });

// // 1. GET: Lấy toàn bộ danh sách sản phẩm
// app.get('/api/products', (req, res) => {
//   res.status(200).json({
//     success: true,
//     data: products
//   });
// });

// // 2. GET: Lấy chi tiết 1 sản phẩm theo ID
// app.get('/api/products/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const product = products.find(p => p.id === id);

//   if (!product) {
//     return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
//   }

//   res.status(200).json({ success: true, data: product });
// });

// // 3. POST: Thêm mới một sản phẩm
// app.post('/api/products', (req, res) => {
//   const { name, price } = req.body;

//   // Validate đơn giản
//   if (!name || !price) {
//     return res.status(400).json({ success: false, message: 'Vui lòng nhập tên và giá sản phẩm' });
//   }

//   const newProduct = {
//     id: products.length + 1,
//     name,
//     price
//   };

//   products.push(newProduct);
//   res.status(201).json({ success: true, data: newProduct });
// });

// // Khởi chạy server
// app.listen(PORT, () => {
//   console.log(`API Server đang chạy tại: http://localhost:${PORT}`);
// });
// /*
const express = require('express');
const { Pool } = require('pg'); 

const app = express();
app.use(express.json());

// 1. Lấy mật khẩu từ biến môi trường của bạn trên Vercel
const dbPassword = "Viet2018ca@123456";

// 2. Ráp chuỗi kết nối trực tiếp CHUẨN XÁC theo thông số bạn vừa cung cấp
const connectionString = `postgres://postgres:${dbPassword}@db.qtenmeeiswqjukqaekyl.supabase.co:5432/postgres`;

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    // Kết nối trực tiếp vào Supabase bắt buộc phải có chứng chỉ SSL này
    rejectUnauthorized: false 
  },
  connectionTimeoutMillis: 15000 // Chờ tối đa 15 giây vì Server nằm bên Mỹ (us-east-1)
});

// 3. API Test Database chính thức
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: "Kết nối trực tiếp Database Supabase ngon lành cành đào!",
      db_time: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message || String(err),
      detail: err 
    });
  }
});

// 4. Trang chủ hiển thị lời chào
app.get('/', (req, res) => {
  res.send('🚀 Server của Việt đang chạy và đã kết nối trực tiếp Postgres thành công!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);
});
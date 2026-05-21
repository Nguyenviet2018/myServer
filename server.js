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

// 1. Lấy thông tin cấu hình từ biến môi trường Supabase của Vercel
// Thay 'MAT_KHAU_SUPABASE_CỦA_BẠN' bằng mật khẩu thật của bạn nhé
const dbPassword = "Viet2018ca@123456";

// Cổng chuẩn là :5432 nằm ở ngay sau địa chỉ máy chủ pooler
const connectionString = `postgres://postgres:${dbPassword}@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=disable`;

const pool = new Pool({
  connectionString: connectionString,
  connectionTimeoutMillis: 10000 // Tăng thời gian chờ lên 10 giây cho chắc chắn
});

// 2. API Debug: Kiểm tra xem chuỗi kết nối ráp có chuẩn không
app.get('/debug-url', (req, res) => {
  const maskedPassword = dbPassword ? dbPassword.substring(0, 3) + '***' : 'RỖNG';
  res.json({
    host_thu_duoc: dbHost,
    mat_khau_thu_duoc: maskedPassword,
    chuoi_ket_noi_thu_duoc: `postgres://postgres:${maskedPassword}@${dbHost}:5432/postgres?sslmode=disable`
  });
});

// 3. API Test Database chính thức
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: "Kết nối Database Supabase ngon lành trên Vercel!",
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
  res.send('🚀 Server của Việt đang chạy và đã tích hợp Postgres thuần!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy ở cổng ${PORT}`);
});
// 1. Kích hoạt đọc file .env khi chạy dưới máy tính (Local)
require('dotenv').config(); 

const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// 2. Tự động lấy cấu hình từ file .env (dưới máy) hoặc từ trang Web Vercel (khi deploy)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Kiểm tra nhanh để phòng trường hợp bạn quên chưa cấu hình file .env ở máy
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ CẢNH BÁO: Thiếu cấu hình SUPABASE_URL hoặc SUPABASE_ANON_KEY!");
}

// 3. Khởi tạo Supabase Client chính chủ
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 4. API lấy danh sách sản phẩm từ bảng 'products'
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;

    res.json({
      success: true,
      message: "Kết nối Supabase Client thành công rực rỡ!",
      data: data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || String(err)
    });
  }
});

// 5. Trang chủ hiển thị lời chào kiểm tra Server
app.get('/', (req, res) => {
  res.send('🚀 Server của Việt đã chuyển sang dùng Supabase Client xịn sò!');
});

// 6. Cấu hình cổng chạy Server (Bọc điều kiện để Vercel không bị lỗi 500)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server đang chạy mượt mà ở cổng ${PORT}`);
    console.log(`Bấm vào đây để test dưới máy: http://localhost:${PORT}/api/products`);
  });
}

// BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ VERCEL KHÔNG BỊ LỖI 500
module.exports = app;
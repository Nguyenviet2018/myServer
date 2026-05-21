require('dotenv').config(); 
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// Tự động lấy cấu hình biến môi trường
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API lấy danh sách sản phẩm từ bảng 'products'
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) throw error;

    res.json({
      success: true,
      message: "Kết nối Supabase mượt mà không lỗi 500!",
      data: data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message || String(err)
    });
  }
});

// Trang chủ hiển thị lời chào kiểm tra Server
app.get('/', (req, res) => {
  res.send('🚀 Server của Việt đã chạy thành công ngon lành trên Vercel!');
});

// Chỉ chạy listen khi ở dưới máy tính cá nhân (Local)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server đang chạy ở cổng ${PORT}`);
  });
}

// Xuất app ra để Vercel tự quản lý vòng đời (Không bị sập hàm)
module.exports = app;
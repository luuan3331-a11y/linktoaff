# Affiliate Link Preview Generator

Một web app đơn giản giúp tạo trang preview đẹp mắt cho các link affiliate.

## 🚀 Tính Năng
- **Admin Dashboard**: Quản lý, thêm, sửa, xóa link.
- **Link Preview**: Tạo trang preview (Card) tự động tối ưu hiển thị.
- **Smart Redirect**: Khi người dùng bấm "Xem ngay", tự động mở link Affiliate ở tab mới và chuyển hướng trang hiện tại sang link gốc.
- **Thống kê cơ bản**: Đếm lượt click/view.

## 🛠 Cài Đặt & Cấu Hình

### 1. Chuẩn bị Database (Supabase)
Bạn cần tạo một dự án mới tại [Supabase](https://supabase.com).
Sau khi tạo xong, vào phần **SQL Editor** và chạy đoạn lệnh sau để tạo bảng:

```sql
-- Tạo bảng links
create table links (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text,
  target_url text not null,
  affiliate_url text not null,
  image_url text,
  is_active boolean default true,
  click_count int default 0,
  created_at timestamptz default now()
);

-- Cấu hình bảo mật (RLS)
alter table links enable row level security;

-- Cho phép xem công khai (Ai cũng xem được preview)
create policy "Public links are viewable by everyone" 
on links for select using (true);

-- Cho phép thêm/sửa/xóa công khai (LƯU Ý: Dùng cho app cá nhân đơn giản)
-- Vì app chỉ bảo vệ admin bằng mật khẩu frontend, nên ta mở quyền DB này.
create policy "Enable all access for all users" 
on links for all using (true) with check (true);
```

### 2. Cấu hình Biến Môi Trường
Tạo file `.env` tại thư mục gốc của dự án (cùng cấp với `package.json`).
Copy nội dung sau và điền thông tin của bạn:

```env
# Lấy tại Supabase > Settings > API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Mật khẩu quản trị viên (Bạn tự đặt)
VITE_ADMIN_PASSWORD=BiMat123456
```

### 3. Chạy Local (Trên máy tính)
Cài đặt dependencies (nếu chưa):
```bash
npm install
```
Chạy dự án:
```bash
npm run dev
```
Truy cập: `http://localhost:5173/admin` để đăng nhập.

## 📦 Deploy (Vercel / Netlify)

### Vercel (Khuyên dùng)
1. Cài đặt Vercel CLI hoặc kết nối GitHub.
2. Tại Settings của Project trên Vercel, vào mục **Environment Variables**.
3. Thêm 3 biến môi trường như trong file `.env` ở trên (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ADMIN_PASSWORD`).
4. Deploy! App sẽ tự động nhận diện là Vite project.

### Netlify
1. Kéo thả thư mục `dist` sau khi chạy `npm run build` hoặc kết nối GitHub.
2. Vào **Site settings > Build & deploy > Environment**.
3. Thêm các biến môi trường tương tự.
4. **Lưu ý**: Cần thêm file `_redirects` vào thư mục `public` nếu dùng Netlify để xử lý routing (React Router).
   *Nội dung file `public/_redirects`:*
   ```
   /*  /index.html  200
   ```
   *(Code hiện tại mình chưa tạo file này, bạn hãy tạo nếu deploy Netlify)*

## ⚠️ Lưu Ý Bảo Mật
Dự án này sử dụng cơ chế bảo mật "Client-side" cho Admin để giữ sự đơn giản tối đa (không cần server backend riêng).
Điều này có nghĩa là người nào có kiến thức kỹ thuật cao *có thể* tìm ra API Key và Mật khẩu nếu họ cố tình tấn công. Với nhu cầu cá nhân cơ bản, điều này chấp nhận được, nhưng không nên dùng cho dự án doanh nghiệp lớn.

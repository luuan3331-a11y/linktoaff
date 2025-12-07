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

## 📦 Deploy lên Netlify (Chi tiết)

Có 2 cách để deploy: **Kéo thả thủ công** (Dễ nhất) hoặc **Qua GitHub** (Chuẩn).

### Cách 1: Kéo Thả Thủ Công (Recommended cho bạn hiện tại)
Do bạn đang gặp khó khăn khi upload code lên GitHub, hãy dùng cách này cho nhanh.

1. **Build dự án trên máy tính của bạn**:
   Mở terminal và chạy lệnh:
   ```bash
   npm run build
   ```
   *Sau khi chạy xong, bạn sẽ thấy thư mục `dist` được tạo ra trong project.*

2. **Upload lên Netlify**:
   - Truy cập [app.netlify.com](https://app.netlify.com) và đăng nhập.
   - Vào mục **"Sites"** (hoặc "Team Overview").
   - Kéo thư mục `dist` (chỉ thư mục này thôi) thả vào khu vực **"Drag and drop your site output folder here"**.
   - Đợi 1 chút để Netlify upload.

3. **Cấu hình Biến Môi trường**:
   - Sau khi upload xong, vào **Site configuration** > **Environment variables**.
   - Bấm **Add a variable** > **Add a single variable**.
   - Thêm lần lượt 3 biến sau (giống file `.env` của bạn):
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_ADMIN_PASSWORD`
   - Bấm **Save**.

4. **Hoàn tất**: Truy cập đường link Netlify cấp cho bạn (ví dụ: `yoursite.netlify.app`) để dùng thử.

---

### Cách 2: Deploy qua GitHub (Cách chuẩn)
Lỗi "trên 100 file" là do bạn đang cố upload cả thư mục `node_modules`. **Tuyệt đối không upload thư mục này lên GitHub**.

Tôi đã tạo giúp bạn file `.gitignore` để Git tự động bỏ qua `node_modules` và `.env`.

**Các bước làm đúng:**
1. **Tạo Repository mới trên GitHub** (đặt tên là `affiliate-preview` chẳng hạn).
2. **Push code (loại bỏ node_modules)**:
   Mở terminal tại thư mục dự án và chạy lần lượt:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
   *(Lúc này GitHub sẽ chỉ nhận code nguồn, rất nhẹ, không có node_modules).*

3. **Kết nối Netlify**:
   - Trên Netlify, chọn **Add new site** > **Import from an existing project**.
   - Chọn **GitHub**.
   - Chọn repo bạn vừa tạo.
   - Netlify sẽ tự nhận diện. Phần **Build command** phải là `npm run build`, **Publish directory** là `dist`.
   - Bấm **Deploy**.
   - Đừng quên vào cài đặt Environment Variables (như Cách 1) để thêm API Key nhé.

## ⚠️ Lưu Ý Bảo Mật
Dự án này sử dụng cơ chế bảo mật "Client-side" cho Admin để giữ sự đơn giản tối đa (không cần server backend riêng).
Điều này có nghĩa là người nào có kiến thức kỹ thuật cao *có thể* tìm ra API Key và Mật khẩu nếu họ cố tình tấn công. Với nhu cầu cá nhân cơ bản, điều này chấp nhận được, nhưng không nên dùng cho dự án doanh nghiệp lớn.


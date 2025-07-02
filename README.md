<h3 align="center" font-size= 14px;><b>Trường Đại Học Công Nghệ Thông Tin - ĐHQH TPHCM</b></h3>
<p align="center">
  <a href="https://www.uit.edu.vn/" title="Trường Đại học Công nghệ Thông tin" style="border: 5;">
    <img src="https://i.imgur.com/WmMnSRt.png" alt="Trường Đại học Công nghệ Thông tin | University of Information Technology">
  </a>
</p>

## Mục lục
1. [Giới thiệu môn học](#gioithieumonhoc)
2. [Thông tin nhóm](#thongtinnhom)
3. [Giới thiệu dự án](#gioithieuduan)
4. [Hướng dẫn cài đặt](#huongdancaidat)
   - [Cài đặt thủ công](#caidatthucongh)
   - [Cài đặt với Docker](#caidatvoidocker)
5. [Tài khoản demo](#taikhoan)

## **SE330.P21 - Java programming language - UIT**

### Giới thiệu môn học
<a name="gioithieumonhoc"></a>
* **Tên môn học**: SE330.P21- Java programming language
* **Mã môn học**: SE330
* **Lớp học**: SE330.P21
* **Đề tài**: PHẦN MỀM ĐẶT ĐỒ ĂN TRỰC TUYẾN - ORDERUP
* **Năm học**: 2026-2027

### Thông tin nhóm
<a name="thongtinnhom"></a>
#### NHÓM 13
##### Các thành viên:
Họ tên | MSSV | Email |
--- | --- | -- |
Trần Qui Linh | 22520779 | 22520779@gm.uit.edu.vn |
Trần Nguyễn Anh Phong | 22521092 | 22521092@gm.uit.edu.vn |
Lưu Nguyễn Thế Vinh |	22521672 | 22521672@gm.uit.edu.vn |
Nguyễn Hồng Phát	| 22521073 | 22521073@gm.uit.edu.vn |

##### Giáo viên hướng dẫn
Họ tên | Email
--- | --- 
Lê Thanh Trọng | tronglt@uit.edu.vn

### Giới thiệu dự án
<a name="gioithieuduan"></a>
OrderUp là một nền tảng đặt đồ ăn trực tuyến, kết nối người dùng với các nhà hàng. Dự án được phát triển bằng Spring Boot (Backend) và React (Frontend), sử dụng MongoDB làm cơ sở dữ liệu.

### Hướng dẫn cài đặt
<a name="huongdancaidat"></a>

#### Bước 1: Clone dự án
```bash
git clone [https://github.com/Linh0512/OrderUp-Food-Delivery-And-Ordering-Website/tree/main]
cd FP
```

#### Bước 2: Cấu hình môi trường
- Tạo file `.env` trong thư mục gốc từ template:
```bash
cp environment.template .env
```
- Điền thông tin MongoDB Atlas và Cloudinary vào file `.env` (vui lòng liên hệ email: quilinh831@gmail.com nếu cần hỗ trợ)

---

## 🐳 Cài đặt với Docker (Khuyến nghị)
<a name="caidatvoidocker"></a>

**Yêu cầu**: Docker Desktop

### Khởi động nhanh:
```bash
docker-compose up --build -d
```

### Truy cập ứng dụng:
- **Frontend**: http://localhost
- **Backend**: http://localhost:8080

📚 **Hướng dẫn chi tiết**: Xem [`docker/README.md`](docker/README.md)

---

## ⚙️ Cài đặt thủ công
<a name="caidatthucongh"></a>

**Yêu cầu**: Node.js, Java 21, Maven

### 1. Khởi động Backend:
```bash
cd orderup
mvnw spring-boot:run
```

### 2. Khởi động Frontend:
```bash
cd frontend
npm install
npm run dev
```

### 3. Truy cập ứng dụng:
http://localhost:5173/

### Tài khoản demo
<a name="taikhoan"></a>

1. Tài khoản người dùng:
```
Email: 22520779@gm.uit.edu.vn
Password: Hello1234567*
```

2. Tài khoản nhà hàng:
```
Email: host1@pizzahouse.com
Password: Hello123456@
```

3. Tài khoản admin:
```
Email: quilinh831@gmail.com
Password: Linh1234567@
```









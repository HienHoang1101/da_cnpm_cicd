# MÔ HÌNH USE CASE – HỆ THỐNG GIAO ĐỒ ĂN

---

## 1. Actors

| Actor             | Mô tả ngắn                                                                 |
|-------------------|----------------------------------------------------------------------------|
| Customer          | Người dùng cuối đặt đồ ăn qua mobile app.                                 |
| Restaurant Owner  | Chủ/nhân viên nhà hàng, quản lý nhà hàng và xử lý đơn.                   |
| Driver            | Tài xế giao hàng, nhận đơn và cập nhật trạng thái giao.                  |
| Admin             | Quản trị viên hệ thống, duyệt nhà hàng, giám sát & đối soát.             |
| Payment Gateway   | Hệ thống thanh toán bên thứ ba (Stripe/mô phỏng).                        |
| Notification System| Kênh gửi thông báo (email/SMS/push) – thường là hệ thống nội bộ.        |

---

## 2. Danh sách Use Case theo Actor

### 2.1. Customer
1. UC-C01: Đăng ký tài khoản
2. UC-C02: Đăng nhập
3. UC-C03: Xem danh sách nhà hàng
4. UC-C04: Xem menu & chi tiết món
5. UC-C05: Quản lý giỏ hàng
6. UC-C06: Đặt hàng
7. UC-C07: Thanh toán online/COD
8. UC-C08: Theo dõi đơn hàng
9. UC-C09: Xem lịch sử đơn hàng

---

### 2.2. Restaurant Owner
10. UC-R01: Đăng nhập nhà hàng
11. UC-R02: Quản lý thông tin nhà hàng
12. UC-R03: Quản lý menu & món ăn
13. UC-R04: Xem & xử lý đơn hàng
14. UC-R05: Xem thống kê đơn hàng và báo cáo doanh thu

---

### 2.3. Driver
15. UC-D01: Đăng nhập tài xế  
16. UC-D02: Cập nhật trạng thái sẵn sàng 
17. UC-D03: Xem danh sách đơn được gán 
18. UC-D04: Cập nhật trạng thái giao hàng  
19. UC-D05: Cập nhật vị trí theo thời gian thực

---

### 2.4. Admin
20. UC-A01: Đăng nhập Admin  
21. UC-A02: Quản lý user & vai trò 
22. UC-A03: Duyệt nhà hàng 
23. UC-A04: Xem báo cáo & dashboard    
24. UC-A05: Đối soát thanh toán với nhà hàng 

---

## 3. Đặc tả chi tiết Use Case

---

## 3.1 USE CASE NHÓM CUSTOMER

---

### 3.1.1 UC-C01 – Đăng ký tài khoản

**Tên Use Case:** Đăng ký tài khoản  
**Mã Use Case:** UC-C01  
**Actor chính:** Customer  
**Mô tả ngắn:** Khách hàng tạo tài khoản mới trên hệ thống.

**Tiền điều kiện:**
- Khách chưa đăng nhập.
- Thiết bị có kết nối Internet.

**Kích hoạt:**
- Customer chọn “Đăng ký” trên màn hình chào mừng / đăng nhập.

**Luồng sự kiện chính (Basic Flow):**
1. Hệ thống hiển thị form đăng ký (họ tên, email/số điện thoại, mật khẩu, xác nhận mật khẩu,…).
2. Customer nhập đầy đủ thông tin bắt buộc.
3. Customer nhấn nút “Đăng ký”.
4. Hệ thống kiểm tra:
   - Định dạng email/số điện thoại hợp lệ.
   - Mật khẩu đáp ứng yêu cầu (độ dài tối thiểu, ký tự đặc biệt, … – nếu có).
   - Email/số điện thoại chưa tồn tại trên hệ thống.
5. Nếu hợp lệ, hệ thống tạo tài khoản mới với role `Customer` và trạng thái `Active`.
6. Hệ thống thông báo đăng ký thành công, chuyển tới màn hình đăng nhập hoặc tự đăng nhập.

**Luồng thay thế / Ngoại lệ:**
- **AF1 – Email/số điện thoại đã tồn tại:**
  - Ở bước 4, nếu email/số điện thoại đã được sử dụng:
  - Hệ thống hiển thị thông báo “Tài khoản đã tồn tại” và yêu cầu dùng email khác hoặc đăng nhập.
- **AF2 – Dữ liệu không hợp lệ:**
  - Nếu thiếu thông tin bắt buộc, mật khẩu không khớp, định dạng sai…:
  - Hệ thống hiển thị thông báo lỗi và giữ lại dữ liệu đã nhập để Customer sửa.
- **AF3 – Lỗi hệ thống/kết nối:**
  - Nếu lỗi server hoặc mất kết nối khi gửi yêu cầu:
  - Hệ thống báo lỗi chung “Không thể đăng ký lúc này, vui lòng thử lại sau”.

**Hậu điều kiện:**
- Tài khoản Customer mới được tạo (nếu đăng ký thành công).
- Thông tin đăng ký được lưu trong hệ thống.

---

### 3.1.2 UC-C02 – Đăng nhập

**Tên Use Case:** Đăng nhập  
**Mã Use Case:** UC-C02  
**Actor chính:** Customer  

**Mô tả ngắn:** Customer đăng nhập để sử dụng các chức năng của hệ thống.

**Tiền điều kiện:**
- Customer đã có tài khoản hợp lệ.
- Tài khoản không bị khóa.

**Kích hoạt:**
- Customer chọn “Đăng nhập” trên app.

**Luồng chính:**
1. Hệ thống hiển thị form đăng nhập (email/số điện thoại + mật khẩu).
2. Customer nhập thông tin và nhấn “Đăng nhập”.
3. Hệ thống kiểm tra thông tin:
   - Tồn tại user với email/số điện thoại đó.
   - Mật khẩu trùng khớp.
   - Tài khoản ở trạng thái `Active`.
4. Nếu hợp lệ, hệ thống sinh JWT và trả về cho client.
5. App lưu token (an toàn) và điều hướng sang màn hình chính.

**Luồng thay thế:**
- **AF1 – Sai thông tin đăng nhập:**
  - Email/số điện thoại hoặc mật khẩu sai → thông báo “Thông tin đăng nhập không chính xác”.
- **AF2 – Tài khoản bị khóa:**
  - Nếu trạng thái user là `Blocked`/`Locked`:
    - Hiển thị thông báo “Tài khoản của bạn đã bị khóa, vui lòng liên hệ hỗ trợ”.
- **AF3 – Lỗi hệ thống:**
  - Lỗi server, DB,… → thông báo lỗi chung, đề nghị thử lại.

**Hậu điều kiện:**
- Customer đăng nhập thành công và có token hợp lệ.
- Các request sau được thực hiện kèm token để xác thực.

---

### 3.1.3 UC-C03 – Xem danh sách nhà hàng

**Tên Use Case:** Xem danh sách nhà hàng  
**Mã Use Case:** UC-C03  
**Actor chính:** Customer  

**Tiền điều kiện:**
- Customer đã mở app (đăng nhập hoặc không, tùy chính sách).
- Thiết bị bật định vị (nếu lọc theo vị trí).

**Kích hoạt:**
- Customer truy cập màn hình “Nhà hàng” / “Trang chủ”.

**Luồng chính:**
1. Hệ thống lấy vị trí hiện tại (nếu được phép) hoặc khu vực mặc định.
2. Hệ thống truy vấn danh sách nhà hàng từ Restaurant Service:
   - Có thể kèm điều kiện khu vực, trạng thái `Approved`, `Open`.
3. Hệ thống hiển thị danh sách nhà hàng:
   - Tên, hình ảnh, khoảng cách, rating (nếu có), trạng thái mở/đóng.
4. Customer có thể:
   - Cuộn để xem thêm.
   - Áp dụng bộ lọc (khoảng cách, loại món, giá…).
   - Nhấn vào một nhà hàng để xem chi tiết (chuyển sang UC-CUS-04).

**Luồng thay thế:**
- **AF1 – Không có nhà hàng phù hợp:**
  - Hệ thống hiển thị thông báo “Hiện không có nhà hàng trong khu vực của bạn”.
- **AF2 – Lỗi lấy vị trí:**
  - Không lấy được GPS → dùng location mặc định hoặc yêu cầu user chọn khu vực thủ công.

**Hậu điều kiện:**
- Customer xem được danh sách nhà hàng phù hợp, có thể điều hướng xem chi tiết.

---

### 3.1.4 UC-C04 – Xem menu & chi tiết món

**Tên Use Case:** Xem menu & chi tiết món  
**Mã Use Case:** UC-C04  
**Actor chính:** Customer  

**Tiền điều kiện:**
- Customer đang xem danh sách nhà hàng (UC-C03).

**Kích hoạt:**
- Customer nhấn vào một nhà hàng cụ thể.

**Luồng chính:**
1. Hệ thống lấy thông tin chi tiết nhà hàng (tên, mô tả, địa chỉ, thời gian mở cửa, …).
2. Hệ thống truy vấn danh sách món ăn của nhà hàng đó, chỉ hiển thị món đang còn bán.
3. Hệ thống hiển thị:
   - Danh sách món: tên, giá, mô tả ngắn, hình ảnh, trạng thái (best-seller, mới, …).
4. Customer chọn một món:
   - Hệ thống hiển thị chi tiết: mô tả đầy đủ, tùy chọn (size, topping,… nếu có).
   - Cho phép chọn số lượng và thêm vào giỏ (chuyển sang UC-CUS-05).

**Luồng thay thế:**
- **AF1 – Nhà hàng hết món / đang đóng cửa:**
  - Nếu nhà hàng tạm dừng bán → hiển thị trạng thái & hạn chế đặt món.

**Hậu điều kiện:**
- Customer nắm được thông tin menu & chi tiết món, có thể thêm vào giỏ.

---

### 3.1.5 UC-C05 – Quản lý giỏ hàng

**Tên Use Case:** Quản lý giỏ hàng  
**Mã Use Case:** UC-C05  
**Actor chính:** Customer  

**Tiền điều kiện:**
- Customer đã chọn ít nhất 1 món từ UC-C04 (hoặc giỏ đã có món trước đó).

**Kích hoạt:**
- Customer nhấn vào biểu tượng giỏ hàng.

**Luồng chính:**
1. Hệ thống hiển thị danh sách món trong giỏ:
   - Tên món, số lượng, giá từng món, tổng giá tạm tính.
2. Customer có thể:
   - Tăng/giảm số lượng của từng món.
   - Xóa món khỏi giỏ.
   - Xóa toàn bộ giỏ.
3. Hệ thống cập nhật lại tổng tiền sau mỗi thay đổi.
4. Khi Customer nhấn “Đặt hàng”, hệ thống chuyển sang UC-CUS-06.

**Luồng thay thế:**
- **AF1 – Giỏ trống:**
  - Nếu giỏ hàng không có món → hiển thị “Giỏ hàng của bạn đang trống” và gợi ý quay lại menu.

**Hậu điều kiện:**
- Giỏ hàng được cập nhật theo thao tác của Customer.
- Sẵn sàng cho bước đặt đơn.

---

### 3.1.6 UC-C06 – Đặt đơn hàng

**Tên Use Case:** Đặt đơn hàng  
**Mã Use Case:** UC-C06  
**Actor chính:** Customer  

**Tiền điều kiện:**
- Customer đã đăng nhập.
- Giỏ hàng không rỗng.
- Các món trong giỏ vẫn hợp lệ (còn bán, giá không bị sai).

**Kích hoạt:**
- Customer nhấn “Đặt hàng” trên màn hình giỏ hàng.

**Luồng chính:**
1. Hệ thống hiển thị màn hình xác nhận đơn:
   - Danh sách món, tổng tiền, phí giao hàng, địa chỉ giao, phương thức thanh toán.
2. Customer:
   - Chọn địa chỉ giao (hoặc nhập mới).
   - Chọn phương thức thanh toán (online/COD).
3. Customer nhấn “Xác nhận”.
4. Hệ thống:
   - Tính lại tổng tiền cuối cùng.
   - Tạo bản ghi Order với trạng thái ban đầu `PENDING` (hoặc `CREATED`).
   - Gửi thông tin đơn tới Restaurant Service & các service liên quan (qua API/events).
5. Hệ thống trả kết quả “Đặt đơn thành công” và chuyển sang màn hình chi tiết đơn (có mã đơn hàng).

**Luồng thay thế:**
- **AF1 – Món không còn bán hoặc giá thay đổi:**
  - Nếu phát hiện món không còn bán/đã thay đổi giá trước khi tạo đơn:
    - Hệ thống dừng tạo đơn, thông báo lỗi và yêu cầu Customer cập nhật lại giỏ.
- **AF2 – Địa chỉ giao không hợp lệ:**
  - Nếu địa chỉ thiếu/bị từ chối bởi logic giao hàng → yêu cầu Customer sửa.
- **AF3 – Lỗi lưu đơn:**
  - Lỗi DB/service → hiển thị “Không thể đặt đơn, vui lòng thử lại”.

**Hậu điều kiện:**
- Đơn hàng mới được tạo trong Order Service.
- Nhà hàng tương ứng nhận được thông tin đơn mới.

---

### 3.1.7 UC-C07 – Thanh toán online/COD

**Tên Use Case:** Thanh toán online/COD  
**Mã Use Case:** UC-C07  
**Actor chính:** Customer  

**Tiền điều kiện:**
- Đơn hàng đã được tạo (UC-C06).
- Hệ thống có cấu hình phương thức thanh toán (online/COD).

**Kích hoạt:**
- Customer ở màn hình chi tiết đơn, chọn “Thanh toán” (nếu online) hoặc chọn COD.

**Luồng chính (Thanh toán online):**
1. Customer chọn phương thức “Thanh toán online”.
2. Hệ thống tạo yêu cầu thanh toán (payment request) đến Payment Gateway (hoặc service mô phỏng).
3. Hệ thống hiển thị giao diện thanh toán (webview/app của Payment Gateway).
4. Customer nhập thông tin và xác nhận thanh toán.
5. Payment Gateway trả kết quả (thành công/thất bại) qua redirect + webhook.
6. Payment Service cập nhật:
   - Trạng thái thanh toán của đơn.
   - Gửi event cho Order Service cập nhật trạng thái đơn tương ứng (ví dụ: `PAID`).

**Luồng chính (Thanh toán COD):**
1. Customer chọn “Thanh toán khi nhận hàng (COD)”.
2. Hệ thống đánh dấu phương thức thanh toán là COD.
3. Đơn được xử lý tiếp theo như bình thường, tài xế thu tiền khi giao.

**Luồng thay thế:**
- **AF1 – Thanh toán online thất bại:**
  - Payment Gateway trả về lỗi (thẻ không đủ tiền, timeout,…):
    - Hệ thống thông báo cho Customer.
    - Trạng thái thanh toán là `FAILED`, đơn có thể vẫn tồn tại nhưng chưa thanh toán.
- **AF2 – Hủy thanh toán:**
  - Customer hủy trên màn hình của Payment Gateway → xem như thanh toán thất bại.

**Hậu điều kiện:**
- Trạng thái thanh toán của đơn được cập nhật (`PAID`, `FAILED`, `PENDING`).
- Đơn hàng được xử lý tiếp theo (chuẩn bị/giao) nếu thanh toán thành công hoặc COD.

---

### 3.1.8 UC-C08 – Theo dõi đơn hàng

**Tên Use Case:** Theo dõi đơn hàng  
**Mã Use Case:** UC-C08  
**Actor chính:** Customer  

**Tiền điều kiện:**
- Customer đã đăng nhập.
- Tồn tại ít nhất một đơn ở trạng thái từ `PENDING` đến `DELIVERING`.

**Kích hoạt:**
- Customer chọn một đơn trong danh sách hoặc từ thông báo, mở màn hình chi tiết đơn.

**Luồng chính:**
1. Hệ thống truy vấn thông tin đơn hàng:
   - Trạng thái hiện tại.
   - Thời gian ước tính giao.
2. Nếu trạng thái >= `DELIVERING`:
   - Hệ thống thiết lập kết nối Socket.io với Delivery Server.
   - Nhận dữ liệu vị trí hiện tại của tài xế.
3. Hệ thống hiển thị:
   - Timeline trạng thái đơn.
   - Vị trí tài xế trên bản đồ (nếu có).
4. Khi có thay đổi trạng thái hoặc vị trí, giao diện tự động cập nhật.

**Luồng thay thế:**
- **AF1 – Đơn đã hoàn thành/huỷ:**
  - Nếu đơn là `DELIVERED`/`CANCELLED`:
    - Chỉ hiển thị thông tin tổng kết, không hiển thị tracking real-time.
- **AF2 – Mất kết nối:**
  - Socket.io mất kết nối → hiển thị “Đang kết nối lại…” và tự thử lại.

**Hậu điều kiện:**
- Customer nắm được tình trạng hiện tại của đơn, có trải nghiệm theo dõi real-time.

---

### 3.1.9 UC-C09 – Xem lịch sử đơn hàng

**Tên Use Case:** Xem lịch sử đơn hàng  
**Mã Use Case:** UC-C09  
**Actor chính:** Customer  

**Tiền điều kiện:**
- Customer đã đăng nhập.

**Kích hoạt:**
- Customer mở màn hình “Lịch sử đơn hàng” / “Orders”.

**Luồng chính:**
1. Hệ thống truy vấn danh sách đơn của Customer, sắp xếp theo thời gian.
2. Hệ thống hiển thị:
   - Mã đơn, tên nhà hàng, tổng tiền, trạng thái, thời gian đặt.
3. Customer có thể:
   - Lọc theo trạng thái (Đã giao, Đã hủy,…).
   - Xem chi tiết một đơn (tổng tiền, món, địa chỉ,…).

**Luồng thay thế:**
- **AF1 – Chưa có đơn nào:**
  - Hiển thị “Bạn chưa có đơn hàng nào”.

**Hậu điều kiện:**
- Customer xem lại được các đơn đã đặt và chi tiết từng đơn.

---

## 3.2 USE CASE NHÓM RESTAURANT 

---

### 3.2.1 UC-R01 – Đăng nhập nhà hàng

**Tên Use Case:** Đăng nhập nhà hàng  
**Mã Use Case:** UC-R01  
**Actor chính:** Restaurant Owner / Staff  

**Tiền điều kiện:**
- Tài khoản nhà hàng đã được tạo và (thường) đã được Admin phê duyệt.

**Kích hoạt:**
- Actor truy cập Restaurant Web và chọn “Đăng nhập”.

**Luồng chính:**
1. Hệ thống hiển thị form đăng nhập.
2. Actor nhập email/tên đăng nhập + mật khẩu.
3. Hệ thống kiểm tra:
   - Tài khoản tồn tại.
   - Mật khẩu đúng.
   - Nhà hàng chưa bị khóa/bị từ chối.
4. Nếu hợp lệ, hệ thống sinh JWT và chuyển tới dashboard nhà hàng.

**Luồng thay thế:**
- Sai thông tin / tài khoản bị khóa / nhà hàng bị từ chối → hiển thị thông báo phù hợp.

**Hậu điều kiện:**
- Actor đăng nhập thành công vào hệ thống quản lý nhà hàng.

---

### 3.2.2 UC-R02 – Quản lý thông tin nhà hàng

**Tên Use Case:** Quản lý thông tin nhà hàng  
**Mã Use Case:** UC-R02  
**Actor chính:** Restaurant Owner  

**Tiền điều kiện:**
- Đã đăng nhập (UC-R01).
- Nhà hàng đã tồn tại trên hệ thống.

**Kích hoạt:**
- Owner chọn menu “Thông tin nhà hàng” / “Thông tin cửa hàng”.

**Luồng chính:**
1. Hệ thống lấy thông tin hiện tại của nhà hàng (tên, mô tả, địa chỉ, giờ mở cửa, logo,…).
2. Owner chỉnh sửa các trường cần thay đổi.
3. Owner nhấn “Lưu”.
4. Hệ thống validate dữ liệu (địa chỉ, giờ mở cửa hợp lệ,…).
5. Hệ thống lưu thay đổi vào DB.
6. Thông tin nhà hàng mới được cập nhật cho các màn hình của Customer.

**Luồng thay thế:**
- Dữ liệu không hợp lệ → hiển thị lỗi, yêu cầu sửa.
- Lỗi lưu DB → báo lỗi chung.

**Hậu điều kiện:**
- Thông tin nhà hàng được cập nhật chính xác.

---

### 3.2.3 UC-R03 – Quản lý menu & món ăn

**Tên Use Case:** Quản lý menu & món ăn  
**Mã Use Case:** UC-R03  
**Actor chính:** Restaurant Owner / Staff  

**Tiền điều kiện:**
- Đã đăng nhập.
- Nhà hàng ở trạng thái `Approved`.

**Kích hoạt:**
- Actor chọn mục “Menu” hoặc “Món ăn” trên dashboard.

**Luồng chính:**
1. Hệ thống hiển thị danh sách món ăn hiện tại của nhà hàng.
2. Actor có thể:
   - Thêm món mới:
     - Nhập tên, giá, mô tả, upload hình, chọn trạng thái.
   - Sửa món:
     - Cập nhật tên, giá, mô tả, hình, trạng thái.
   - Xóa/ẩn món:
     - Mark trạng thái “Inactive” hoặc xóa nếu business cho phép.
3. Hệ thống validate:
   - Giá là số dương.
   - Tên không rỗng.
4. Hệ thống lưu lại thay đổi.

**Luồng thay thế:**
- Thiếu dữ liệu hoặc dữ liệu không hợp lệ → báo lỗi.
- Lỗi file upload (hình ảnh) → yêu cầu upload lại.

**Hậu điều kiện:**
- Menu nhà hàng trong hệ thống phản ánh đúng các thao tác CRUD.

---

### 3.2.4 UC-R04 – Xem & xử lý đơn hàng

**Tên Use Case:** Xem & xử lý đơn hàng  
**Mã Use Case:** UC-R04  
**Actor chính:** Restaurant Owner / Staff  

**Tiền điều kiện:**
- Đã đăng nhập.
- Có đơn hàng liên quan đến nhà hàng.

**Kích hoạt:**
- Actor mở màn hình “Đơn hàng”.

**Luồng chính:**
1. Hệ thống hiển thị danh sách đơn:
   - Đơn mới (`PENDING`), đang chuẩn bị (`PREPARING`), đã sẵn sàng (`READY_FOR_PICKUP`),…
2. Actor chọn một đơn để xem chi tiết.
3. Actor có thể:
   - Chấp nhận đơn (`PENDING` → `CONFIRMED`/`PREPARING`).
   - Từ chối đơn (set `CANCELLED` với lý do).
   - Khi đã chuẩn bị xong, chuyển trạng thái `READY_FOR_PICKUP`.
4. Hệ thống lưu lại trạng thái mới & gửi event cho Order/Notification/Delivery.

**Luồng thay thế:**
- Đơn đã bị hủy hoặc xử lý bởi người khác → thông báo “Đơn đã được xử lý trước đó”.

**Hậu điều kiện:**
- Trạng thái đơn được cập nhật, Customer và Driver (nếu liên quan) nhận thông báo.

---

### 3.2.5 UC-R05 – Xem thống kê đơn hàng và báo cáo doanh thu

**Tên Use Case:** Xem thống kê đơn hàng và báo cáo doanh thu
**Mã Use Case:** UC-RES-05  
**Actor chính:** Restaurant Owner / Staff  

**Tiền điều kiện:**
- Đã đăng nhập.
- Trong hệ thống đã có dữ liệu đơn hàng liên quan đến nhà hàng (nếu không thì chỉ hiển thị rỗng).

**Kích hoạt:**
- Actor chọn mục “Thống kê / Báo cáo” trên Restaurant Dashboard.

**Luồng chính:**
1. Hệ thống hiển thị màn hình bộ lọc báo cáo, cho phép Actor chọn:
   - Khoảng thời gian (từ ngày – đến ngày) hoặc các preset: Hôm nay, 7 ngày gần nhất, Tháng này, …  
   - *(Tuỳ chọn)* Chi nhánh cụ thể nếu nhà hàng có nhiều chi nhánh.

2. Actor chọn xong khoảng thời gian (và chi nhánh nếu có) rồi nhấn nút “Xem báo cáo”.

3. Hệ thống truy vấn dữ liệu đơn hàng của nhà hàng trong phạm vi đã chọn, bao gồm:
   - Các đơn ở trạng thái liên quan: `DELIVERED`, `CANCELLED`, `FAILED`, …  
   - Thông tin tổng tiền đơn, phí giao hàng, phí nền tảng (nếu lưu).

4. Hệ thống tính toán các chỉ số thống kê chính, ví dụ:
   - Tổng số đơn trong khoảng thời gian.  
   - Số đơn thành công (trạng thái `DELIVERED`).  
   - Số đơn bị hủy/thất bại.  
   - Tổng doanh thu gộp (tổng tiền các đơn `DELIVERED`).  
   - *(Tuỳ chọn)* Doanh thu theo món bán chạy, khung giờ, chi nhánh, …

5. Hệ thống hiển thị kết quả ở dạng:
   - Bảng số liệu (table): mỗi dòng là một chỉ số/tổng hợp.  
   - Và/hoặc biểu đồ (cột/đường/tròn) để Actor dễ quan sát xu hướng.

6. Actor có thể:
   - Thay đổi khoảng thời gian/chi nhánh để xem lại.  
   - *(Tuỳ chọn)* Nhấn nút “Xuất báo cáo” để tải file (CSV/Excel/PDF).

**Luồng thay thế:**

- **AF1 – Không có đơn trong khoảng thời gian chọn**  
  1. Ở bước 3, nếu không tìm thấy đơn nào trong phạm vi đã chọn.  
  2. Hệ thống hiển thị thông báo:  
     > “Không có đơn hàng nào trong khoảng thời gian này.”  
  3. Vẫn hiển thị màn hình bộ lọc để Actor chọn lại khoảng thời gian khác.

- **AF2 – Actor chọn khoảng thời gian không hợp lệ**  
  1. Actor chọn ngày kết thúc nhỏ hơn ngày bắt đầu hoặc vượt quá giới hạn cho phép (vd. > 1 năm).  
  2. Hệ thống hiển thị thông báo lỗi, highlight các trường không hợp lệ.  
  3. Actor chỉnh lại dữ liệu và thực hiện lại bước 2 của Basic Flow.

- **AF3 – Lỗi hệ thống khi truy vấn / tính toán**  
  1. Trong quá trình truy vấn DB hoặc tính toán, xảy ra lỗi hệ thống.  
  2. Hệ thống hiển thị thông báo:  
     > “Hiện không thể tải báo cáo, vui lòng thử lại sau.”  
  3. Ghi log chi tiết lỗi để DevOps/Developer kiểm tra.

**Hậu điều kiện:**
- Actor nhận được cái nhìn tổng quan về:
  - Lượng đơn hàng (số lượng, trạng thái)  
  - Doanh thu trong khoảng thời gian đã chọn.  
- Dữ liệu báo cáo (nếu có chức năng xuất file) có thể được dùng cho nội bộ nhà hàng (quản lý, kế toán, …).

---

## 3.3 USE CASE NHÓM DRIVER

---

### 3.3.1 UC-D01 – Đăng nhập tài xế

**Tên Use Case:** Đăng nhập tài xế  
**Mã Use Case:** UC-D01  
**Actor chính:** Driver  

**Tiền điều kiện:**
- Tài khoản Driver đã được tạo (và approved, nếu có quy trình).

**Kích hoạt:**
- Driver mở Delivery App và chọn “Đăng nhập”.

**Luồng chính:**
1. Hệ thống hiển thị form đăng nhập.
2. Driver nhập tài khoản, mật khẩu.
3. Hệ thống xác thực:
   - Tài khoản tồn tại.
   - Mật khẩu đúng.
   - Tài khoản không bị khóa.
4. Hệ thống trả token và mở màn hình chính (danh sách đơn hoặc trạng thái).

**Luồng thay thế:**
- Sai thông tin, tài khoản khóa… → tương tự UC-CUS-02.

**Hậu điều kiện:**
- Driver đăng nhập thành công.

---

### 3.3.2 UC-D02 – Cập nhật trạng thái sẵn sàng

**Tên Use Case:** Cập nhật trạng thái sẵn sàng  
**Mã Use Case:** UC-D02  
**Actor chính:** Driver  

**Tiền điều kiện:**
- Đã đăng nhập Delivery App.

**Kích hoạt:**
- Driver gạt nút hoặc chọn “Online/Offline” trong app.

**Luồng chính:**
1. Hệ thống hiển thị trạng thái hiện tại (Available/Unavailable).
2. Driver đổi trạng thái:
   - Nếu đang Offline → chọn Online để bắt đầu nhận đơn.
   - Nếu đang Online → chọn Offline để ngưng nhận đơn.
3. Hệ thống gửi yêu cầu cập nhật tới Delivery Server.
4. Hệ thống lưu trạng thái, sử dụng trạng thái này khi phân công đơn mới.

**Luồng thay thế:**
- Lỗi kết nối/Server → hệ thống thông báo và khôi phục trạng thái cũ.

**Hậu điều kiện:**
- Trạng thái sẵn sàng của Driver được cập nhật trong hệ thống.

---

### 3.3.3 UC-D03 – Xem danh sách đơn được gán

**Tên Use Case:** Xem danh sách đơn được gán  
**Mã Use Case:** UC-D03  
**Actor chính:** Driver  

**Tiền điều kiện:**
- Driver ở trạng thái `Available` (hoặc đã có đơn được gán).

**Kích hoạt:**
- Driver mở màn hình “Đơn hàng” trên Delivery App.

**Luồng chính:**
1. Hệ thống truy vấn danh sách đơn:
   - Đã được gán cho Driver.
   - Hoặc danh sách đơn mới đang cần tài xế (nếu hệ thống cho phép Driver chọn đơn).
2. Hệ thống hiển thị:
   - Mã đơn, nhà hàng, địa chỉ giao, khoảng cách, thời gian ước tính.
3. Driver chọn một đơn để xem chi tiết.
4. (Nếu business cho phép) Driver có thể nhận đơn từ danh sách “chờ nhận”.

**Luồng thay thế:**
- Không có đơn nào phù hợp → hiển thị “Hiện chưa có đơn mới”.

**Hậu điều kiện:**
- Driver thấy các đơn mình phải giao và có thể chuyển sang UC-DRV-04.

---

### 3.3.4 UC-D04 – Cập nhật trạng thái giao hàng

**Tên Use Case:** Cập nhật trạng thái giao hàng  
**Mã Use Case:** UC-D04  
**Actor chính:** Driver  

**Tiền điều kiện:**
- Đã đăng nhập.
- Có ít nhất một đơn được gán ở trạng thái `READY_FOR_PICKUP` hoặc `DELIVERING`.

**Kích hoạt:**
- Driver mở chi tiết đơn và chọn cập nhật trạng thái.

**Luồng chính:**
1. Hệ thống hiển thị chi tiết đơn: nhà hàng, địa chỉ giao, trạng thái hiện tại.
2. Driver có thể:
   - Nhấn “Đã nhận món” → trạng thái `DELIVERING`.
   - Nhấn “Đã giao hàng” → trạng thái `DELIVERED`.
   - Nhấn “Giao thất bại” → trạng thái `FAILED` + chọn/nhập lý do.
3. Hệ thống lưu trạng thái mới.
4. Hệ thống gửi event cập nhật:
   - Order Service để update trạng thái đơn.
   - Notification Service để thông báo cho Customer & Restaurant.

**Luồng thay thế:**
- Đơn không thuộc về driver này → từ chối cập nhật, báo “Bạn không được phép cập nhật đơn này”.
- Lỗi DB/service → hiển thị thông báo lỗi và không đổi trạng thái.

**Hậu điều kiện:**
- Trạng thái đơn hàng phản ánh đúng bước giao hiện tại.
- Lịch sử trạng thái đơn được ghi nhận.

---

### 3.3.5 UC-D05 – Cập nhật vị trí theo thời gian thực

**Tên Use Case:** Cập nhật vị trí theo thời gian thực  
**Mã Use Case:** UC-D05  
**Actor chính:** Driver  

**Tiền điều kiện:**
- Đã đăng nhập.
- Driver đang trong quá trình giao hàng (`DELIVERING`).
- Thiết bị bật GPS và cho phép app truy cập.

**Kích hoạt:**
- App tự động gửi vị trí khi Driver đang giao, hoặc khi app ở trạng thái tracking.

**Luồng chính:**
1. App lấy vị trí GPS hiện tại theo chu kỳ (ví dụ mỗi 5–10 giây).
2. App gửi vị trí (lat, long, thời gian) qua Socket.io / API đến Delivery Server.
3. Delivery Server cập nhật vị trí Driver liên kết với đơn hiện tại.
4. Customer (UC-CUS-08) nhận vị trí mới và hiển thị trên bản đồ.

**Luồng thay thế:**
- Mất GPS hoặc user tắt quyền định vị:
  - Hệ thống dừng cập nhật, hiển thị cảnh báo cho Driver.
- Mất kết nối mạng:
  - App tạm lưu vị trí/thông báo lỗi; thử gửi lại khi kết nối ổn định.

**Hậu điều kiện:**
- Vị trí của Driver được cập nhật liên tục trong thời gian giao hàng.
- Customer có trải nghiệm theo dõi real-time.

---

## 3.4 USE CASE NHÓM ADMIN

---

### 3.4.1 UC-A01 – Đăng nhập Admin

**Tên Use Case:** Đăng nhập Admin  
**Mã Use Case:** UC-A01  
**Actor chính:** Admin  

**Tiền điều kiện:**
- Tài khoản Admin đã được tạo và kích hoạt.

**Kích hoạt:**
- Admin truy cập Admin Web và chọn “Đăng nhập”.

**Luồng chính:**
1. Hệ thống hiển thị form đăng nhập.
2. Admin nhập username/email + mật khẩu.
3. Hệ thống xác thực:
   - Tài khoản tồn tại.
   - Mật khẩu hợp lệ.
   - User có role Admin.
4. Hệ thống trả token và chuyển tới trang dashboard quản trị.

**Luồng thay thế:**
- Sai thông tin, không có quyền Admin, tài khoản bị khóa → hiển thị thông báo lỗi.

**Hậu điều kiện:**
- Admin đăng nhập thành công, có quyền truy cập các chức năng quản trị.

---

### 3.4.2 UC-A02 – Quản lý user & vai trò

**Tên Use Case:** Quản lý user & vai trò  
**Mã Use Case:** UC-A02  
**Actor chính:** Admin  

**Tiền điều kiện:**
- Admin đã đăng nhập.

**Kích hoạt:**
- Admin chọn menu “User Management” / “Quản lý người dùng”.

**Luồng chính:**
1. Hệ thống hiển thị danh sách user:
   - Thông tin cơ bản: id, tên, email, role, trạng thái.
2. Admin có thể:
   - Tìm kiếm user theo email/tên.
   - Xem chi tiết một user.
   - Đổi trạng thái (Active/Blocked).
   - Thay đổi vai trò (nếu phù hợp).
3. Hệ thống xác thực các quy tắc:
   - Không tự khóa tài khoản Admin duy nhất (nếu business quy định).
4. Hệ thống lưu thay đổi và hiển thị thông báo thành công.

**Luồng thay thế:**
- Lỗi khi lưu dữ liệu → thông báo lỗi chung, không thay đổi trên DB.

**Hậu điều kiện:**
- Trạng thái và vai trò user được cập nhật chính xác.

---

### 3.4.3 UC-A03 – Duyệt nhà hàng

**Tên Use Case:** Duyệt nhà hàng  
**Mã Use Case:** UC-A03  
**Actor chính:** Admin  

**Tiền điều kiện:**
- Nhà hàng mới được chủ đăng ký, đang có trạng thái `Pending`.

**Kích hoạt:**
- Admin chọn menu “Duyệt nhà hàng” / “Restaurant Approval”.

**Luồng chính:**
1. Hệ thống hiển thị danh sách nhà hàng chờ duyệt.
2. Admin chọn một nhà hàng để xem chi tiết:
   - Thông tin đăng ký, giấy tờ, địa chỉ, liên hệ.
3. Admin lựa chọn:
   - “Phê duyệt” → trạng thái chuyển `Approved`.
   - Hoặc “Từ chối” → trạng thái `Rejected` + nhập lý do.
4. Hệ thống lưu lại quyết định.
5. Hệ thống gửi thông báo cho chủ nhà hàng (email/notification).

**Luồng thay thế:**
- Nhà hàng đã được xử lý trước đó → thông báo, không cho thay đổi nếu quy định như vậy.

**Hậu điều kiện:**
- Nhà hàng có trạng thái rõ ràng (`Approved` / `Rejected`).
- Chủ nhà hàng nhận thông báo tương ứng.

---

### 3.4.4 UC-A04 – Xem báo cáo & dashboard

**Tên Use Case:** Xem báo cáo & dashboard  
**Mã Use Case:** UC-A04  
**Actor chính:** Admin  

**Tiền điều kiện:**
- Hệ thống đã có dữ liệu đơn hàng, doanh thu.

**Kích hoạt:**
- Admin mở trang “Dashboard” / “Reports”.

**Luồng chính:**
1. Hệ thống hiển thị các chỉ số tổng quan:
   - Số đơn trong ngày/tháng.
   - Doanh thu tổng.
   - Số nhà hàng active.
   - Số user mới.
2. Admin có thể:
   - Lọc theo thời gian.
   - Lọc theo nhà hàng / khu vực (nếu hỗ trợ).
3. Hệ thống cập nhật lại số liệu & biểu đồ tương ứng.

**Luồng thay thế:**
- Không có dữ liệu trong khoảng thời gian chọn → hiển thị “Không có dữ liệu”.

**Hậu điều kiện:**
- Admin nắm được tình hình tổng thể của hệ thống để ra quyết định.

---

### 3.4.5 UC-A05 – Đối soát thanh toán với nhà hàng

**Tên Use Case:** Đối soát thanh toán với nhà hàng  
**Mã Use Case:** UC-A05  
**Actor chính:** Admin  

**Tiền điều kiện:**
- Hệ thống có log doanh thu và fee nền tảng theo đơn hàng.

**Kích hoạt:**
- Admin chọn menu “Đối soát” / “Settlement”.

**Luồng chính:**
1. Admin chọn:
   - Nhà hàng cần đối soát.
   - Khoảng thời gian (ví dụ: tháng 10/2025).
2. Hệ thống tính toán:
   - Tổng doanh thu ghi nhận cho nhà hàng.
   - Phần trăm/fee nền tảng.
   - Số tiền thực nhận của nhà hàng.
3. Hệ thống hiển thị bảng đối soát chi tiết (có thể kèm từng đơn hoặc tổng hợp).
4. Admin có thể:
   - Xác nhận đối soát.
   - Xuất file báo cáo (PDF/Excel).

**Luồng thay thế:**
- Thiếu dữ liệu / lỗi tính toán → báo lỗi để Admin thử lại hoặc liên hệ bộ phận kỹ thuật.

**Hậu điều kiện:**
- Một kỳ đối soát được ghi nhận hoàn tất trong hệ thống.
- Dữ liệu có thể dùng làm cơ sở thanh toán cho nhà hàng.

---

## 4. PlantUML Use Case Diagram (tùy chọn)

```plantuml
@startuml
left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle

actor "Customer" as C
actor "Restaurant Owner" as R
actor "Driver" as D
actor "Admin" as A
actor "Payment Gateway" as PG
actor "Notification System" as NS

rectangle "Customer Use Cases" {
  (UC-C01 Đăng ký tài khoản)            as UC_C01
  (UC-C02 Đăng nhập)                    as UC_C02
  (UC-C03 Xem danh sách nhà hàng)       as UC_C03
  (UC-C04 Xem menu & chi tiết món)      as UC_C04
  (UC-C05 Quản lý giỏ hàng)             as UC_C05
  (UC-C06 Đặt hàng)                     as UC_C06
  (UC-C07 Thanh toán online/COD)        as UC_C07
  (UC-C08 Theo dõi đơn hàng)            as UC_C08
  (UC-C09 Xem lịch sử đơn hàng)         as UC_C09
}

rectangle "Restaurant Owner Use Cases" {
  (UC-R01 Đăng nhập nhà hàng)                      as UC_R01
  (UC-R02 Quản lý thông tin nhà hàng)              as UC_R02
  (UC-R03 Quản lý menu & món ăn)                   as UC_R03
  (UC-R04 Xem & xử lý đơn hàng)                    as UC_R04
  (UC-R05 Xem thống kê đơn hàng & báo cáo doanh thu) as UC_R05
}

rectangle "Driver Use Cases" {
  (UC-D01 Đăng nhập tài xế)                        as UC_D01
  (UC-D02 Cập nhật trạng thái sẵn sàng)            as UC_D02
  (UC-D03 Xem danh sách đơn được gán)              as UC_D03
  (UC-D04 Cập nhật trạng thái giao hàng)           as UC_D04
  (UC-D05 Cập nhật vị trí theo thời gian thực)     as UC_D05
}

rectangle "Admin Use Cases" {
  (UC-A01 Đăng nhập Admin)                         as UC_A01
  (UC-A02 Quản lý user & vai trò)                  as UC_A02
  (UC-A03 Duyệt nhà hàng)                          as UC_A03
  (UC-A04 Xem báo cáo & dashboard)                 as UC_A04
  (UC-A05 Đối soát thanh toán với nhà hàng)        as UC_A05
}

'----------------------
' Associations Customer
'----------------------
C -- UC_C01
C -- UC_C02
C -- UC_C03
C -- UC_C04
C -- UC_C05
C -- UC_C06
C -- UC_C07
C -- UC_C08
C -- UC_C09

'----------------------
' Associations Restaurant Owner
'----------------------
R -- UC_R01
R -- UC_R02
R -- UC_R03
R -- UC_R04
R -- UC_R05

'----------------------
' Associations Driver
'----------------------
D -- UC_D01
D -- UC_D02
D -- UC_D03
D -- UC_D04
D -- UC_D05

'----------------------
' Associations Admin
'----------------------
A -- UC_A01
A -- UC_A02
A -- UC_A03
A -- UC_A04
A -- UC_A05

'----------------------
' External Systems
'----------------------
PG -- UC_C07  : "Xử lý thanh toán online"

' Notification System được hệ thống gọi để gửi thông báo
NS -- UC_C06  : "Thông báo đơn mới/đặt hàng"
NS -- UC_R04  : "Thông báo trạng thái đơn"
NS -- UC_D04  : "Thông báo trạng thái giao hàng"
NS -- UC_A03  : "Thông báo kết quả duyệt nhà hàng"

@enduml


-----
cách 2
@startuml
left to right direction
skinparam actorStyle awesome
skinparam packageStyle rectangle
skinparam packageBorderStyle dashed

'======== ACTORS =========
actor "Admin"             as A
actor "Customer"          as C
actor "Restaurant Owner"  as R
actor "Driver"            as D
actor "Payment Gateway\n(External)" as PG
actor "Notification System"         as NS

'======== 4 NHÓM USE CASE ĐẶT THEO HÀNG NGANG =========
together {

  package "Admin" {
    usecase "UC-A01: Đăng nhập Admin"                 as UC_A01_U
    usecase "UC-A02: Quản lý user & vai trò"          as UC_A02_U
    usecase "UC-A03: Duyệt nhà hàng"                  as UC_A03_U
    usecase "UC-A04: Xem báo cáo & dashboard"         as UC_A04_U
    usecase "UC-A05: Đối soát thanh toán\nvới nhà hàng" as UC_A05_U
  }

  package "Customer" {
    usecase "UC-C01: Đăng ký tài khoản"          as UC_C01_U
    usecase "UC-C02: Đăng nhập"                  as UC_C02_U
    usecase "UC-C03: Xem danh sách nhà hàng"     as UC_C03_U
    usecase "UC-C04: Xem menu & chi tiết món"    as UC_C04_U
    usecase "UC-C05: Quản lý giỏ hàng"           as UC_C05_U
    usecase "UC-C06: Đặt hàng"                   as UC_C06_U
    usecase "UC-C07: Thanh toán online/COD"      as UC_C07_U
    usecase "UC-C08: Theo dõi đơn hàng"          as UC_C08_U
    usecase "UC-C09: Xem lịch sử đơn hàng"       as UC_C09_U
  }

  package "Restaurant Owner" {
    usecase "UC-R01: Đăng nhập nhà hàng"                      as UC_R01_U
    usecase "UC-R02: Quản lý thông tin nhà hàng"              as UC_R02_U
    usecase "UC-R03: Quản lý menu & món ăn"                   as UC_R03_U
    usecase "UC-R04: Xem & xử lý đơn hàng"                    as UC_R04_U
    usecase "UC-R05: Thống kê đơn hàng\n& báo cáo doanh thu"  as UC_R05_U
  }

  package "Driver" {
    usecase "UC-D01: Đăng nhập tài xế"                        as UC_D01_U
    usecase "UC-D02: Cập nhật trạng thái sẵn sàng"            as UC_D02_U
    usecase "UC-D03: Xem danh sách đơn được gán"              as UC_D03_U
    usecase "UC-D04: Cập nhật trạng thái giao hàng"           as UC_D04_U
    usecase "UC-D05: Cập nhật vị trí\ntheo thời gian thực"    as UC_D05_U
  }

}

'======== LIÊN KẾT ACTOR <-> USE CASE =========
A --> UC_A01_U
A --> UC_A02_U
A --> UC_A03_U
A --> UC_A04_U
A --> UC_A05_U

C --> UC_C01_U
C --> UC_C02_U
C --> UC_C03_U
C --> UC_C04_U
C --> UC_C05_U
C --> UC_C06_U
C --> UC_C07_U
C --> UC_C08_U
C --> UC_C09_U

R --> UC_R01_U
R --> UC_R02_U
R --> UC_R03_U
R --> UC_R04_U
R --> UC_R05_U

D --> UC_D01_U
D --> UC_D02_U
D --> UC_D03_U
D --> UC_D04_U
D --> UC_D05_U

'======== QUAN HỆ GIỮA USE CASE / HỆ THỐNG NGOÀI =========

' Thanh toán dùng Payment Gateway
PG --> UC_C07_U : "Xử lý\nthanh toán online"

' Thanh toán là bước mở rộng của Đặt hàng
UC_C07_U ..> UC_C06_U : <<extend>>

' Tracking phụ thuộc vị trí driver
UC_C08_U ..> UC_D05_U : <<include>>

' Notification System là secondary actor
NS --> UC_C06_U : "Thông báo\nđơn mới"
NS --> UC_R04_U : "Thông báo\ntrạng thái đơn"
NS --> UC_D04_U : "Thông báo\ntrạng thái giao"
NS --> UC_A03_U : "Thông báo\nkết quả duyệt"

@enduml

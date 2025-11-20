# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)  
## HỆ THỐNG GIAO ĐỒ ĂN (FOOD DELIVERY SYSTEM – MICROSERVICES)

---

## 1. GIỚI THIỆU

### 1.1. Mục đích

Tài liệu SRS này mô tả chi tiết các yêu cầu phần mềm cho **Hệ thống Giao Đồ Ăn** được xây dựng trên kiến trúc **Microservices**.

Tài liệu được dùng làm cơ sở cho:

- Nhóm **Backend / Frontend Developer**: thiết kế, hiện thực và refactor chức năng.  
- Nhóm **DevOps / Infra**: thiết kế pipeline CI/CD, triển khai trên Docker/Kubernetes, cấu hình giám sát.  
- Nhóm **QA/Tester**: xây dựng test case, test plan và đánh giá chất lượng hệ thống.  
- **Giảng viên / PO / Stakeholder**: nắm rõ phạm vi, tính năng và ràng buộc của dự án.

### 1.2. Mục tiêu dự án:

- Đạt khả năng **mở rộng (scalability)** và **chịu lỗi (fault tolerance)** thông qua việc tách nhỏ thành các microservices độc lập.  
- Tối ưu hóa quy trình phát triển với **CI/CD (GitHub Actions)**.  
- Đảm bảo **tính ổn định và quan sát được (observability)** thông qua hệ thống **giám sát tập trung**.

---

### 1.3. Phạm vi

Hệ thống cung cấp một nền tảng giao đồ ăn cho 4 nhóm người dùng chính:

- **Khách hàng (Customer)**: duyệt nhà hàng, chọn món, đặt hàng, thanh toán, theo dõi đơn.  
- **Chủ nhà hàng (Restaurant Owner)**: quản lý nhà hàng, chi nhánh, menu, xử lý đơn đến.  
- **Tài xế giao hàng (Driver)**: nhận đơn, cập nhật trạng thái, chia sẻ vị trí theo thời gian thực.  
- **Quản trị viên (Admin)**: duyệt nhà hàng, giám sát hệ thống, quản lý tài khoản, xem báo cáo tài chính.

Phạm vi SRS bao gồm:

- Các **microservices backend**: `auth`, `restaurant`, `order`, `payment-service`, `notification-service`, `food-delivery-server`, `admin-service`.  
- Các **ứng dụng client**:
  - Mobile **Customer App** (`foodapp-client` – React Native).  
  - Mobile **Delivery App** (`client-delivery-app` – React Native).  
  - Web **Restaurant Dashboard** (`food-delivery-restuarant-web` – React).  
  - Web **Admin Dashboard** (`food-delivery-admin` – React).  
- **Hạ tầng triển khai & vận hành**: Docker, Docker Compose, Kubernetes, CI/CD pipeline, monitoring stack.

---

## 2. TỔNG QUAN HỆ THỐNG

### 2.1. Mô tả nghiệp vụ tổng quan

Luồng nghiệp vụ chính:

1. Khách hàng đăng ký/đăng nhập, duyệt danh sách nhà hàng & món ăn theo vị trí.  
2. Khách hàng thêm món vào giỏ, tạo đơn hàng và chọn phương thức thanh toán (online/COD).  
3. Nhà hàng nhận đơn, xác nhận & chuẩn bị món.  
4. Hệ thống phân công đơn cho tài xế giao hàng, tài xế cập nhật trạng thái & vị trí theo thời gian thực.  
5. Khách hàng theo dõi vị trí tài xế và trạng thái đơn.  
6. Quản trị viên quản lý nhà hàng, giám sát thống kê & thực hiện đối soát, báo cáo doanh thu.

Hệ thống được thiết kế hướng sự kiện (event-driven) với **Kafka** để tách biệt các luồng xử lý bất đồng bộ (notification, cập nhật trạng thái, hậu kỳ thanh toán…).

---

### 2.2. Tác nhân (Actors)

- **Customer**: sử dụng mobile app để đặt món, thanh toán, theo dõi đơn.  
- **Restaurant Owner / Staff**: sử dụng web restaurant để quản lý nhà hàng, món ăn, xử lý đơn.  
- **Driver**: sử dụng delivery app để nhận đơn, cập nhật trạng thái & vị trí.  
- **Admin**: sử dụng admin web để cấu hình, duyệt nhà hàng, xem báo cáo, theo dõi hệ thống.  
- **Payment Gateway**: bên thứ ba xử lý giao dịch online (Stripe hoặc mô phỏng).  
- **Notification Channel**: email/SMS/WebSocket push notification tới user.

---

### 2.3. Công nghệ chính

| Loại            | Công nghệ                                           | Mục đích chính                                             |
|-----------------|-----------------------------------------------------|------------------------------------------------------------|
| Backend         | Node.js (Express)                                   | Xây dựng các microservices REST API                       |
| Database        | MongoDB                                             | Lưu dữ liệu nghiệp vụ (user, order, restaurant, …)        |
| Messaging       | Kafka                                               | Xử lý sự kiện bất đồng bộ                                 |
| Real-time       | Socket.io                                           | Theo dõi vị trí tài xế, trạng thái đơn theo thời gian thực |
| Frontend Web    | React                                               | Admin & Restaurant dashboard                              |
| Mobile          | React Native (Expo)                                 | Customer & Driver apps                                    |
| Container       | Docker, Docker Compose                              | Đóng gói & chạy dịch vụ trong môi trường container        |
| Orchestration   | Kubernetes (Deployment, Service, Ingress)           | Triển khai, scale hệ thống                                |
| CI/CD           | GitHub Actions                                      | Tự động build, test, deploy                               |
| Monitoring      | Prometheus, Grafana, Alertmanager                   | Thu thập metrics, tạo dashboard, cảnh báo                 |

---

### 2.4. Thành phần hệ thống (Microservices & Clients)

#### 2.4.1. Microservices

| Dịch vụ              | Thư mục                | Chức năng chính                                                                 |
|----------------------|------------------------|----------------------------------------------------------------------------------|
| Auth Service         | `auth`                 | Đăng ký, đăng nhập, xác thực JWT, quản lý vai trò (customer/owner/driver/admin) |
| Restaurant Service   | `restaurant`           | Quản lý nhà hàng, chi nhánh, menu, món ăn, hình ảnh                             |
| Order Service        | `order`                | Quản lý giỏ hàng, tạo đơn, tính tổng tiền, trạng thái đơn                       |
| Payment Service      | `payment-service`      | Xử lý thanh toán online/COD, webhook từ cổng thanh toán                         |
| Notification Service | `notification-service` | Lắng nghe sự kiện Kafka, gửi email/SMS/notification                             |
| Food Delivery Server | `food-delivery-server` | Quản lý tài xế, phân công đơn, theo dõi vị trí real-time                        |
| Admin Service        | `admin-service`        | Quản lý admin, phê duyệt nhà hàng, đối soát & báo cáo tài chính                 |

#### 2.4.2. Ứng dụng client

| Ứng dụng                    | Thư mục                         | Vai trò                                                          |
|----------------------------|---------------------------------|------------------------------------------------------------------|
| Customer Mobile App        | `foodapp-client`               | Khách hàng đặt món, thanh toán, theo dõi đơn                    |
| Delivery Mobile App        | `client-delivery-app`          | Tài xế nhận & xử lý đơn, cập nhật trạng thái & vị trí           |
| Restaurant Web Dashboard   | `food-delivery-restuarant-web` | Chủ nhà hàng quản lý menu, xử lý đơn, xem thống kê đơn hàng     |
| Admin Web Dashboard        | `food-delivery-admin`          | Admin quản lý hệ thống, user, nhà hàng, xem báo cáo, cấu hình   |

---

### 2.5. Môi trường triển khai

- **Môi trường Development**:
  - Chạy bằng `docker-compose` (database, kafka, các service).  
  - Dev có thể chạy một số service local để debug.

- **Môi trường Staging/Production**:
  - Triển khai trên **Kubernetes cluster**.  
  - Mỗi microservice là một **Deployment + Service**.  
  - Routing qua **Ingress Controller / API Gateway**.  
  - **Prometheus + Grafana + Alertmanager** dùng để giám sát & cảnh báo.

- **Pipeline CI/CD (GitHub Actions)**:
  - Trigger khi push/PR vào nhánh chính.  
  - Các bước chính:
    - Cài đặt dependency, chạy unit test.  
    - Build Docker images, đẩy lên container registry.  
    - Triển khai/cập nhật manifest K8s (hoặc docker-compose trong môi trường test).

---

## 3. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS – FR)

> Ghi chú: Mỗi yêu cầu có mã dạng `FR-<MODULE>-<STT>` để trace qua thiết kế, code và test case.

---

### 3.1. Auth Service (AUTH)

- **FR-AUTH-01 – Đăng ký người dùng**  
  Hệ thống cho phép đăng ký tài khoản cho 4 loại vai trò: Customer, Restaurant Owner, Driver, Admin (admin có thể được tạo bởi hệ thống).

- **FR-AUTH-02 – Đăng nhập & sinh JWT**  
  Người dùng đăng nhập bằng email/số điện thoại + mật khẩu, hệ thống trả về JWT chứa thông tin userId, role, thời gian hết hạn token.

- **FR-AUTH-03 – Xác thực token**  
  Cung cấp endpoint để các service khác verify JWT, từ đó lấy thông tin user và role.

- **FR-AUTH-04 – Phân quyền (RBAC)**  
  Hệ thống áp dụng RBAC:
  - Customer không thể truy cập API quản trị.  
  - Restaurant Owner chỉ thao tác trên dữ liệu nhà hàng của chính mình.  
  - Driver chỉ xem được các đơn được assign cho mình.  
  - Admin có thể truy cập các API quản trị.

---

### 3.2. Restaurant Service (REST)

- **FR-REST-01 – CRUD Nhà hàng**  
  Restaurant Owner có thể tạo, xem, sửa, xóa thông tin nhà hàng và chi nhánh của mình.

- **FR-REST-02 – CRUD Món ăn (Dish)**  
  Restaurant Owner có thể quản lý menu và món ăn (tên, mô tả, giá, hình ảnh, trạng thái còn bán/ẩn).

- **FR-REST-03 – Tìm kiếm & lọc nhà hàng/món ăn**  
  Customer có thể tìm kiếm nhà hàng, món ăn theo:
  - Tên, danh mục.  
  - Khu vực/vị trí.  
  - Bộ lọc (rating, giá, loại món…).

- **FR-REST-04 – Phê duyệt nhà hàng**  
  Nhà hàng mới tạo sẽ ở trạng thái “Pending Approval”. Admin có thể phê duyệt hoặc từ chối (liên quan tới Admin Service).

---

### 3.3. Order Service (ORDER)

- **FR-ORDER-01 – Quản lý giỏ hàng**  
  Customer có thể:
  - Thêm món vào giỏ, cập nhật số lượng, xóa món.  
  - Giỏ hàng gắn với từng nhà hàng.

- **FR-ORDER-02 – Tạo đơn hàng**  
  Hệ thống tạo đơn hàng mới từ giỏ hàng:
  - Tính tổng tiền: tổng giá món + phí giao hàng + thuế (nếu có).  
  - Lưu địa chỉ giao hàng, phương thức thanh toán, ghi chú.  
  - Trạng thái khởi tạo: `PENDING` hoặc tương đương.

- **FR-ORDER-03 – Cập nhật trạng thái đơn**  
  Trạng thái đơn có thể chuyển qua các bước:
  - `PENDING` → `CONFIRMED` (nhà hàng chấp nhận).  
  - `CONFIRMED` → `PREPARING`.  
  - `PREPARING` → `READY_FOR_PICKUP`.  
  - `READY_FOR_PICKUP` → `DELIVERING`.  
  - `DELIVERING` → `DELIVERED` hoặc `FAILED/CANCELLED`.

- **FR-ORDER-04 – Lịch sử đơn hàng**  
  Customer có thể xem lịch sử các đơn của mình, lọc theo trạng thái/thời gian.

---

### 3.4. Payment Service (PAY)

- **FR-PAY-01 – Thanh toán online & COD**  
  Hệ thống hỗ trợ:
  - Thanh toán online qua Payment Gateway (Stripe/mô phỏng).  
  - Thanh toán khi nhận hàng (COD).

- **FR-PAY-02 – Xử lý kết quả thanh toán**  
  Đối với thanh toán online: service nhận thông báo (webhook) từ Payment Gateway và:
  - Cập nhật trạng thái thanh toán của đơn.  
  - Gửi sự kiện (Kafka) cho Order Service để update trạng thái đơn.

- **FR-PAY-03 – Ghi nhận giao dịch**  
  Lưu lại log giao dịch (số tiền, phương thức, trạng thái, mã giao dịch cổng thanh toán).

---

### 3.5. Food Delivery Server (DELIV)

- **FR-DELIV-01 – Quản lý trạng thái tài xế**  
  Tài xế có thể set trạng thái `Available` / `Unavailable`.

- **FR-DELIV-02 – Gán đơn cho tài xế**  
  Hệ thống (hoặc dispatcher) gán đơn ở trạng thái `READY_FOR_PICKUP` cho tài xế phù hợp (theo khu vực, trạng thái Available).

- **FR-DELIV-03 – Cập nhật trạng thái đơn khi giao hàng**  
  Tài xế có thể cập nhật:
  - Đã nhận đơn tại nhà hàng.  
  - Đang giao (`DELIVERING`).  
  - Đã giao (`DELIVERED`) hoặc thất bại (`FAILED`).

- **FR-DELIV-04 – Cập nhật vị trí theo thời gian thực**  
  Tài xế gửi vị trí GPS qua Socket.io, server broadcast cho client có liên quan (khách hàng theo dõi đơn).

---

### 3.6. Notification Service (NOTIF)

- **FR-NOTIF-01 – Lắng nghe sự kiện từ Kafka**  
  Service lắng nghe các topic liên quan (order_created, order_status_changed, payment_updated, …) để kích hoạt gửi thông báo.

- **FR-NOTIF-02 – Gửi thông báo tới người dùng**  
  Hệ thống gửi email/SMS/push notification cho:
  - Customer khi đơn được xác nhận, đang giao, đã giao, bị hủy.  
  - Restaurant Owner khi có đơn mới hoặc đơn bị hủy.  
  - Các notification khác (thanh toán thất bại, tài khoản bị khóa…).

---

### 3.7. Admin Service (ADMIN)

- **FR-ADMIN-01 – Quản lý user & vai trò**  
  Admin có thể xem danh sách user, khóa/mở khóa tài khoản, thiết lập role phù hợp.

- **FR-ADMIN-02 – Phê duyệt nhà hàng**  
  Admin xem danh sách nhà hàng chờ duyệt, phê duyệt hoặc từ chối, ghi log lý do.

- **FR-ADMIN-03 – Báo cáo tài chính tổng quan**  
  Admin xem:
  - Doanh thu theo ngày/tuần/tháng.  
  - Doanh thu theo nhà hàng.  
  - Phí nền tảng thu được.

- **FR-ADMIN-04 – Đối soát thanh toán với nhà hàng**  
  Hệ thống hỗ trợ:
  - Tính toán khoản cần trả cho từng nhà hàng trong một chu kỳ.  
  - Xuất báo cáo đối soát (settlement report).

---

### 3.8. Client Applications (CLIENT)

- **FR-CLIENT-01 – Customer App**  
  - Đăng ký, đăng nhập, quản lý profile.  
  - Xem danh sách nhà hàng, món ăn, đánh giá (nếu có).  
  - Quản lý giỏ hàng & đặt đơn.  
  - Theo dõi trạng thái đơn & vị trí tài xế.

- **FR-CLIENT-02 – Restaurant Web**  
  - Đăng nhập & quản lý nhiều chi nhánh (nếu có).  
  - Quản lý menu, giá, trạng thái món.  
  - Xem & xử lý đơn theo thời gian thực.

- **FR-CLIENT-03 – Delivery App**  
  - Đăng nhập & cập nhật trạng thái sẵn sàng.  
  - Xem danh sách đơn được gán.  
  - Cập nhật trạng thái & vị trí khi giao hàng.

- **FR-CLIENT-04 – Admin Web**  
  - Đăng nhập admin.  
  - Quản lý nhà hàng, user, cấu hình hệ thống.  
  - Xem dashboard tổng quan, log, báo cáo.

---

## 4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS – NFR)

### 4.1. Hiệu năng (Performance)

- **NFR-PERF-01 – Latency**  
  Thời gian phản hồi P95 cho các API quan trọng (đăng nhập, tạo đơn, cập nhật trạng thái đơn) không vượt quá **500 ms** trong điều kiện tải bình thường.

- **NFR-PERF-02 – Throughput**  
  Hệ thống phải xử lý tối thiểu **100 giao dịch/phút** trong giờ cao điểm (đơn hàng + thanh toán).

- **NFR-PERF-03 – Real-time Tracking**  
  Độ trễ cập nhật vị trí tài xế (Socket.io) tới client không vượt quá **1 giây** trong mạng ổn định.

---

### 4.2. Khả năng mở rộng (Scalability)

- **NFR-SCAL-01 – Horizontal Scaling**  
  Các microservices chính (`auth`, `order`, `restaurant`, `payment-service`, `food-delivery-server`, `notification-service`, `admin-service`) phải được triển khai dạng **Deployment** trong Kubernetes, có thể tăng/giảm số replicas mà không cần thay đổi code.

- **NFR-SCAL-02 – Load Balancing**  
  Ingress Controller/API Gateway phân phối tải đồng đều đến các replicas.

- **NFR-SCAL-03 – Decoupling qua Messaging**  
  Việc dùng Kafka đảm bảo các tác vụ bất đồng bộ (notification, cập nhật sau thanh toán) không chặn luồng xử lý chính của order.

---

### 4.3. Khả dụng & Độ tin cậy (Availability & Reliability)

- **NFR-AVAIL-01 – Uptime**  
  Core services (`auth`, `order`, `payment-service`) phải đạt **99.9% uptime**.

- **NFR-AVAIL-02 – Fault Tolerance**  
  Mỗi service quan trọng phải có ít nhất **2 replicas** để tránh Single Point of Failure.

- **NFR-AVAIL-03 – Backup dữ liệu**  
  Dữ liệu MongoDB phải được backup định kỳ (hằng ngày/tuần tùy môi trường), có khả năng restore khi sự cố.

---

### 4.4. Bảo mật (Security)

- **NFR-SEC-01 – Authentication qua JWT**  
  Tất cả API cần bảo mật phải yêu cầu JWT hợp lệ.

- **NFR-SEC-02 – Authorization (RBAC)**  
  Áp dụng RBAC, phân tách rõ route cho Customer/Owner/Driver/Admin.

- **NFR-SEC-03 – Bảo vệ thông tin nhạy cảm**  
  Thông tin như mật khẩu, DB credentials, API keys phải:
  - Không commit lên code.  
  - Được quản lý qua biến môi trường / Kubernetes Secrets.

- **NFR-SEC-04 – Mã hóa giao tiếp**  
  Giao tiếp giữa client và backend nên sử dụng HTTPS trong môi trường production.

---

### 4.5. Khả năng bảo trì & vận hành (Maintainability & Operability)

- **NFR-MAINT-01 – CI/CD bắt buộc**  
  Mọi thay đổi code phải:
  - Đi qua pipeline CI: lint, unit test, có thể thêm integration test.  
  - Deploy tự động (hoặc bán tự động) lên môi trường staging trước khi lên production.

- **NFR-MAINT-02 – Monitoring & Alerting**  
  Hệ thống phải:
  - Thu thập metrics CPU, RAM, request count, error rate, latency.  
  - Cung cấp dashboard trực quan cho từng service.  
  - Cấu hình alert khi vượt ngưỡng (ví dụ error rate > 5%, latency P95 > 500ms).

- **NFR-MAINT-03 – Infrastructure as Code**  
  Cấu hình Docker Compose, manifest Kubernetes, monitoring stack phải được lưu trong repo và version control đầy đủ.

---

### 4.6. Logging & Observability

- **NFR-OBS-01 – Centralized Logging**  
  Log của các service nên được gom về 1 nơi (ví dụ ELK stack hoặc tương tự).

- **NFR-OBS-02 – Correlation ID**  
  Mỗi request/đơn hàng nên có một mã tham chiếu (correlation ID) để trace qua nhiều service khác nhau.

---

### 4.7. Khả dụng sử dụng (Usability)

- **NFR-USE-01 – UI nhất quán**  
  Giao diện web & mobile sử dụng component thống nhất, dễ sử dụng cho người dùng phổ thông.

- **NFR-USE-02 – Đa ngôn ngữ (tùy chọn)**  
  Hệ thống có khả năng mở rộng hỗ trợ i18n (ví dụ: tiếng Việt & tiếng Anh).

---

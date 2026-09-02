# PRD — Flash Rent

**Product Requirements Document**
**Versi:** 1.0
**Tanggal:** 2 September 2026
**Nama Produk:** Flash Rent
**Platform:** Web
**Model Bisnis:** Digital Rental / Sewa Produk Digital

---

## 1. Ringkasan Produk

**Flash Rent** adalah platform penyewaan produk digital yang memungkinkan customer membeli akses terhadap produk digital berdasarkan paket dan periode sewa.

Produk dapat memiliki berbagai bentuk akses, seperti:

- License Key
- Username & Password / Credential
- Access URL
- Kombinasi beberapa jenis akses

Customer dapat melakukan pembelian tanpa harus membuat akun terlebih dahulu.

Pembayaran menggunakan **QRIS dinamis**, sehingga nominal pembayaran otomatis sesuai total transaksi.

Setelah pembayaran terverifikasi:

```text
Pembayaran
    ↓
Order PAID
    ↓
Rental dibuat
    ↓
Akses diberikan
    ↓
Customer menerima notifikasi
    ↓
Customer dapat mengakses dashboard
```

---

# 2. Tujuan Produk

### Tujuan utama

Membangun platform rental digital yang:

- mudah digunakan
- cepat dalam proses checkout
- memiliki pembayaran QRIS otomatis
- mampu memberikan akses digital secara otomatis
- fleksibel terhadap berbagai model produk
- memiliki dashboard customer
- memiliki dashboard admin
- dapat dikembangkan menjadi platform rental digital yang lebih besar

### Prinsip utama

> **Customer tidak perlu melakukan banyak langkah untuk mendapatkan produk yang sudah dibayarnya.**

---

# 3. Target User

## Customer

Orang yang ingin menyewa atau membeli akses produk digital dalam periode tertentu.

Contoh:

- software
- akun digital
- membership
- layanan digital
- license
- tools
- akses website
- resource digital
- layanan berbasis subscription

## Admin

Pemilik Flash Rent yang mengelola:

- produk
- paket
- harga
- order
- pembayaran
- rental
- akses customer
- customer
- notifikasi
- konfigurasi sistem

Untuk versi pertama:

> **Hanya ada 1 admin.**

---

# 4. Scope MVP

### Customer

- melihat produk
- melihat detail produk
- melihat paket
- memilih paket
- checkout sebagai guest
- pembayaran QRIS
- melihat status pembayaran
- menerima akses
- melihat rental
- melihat order
- melihat riwayat pembayaran
- login ke dashboard setelah pembelian
- melihat credential/license/access URL
- memperpanjang rental

### Admin

- login admin
- dashboard
- CRUD produk
- CRUD paket
- mengatur harga
- mengatur durasi
- mengatur tipe paket
- mengatur tipe akses
- melihat order
- melihat pembayaran
- melihat rental
- mengelola akses
- melihat customer
- mengirim/mengelola notifikasi

---

# 5. Product Model

Flash Rent tidak mengasumsikan bahwa semua produk memiliki gambar.

Produk minimal dapat dibuat hanya dengan:

```text
Nama Produk
Deskripsi
Kategori
Status
```

Gambar bersifat:

> **Optional**

Contoh produk tanpa gambar:

```text
Canva Pro
```

Tidak masalah.

UI dapat menggunakan typography/card sederhana sebagai fallback.

---

# 6. Struktur Produk

```text
Product
│
├── Basic Information
│   ├── Name
│   ├── Description
│   ├── Category
│   └── Status
│
└── Packages
    ├── Package A
    ├── Package B
    └── Package C
```

Contoh:

```text
Canva Pro
│
├── 7 Hari
│   Rp5.000
│
├── 30 Hari
│   Rp15.000
│
└── Unlimited
    Rp100.000
```

---

# 7. Sistem Paket Fleksibel

Ini salah satu requirement penting Flash Rent.

Paket **tidak boleh selalu mengharuskan durasi**.

Sistem harus mendukung minimal:

### Limited

```text
7 Hari
30 Hari
90 Hari
1 Tahun
```

### Unlimited

```text
Unlimited
```

---

## Tipe Duration

Saya sarankan menggunakan:

```text
duration_type
```

dengan nilai:

```text
LIMITED
UNLIMITED
```

Jika:

```text
LIMITED
```

maka:

```text
duration_value
duration_unit
```

digunakan.

Contoh:

```text
duration_value = 30
duration_unit = DAYS
```

Sedangkan:

```text
UNLIMITED
```

tidak membutuhkan tanggal expiry.

---

# 8. Contoh Paket

### Paket Limited

```text
Nama:
30 Hari

Harga:
Rp15.000

Duration:
30 DAYS
```

Rental:

```text
Start:
02 September 2026

End:
02 Oktober 2026
```

### Paket Unlimited

```text
Nama:
Unlimited

Harga:
Rp100.000

Duration:
UNLIMITED
```

Rental:

```text
Start:
02 September 2026

End:
NULL

Status:
ACTIVE
```

---

# 9. Aturan Unlimited

Unlimited **bukan berarti sistem harus menghitung tanggal expiry yang sangat jauh**.

Gunakan:

```text
expires_at = null
```

sehingga sistem dapat membedakan:

```text
expires_at != null
```

→ rental terbatas.

Sedangkan:

```text
expires_at == null
```

→ unlimited.

Ini lebih bersih untuk database.

---

# 10. Access Model

Flash Rent harus mendukung beberapa tipe akses.

## License Key

```text
LICENSE_KEY
```

Contoh:

```text
XXXX-XXXX-XXXX-XXXX
```

---

## Credential

```text
CREDENTIAL
```

Contoh:

```text
Username:
customer@example.com

Password:
********
```

---

## Access URL

```text
ACCESS_URL
```

Contoh:

```text
https://example.com/access/xxxxx
```

---

## Multiple Access

Satu rental dapat memiliki beberapa akses.

Contoh:

```text
Rental
│
└── Access
    ├── License Key
    ├── Username
    ├── Password
    └── URL
```

Ini membuat sistem jauh lebih fleksibel.

---

# 11. Customer Checkout

Customer **tidak wajib membuat akun sebelum checkout**.

Flow:

```text
Product
 ↓
Package
 ↓
Checkout
 ↓
Customer Information
 ↓
Create Order
 ↓
Generate QRIS
 ↓
Payment
```

Customer mengisi minimal:

```text
Nama
Email
WhatsApp
```

---

# 12. Mengapa Guest Checkout?

Karena registration sebelum pembayaran dapat meningkatkan friction.

Flash Rent menggunakan pendekatan:

> **Buy first, account later.**

Customer tidak perlu:

```text
Register
↓
Verify email
↓
Login
↓
Checkout
```

Cukup:

```text
Checkout
↓
Bayar
↓
Akses
```

---

# 13. Account Creation

Setelah pembayaran berhasil:

```text
Payment PAID
      ↓
Customer Account
      ↓
Link Order
      ↓
Link Rental
```

Jika email belum memiliki akun:

```text
Create Customer Account
```

Jika sudah memiliki akun:

```text
Use Existing Customer
```

Dengan demikian satu customer bisa mempunyai banyak order.

---

# 14. Authentication

Rekomendasi:

```text
Firebase Authentication
```

Untuk customer, sistem dapat menggunakan:

> **Email OTP / passwordless authentication**

Tujuannya agar customer tidak perlu mengingat password.

Admin dapat menggunakan authentication yang lebih ketat.

---

# 15. Customer Flow

```text
┌──────────────┐
│   Homepage   │
└──────┬───────┘
       ↓
┌──────────────┐
│   Products   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Product Detail│
└──────┬───────┘
       ↓
┌──────────────┐
│ Select Package│
└──────┬───────┘
       ↓
┌──────────────┐
│   Checkout   │
└──────┬───────┘
       ↓
┌──────────────┐
│ Dynamic QRIS │
└──────┬───────┘
       ↓
┌──────────────┐
│    PAID      │
└──────┬───────┘
       ↓
┌──────────────┐
│ Rental Active│
└──────┬───────┘
       ↓
┌──────────────┐
│ Access Given │
└──────────────┘
```

---

# 16. QRIS Payment

Target architecture:

```text
React
 ↓
Backend
 ↓
Create Payment
 ↓
QRIS Dynamic
 ↓
Customer Scan
 ↓
Payment Provider
 ↓
Webhook
 ↓
Backend
 ↓
Verify Payment
 ↓
Firestore
```

### Penting

Frontend **tidak boleh menentukan pembayaran berhasil**.

Tidak boleh:

```text
Frontend
↓
User klik "Saya Sudah Bayar"
↓
PAID
```

Status harus berasal dari sistem pembayaran/webhook.

---

# 17. Payment State

Gunakan state:

```text
PENDING
```

```text
PAID
```

```text
FAILED
```

```text
EXPIRED
```

```text
CANCELLED
```

Flow normal:

```text
PENDING
   ↓
PAID
```

Jika QRIS kadaluarsa:

```text
PENDING
   ↓
EXPIRED
```

---

# 18. Order State

Order dan Payment dipisahkan.

Order:

```text
PENDING_PAYMENT
PAID
PROCESSING
COMPLETED
CANCELLED
EXPIRED
```

Contoh:

```text
Order
FR-20260902-0001

Status:
PAID
```

---

# 19. Setelah Pembayaran

Begitu payment terverifikasi:

```text
Payment
   ↓
Order PAID
   ↓
Create Rental
   ↓
Create/Assign Access
   ↓
Rental ACTIVE
   ↓
Send Notification
```

Idealnya proses ini dilakukan secara server-side melalui **Firebase Cloud Functions**.

---

# 20. Rental

Rental merupakan objek yang menunjukkan hak customer menggunakan produk.

Contoh:

```text
Rental ID:
RNT-00001

Customer:
customer@example.com

Product:
Canva Pro

Package:
30 Hari

Started:
02 Sep 2026

Expires:
02 Oct 2026

Status:
ACTIVE
```

Unlimited:

```text
Started:
02 Sep 2026

Expires:
NULL

Status:
ACTIVE
```

---

# 21. Rental Status

Minimal:

```text
PENDING
ACTIVE
EXPIRING
EXPIRED
CANCELLED
```

Contoh:

```text
ACTIVE
 ↓
H-7
 ↓
EXPIRING
 ↓
EXPIRED
```

Untuk unlimited:

```text
ACTIVE
```

dan tidak masuk expiry.

---

# 22. Renewal / Perpanjangan

Customer dapat memperpanjang rental.

Contoh:

```text
Rental aktif

Canva Pro
Berakhir:
02 Oktober

[ PERPANJANG ]
```

Customer memilih:

```text
30 Hari
Rp15.000
```

Kemudian:

```text
QRIS
 ↓
PAID
 ↓
Extend Rental
```

Tanggal:

```text
Old:
02 Oktober

New:
01 November
```

Jika rental sudah expired:

```text
Expired
 ↓
Renew
 ↓
New Rental Period
```

---

# 23. Customer Dashboard

Menu:

```text
Dashboard
├── Overview
├── My Rentals
├── Orders
├── Payments
├── Access
├── Notifications
└── Account
```

---

# 24. Dashboard Overview

Menampilkan:

```text
Active Rentals
Expiring Soon
Total Orders
```

Contoh:

```text
Welcome back 👋

Active Rentals
3

Expiring Soon
1

Total Orders
12
```

Kemudian:

```text
My Active Rentals

Canva Pro
30 Days

23 days remaining

[View Access]
[Renew]
```

---

# 25. My Rentals

Menampilkan seluruh rental:

```text
Canva Pro
30 Hari
ACTIVE

Spotify Premium
30 Hari
ACTIVE

Software X
7 Hari
EXPIRED
```

Filter:

```text
All
Active
Expiring
Expired
```

---

# 26. Access Page

Contoh:

```text
Canva Pro
30 Hari

Status
● ACTIVE

Valid Until
02 October 2026

────────────────

LICENSE KEY

XXXX-XXXX-XXXX-XXXX

[ COPY ]

────────────────
```

Jika credential:

```text
USERNAME

example@email.com

PASSWORD

••••••••••••

[ SHOW ]
[ COPY ]
```

Jika URL:

```text
ACCESS URL

[ OPEN ACCESS ]
```

UI hanya menampilkan field yang memang tersedia.

---

# 27. Order History

Customer dapat melihat:

```text
Order ID
Product
Package
Amount
Payment Status
Date
```

Contoh:

| Order  | Product    | Package |   Amount | Status |
| ------ | ---------- | ------- | -------: | ------ |
| FR-001 | Canva Pro  | 30 Hari | Rp15.000 | PAID   |
| FR-002 | Software X | 7 Hari  | Rp10.000 | PAID   |

---

# 28. Invoice

Setiap order memiliki informasi:

```text
Flash Rent
Invoice

Order:
FR-20260902-0001

Customer:
John Doe

Product:
Canva Pro

Package:
30 Hari

Subtotal:
Rp15.000

Total:
Rp15.000

Payment:
QRIS

Status:
PAID
```

PDF invoice bisa menjadi fitur tahap berikutnya jika belum dibutuhkan di MVP.

---

# 29. Notification System

Notifikasi internal:

```text
Payment Successful
Rental Activated
Rental Expiring
Rental Expired
Renewal Successful
```

Contoh:

> Pembayaran berhasil. Rental Canva Pro kamu sudah aktif.

---

# 30. Admin Dashboard

Admin melihat:

```text
Dashboard
Products
Packages
Orders
Payments
Rentals
Customers
Access
Notifications
Settings
```

---

# 31. Admin Dashboard Overview

Metric:

```text
Revenue Today
Revenue This Month
Total Orders
Paid Orders
Active Rentals
Expiring Rentals
Total Customers
```

Contoh:

```text
Today's Revenue
Rp1.250.000

Orders
42

Active Rentals
31

Expiring Soon
7
```

---

# 32. Product Management

Admin dapat:

```text
Create Product
Edit Product
Delete Product
Activate Product
Deactivate Product
```

Field:

```text
Name
Description
Category
Status
Image (optional)
```

---

# 33. Package Management

Setiap produk dapat memiliki banyak paket.

Admin:

```text
Product
 ↓
Packages
```

Paket:

```text
Name
Price
Duration Type
Duration Value
Duration Unit
Description
Status
```

Contoh:

```text
Unlimited
Rp100.000
UNLIMITED
```

atau:

```text
30 Hari
Rp15.000
LIMITED
30 DAYS
```

---

# 34. Access Management

Admin dapat memasukkan:

```text
License Key
Username
Password
Access URL
```

atau kombinasi.

Admin dapat melihat access yang terkait dengan rental.

**Data sensitif seperti password credential tidak boleh ditampilkan sembarangan.**

---

# 35. Customer Management

Admin dapat melihat:

```text
Customer
Email
WhatsApp
Total Orders
Active Rentals
Joined Date
```

Admin dapat membuka detail:

```text
Customer
 ↓
Orders
 ↓
Payments
 ↓
Rentals
 ↓
Access
```

---

# 36. Security

Ini bagian yang sangat penting.

### Frontend

Tidak boleh menyimpan:

- payment secret
- webhook secret
- API secret
- private credential

### Backend

Secret disimpan menggunakan environment/configuration yang aman.

### Firestore

Customer hanya boleh membaca data miliknya.

Contoh konsep:

```text
Customer A
   ↓
hanya bisa membaca
Order milik Customer A
Rental milik Customer A
Access milik Customer A
```

Tidak boleh:

```text
Customer A
 ↓
membaca Rental Customer B
```

---

# 37. Arsitektur Sistem

```text
                 ┌─────────────────┐
                 │    React + Vite │
                 │    Tailwind CSS  │
                 └────────┬────────┘
                          │
                          ↓
                    Firebase Auth
                          │
                          ↓
                   Cloud Functions
                    /            \
                   /              \
                  ↓                ↓
           Firestore            Payment API
              │                     │
              │                     ↓
              │                 Dynamic QRIS
              │                     │
              │                     ↓
              │                  Webhook
              │                     │
              └──────────┬──────────┘
                         ↓
                     Firestore
                         ↓
                     Customer
```

---

# 38. Teknologi

## Frontend

```text
React
Vite
Tailwind CSS
Axios
React Router
Firebase SDK
```

Saya juga merekomendasikan:

```text
React Hook Form
Zod
```

untuk validasi form.

Untuk state management MVP, belum perlu langsung memakai Redux. Kita bisa menggunakan:

```text
React Context
+
TanStack Query
```

jika kebutuhan fetching/cache mulai kompleks.

---

# 39. Backend

```text
Firebase Authentication
Cloud Firestore
Cloud Functions
Firebase Storage
Firebase App Check
```

---

# 40. Database Concept

Struktur utama:

```text
users
products
packages
orders
payments
rentals
accesses
notifications
settings
```

Relasi:

```text
User
 │
 ├──── Orders
 │        │
 │        └──── Payment
 │
 └──── Rentals
           │
           └──── Access

Product
 │
 └──── Packages
```

---

# 41. Product Data

Konsep:

```text
products/{productId}

name
description
category
imageUrl
status
createdAt
updatedAt
```

`imageUrl` bersifat optional.

---

# 42. Package Data

```text
packages/{packageId}

productId
name
description
price

durationType
durationValue
durationUnit

status

createdAt
updatedAt
```

Contoh unlimited:

```text
durationType: "UNLIMITED"
durationValue: null
durationUnit: null
```

---

# 43. Order Data

```text
orders/{orderId}

orderNumber
userId
customerName
customerEmail
customerWhatsapp

productId
packageId

productName
packageName

amount

status

createdAt
updatedAt
```

Snapshot nama produk/paket pada order penting agar histori transaksi tetap benar meskipun admin nantinya mengubah nama produk.

---

# 44. Payment Data

```text
payments/{paymentId}

orderId

provider
paymentMethod

amount
status

qrCode
expiresAt

providerTransactionId

paidAt
createdAt
updatedAt
```

---

# 45. Rental Data

```text
rentals/{rentalId}

userId
orderId

productId
packageId

startAt
expiresAt

durationType

status

createdAt
updatedAt
```

Unlimited:

```text
expiresAt: null
```

---

# 46. Access Data

```text
accesses/{accessId}

rentalId
userId

type

licenseKey
username
password
accessUrl

createdAt
updatedAt
```

Namun untuk data credential sensitif, implementasi final sebaiknya menggunakan pendekatan keamanan yang lebih ketat daripada sekadar field Firestore biasa.

---

# 47. Notification Data

```text
notifications/{notificationId}

userId

type
title
message

read

createdAt
```

---

# 48. Payment-to-Rental Transaction

Ini harus atomik sebisa mungkin:

```text
Webhook
 ↓
Verify Payment
 ↓
Check Order
 ↓
Jika belum PAID
 ↓
Set Payment PAID
 ↓
Set Order PAID
 ↓
Create Rental
 ↓
Create Access
 ↓
Create Notification
```

Harus ada mekanisme **idempotency**.

Karena webhook pembayaran bisa saja dikirim lebih dari sekali.

Jangan sampai:

```text
Webhook #1
→ Rental dibuat

Webhook #2
→ Rental kedua dibuat
```

Yang benar:

```text
Webhook #1
→ Process

Webhook #2
→ Already processed
→ Ignore
```

---

# 49. Expiry Automation

Untuk rental terbatas:

```text
expiresAt
```

digunakan sebagai sumber kebenaran.

Sistem dapat menjalankan scheduled Cloud Function untuk:

```text
H-7
H-3
H-1
Expired
```

Unlimited tidak ikut proses expiry.

---

# 50. Error Handling

Jika pembayaran gagal:

```text
Payment Failed
```

Customer mendapatkan opsi:

```text
[ Coba Lagi ]
```

Jika QRIS expired:

```text
QRIS Expired

[ Generate QRIS Baru ]
```

Jika akses gagal dibuat:

```text
Payment:
PAID

Rental:
PROCESSING

Access:
PENDING
```

Admin mendapatkan notifikasi agar masalah dapat ditangani.

---

# 51. Edge Cases

Sistem harus menangani:

### Customer menutup halaman QRIS

Order tetap:

```text
PENDING
```

Customer dapat kembali ke halaman order.

### Customer membayar setelah halaman ditutup

Webhook tetap memproses pembayaran.

### Webhook datang dua kali

Tidak membuat rental duplikat.

### Customer refresh halaman

Status tetap berdasarkan Firestore/backend.

### QRIS expired

Order/payment berubah menjadi:

```text
EXPIRED
```

### Pembayaran berhasil tetapi provisioning gagal

Order tetap:

```text
PAID
```

Rental:

```text
PROCESSING
```

Admin dapat melakukan retry provisioning.

---

# 52. UX Principles

Flash Rent harus terasa:

**Cepat**

Customer tidak melewati banyak halaman.

**Minimal**

Tidak memaksa registration sebelum checkout.

**Jelas**

Harga, durasi, status pembayaran dan masa rental harus jelas.

**Trustworthy**

Customer selalu bisa melihat:

```text
Order ID
Payment Status
Rental Status
Expiry
Access
```

---

# 53. Navigation Customer

Desktop:

```text
FLASH RENT

Home
Products
My Rentals
Orders

                Notifications
                Account
```

Mobile:

```text
Home
Products
Rentals
Orders
Account
```

---

# 54. Navigation Admin

```text
FLASH RENT ADMIN

Dashboard

Catalog
 ├── Products
 └── Packages

Transactions
 ├── Orders
 └── Payments

Rentals
 └── Active Rentals

Customers

Access

Notifications

Settings
```

---

# 55. Homepage

Struktur:

```text
Navbar
 ↓
Hero
 ↓
Featured / Popular Products
 ↓
Categories
 ↓
How Flash Rent Works
 ↓
Benefits
 ↓
FAQ
 ↓
Footer
```

Tidak perlu semua produk memiliki gambar.

Product card dapat memiliki:

```text
Product Name
Short Description
Starting Price
Available Packages
[ View Product ]
```

---

# 56. Product Detail

```text
Product Name

Description

Available Packages

┌──────────────────────┐
│ 7 Hari               │
│ Rp5.000              │
│                      │
│ [ Sewa Sekarang ]    │
└──────────────────────┘

┌──────────────────────┐
│ 30 Hari              │
│ Rp15.000             │
│                      │
│ [ Sewa Sekarang ]    │
└──────────────────────┘

┌──────────────────────┐
│ Unlimited            │
│ Rp100.000            │
│                      │
│ [ Sewa Sekarang ]    │
└──────────────────────┘
```

---

# 57. Checkout

```text
Checkout

Product
Canva Pro

Package
30 Hari

Price
Rp15.000

Customer Information

Nama
[____________]

Email
[____________]

WhatsApp
[____________]

────────────────

Total
Rp15.000

[ Lanjut Pembayaran ]
```

---

# 58. Payment Page

```text
Payment

Order:
FR-20260902-0001

Total:
Rp15.000

Scan QRIS

       █████████
       █ QRIS  █
       █████████

Expires in:
14:32

Waiting for payment...

● Waiting for payment
```

Jika pembayaran berhasil:

```text
✓ Payment Successful

Your rental is now active.

[ View Rental ]
```

---

# 59. Success Page

```text
🎉 Payment Successful

Order #FR-20260902-0001

Canva Pro
30 Hari

Rental:
ACTIVE

Valid Until:
02 October 2026

[ View Access ]

[ Go to Dashboard ]
```

---

# 60. Non-Functional Requirements

### Performance

Target:

- halaman cepat
- lazy loading
- optimasi bundle
- responsive
- mobile-first

### Security

- Firebase Security Rules
- Firebase App Check
- server-side payment verification
- secret tidak berada di frontend
- akses data berdasarkan ownership

### Reliability

Payment webhook harus idempotent.

### Scalability

Database harus memungkinkan:

```text
100 users
→ 1.000 users
→ 10.000 users
→ 100.000 users
```

tanpa perlu mengubah fundamental arsitektur.

---

# 61. MVP Prioritas

### P0 — Wajib

```text
Authentication
Product
Package
Checkout
Order
Dynamic QRIS
Payment Verification
Rental
Access
Customer Dashboard
Admin Dashboard
```

### P1 — Penting

```text
Renewal
Notification
Invoice
Expiry Reminder
```

### P2 — Pengembangan berikutnya

```text
Promo Code
Referral
Analytics
Multiple Admin
Affiliate
Subscription
Advanced Reporting
WhatsApp Automation
```

---

# 62. Success Criteria

Flash Rent dianggap berhasil apabila:

```text
Customer
 ↓
Pilih produk
 ↓
Pilih paket
 ↓
Checkout
 ↓
Bayar QRIS
 ↓
Payment otomatis terdeteksi
 ↓
Order otomatis PAID
 ↓
Rental otomatis dibuat
 ↓
Access otomatis tersedia
 ↓
Customer dapat melihat akses
```

**Tanpa intervensi admin pada alur pembayaran normal.**

---

# 63. Prinsip Final Flash Rent

Saya menyarankan kita menjadikan ini sebagai prinsip arsitektur:

> **Payment is the trigger, Rental is the entitlement, Access is the delivery.**

Artinya:

```text
PAYMENT
   ↓
membuktikan customer sudah membayar

ORDER
   ↓
mencatat transaksi

RENTAL
   ↓
menentukan hak penggunaan

ACCESS
   ↓
memberikan apa yang customer beli
```

Ini akan membuat Flash Rent jauh lebih mudah dikembangkan.

---

## Roadmap implementasi

Saya sarankan pembangunan dilakukan dalam urutan berikut:

```text
PHASE 1
Project Setup
React + Vite
Tailwind
Firebase
Routing
Architecture

        ↓

PHASE 2
Firestore
Products
Packages
Users

        ↓

PHASE 3
Customer UI
Homepage
Products
Product Detail
Checkout

        ↓

PHASE 4
Order System
Payment
Dynamic QRIS
Webhook

        ↓

PHASE 5
Rental Engine
Unlimited
Limited Duration
Expiry
Renewal

        ↓

PHASE 6
Access System
License
Credential
URL

        ↓

PHASE 7
Customer Dashboard

        ↓

PHASE 8
Admin Dashboard

        ↓

PHASE 9
Security
Testing
Error Handling

        ↓

PHASE 10
Production
```

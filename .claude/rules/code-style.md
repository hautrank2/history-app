---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
  - "scripts/**/*.mjs"
---

# Format code dễ đọc

- Lấy cách trình bày trong `src/app/characters/_components/ho-chi-minh-life/index.tsx` làm mẫu: code có thụt lề và xuống dòng rõ ràng, không nén component hoặc handler dài vào một dòng. File mẫu chỉ minh họa format; quy định import, TypeScript và cấu trúc component vẫn theo `CLAUDE.md`.
- Thụt lề bằng 2 space, không dùng tab. Dùng dấu nháy kép cho chuỗi và JSX attribute, dấu chấm phẩy cuối statement, dấu phẩy cuối phần tử/tham số khi viết nhiều dòng và cú pháp cho phép.
- Ưu tiên độ dài dòng khoảng 80 ký tự. Xuống dòng ở ranh giới cú pháp; không cắt chuỗi, URL hoặc className Tailwind chỉ để đủ giới hạn.
- Import ngắn có thể viết một dòng; danh sách import dài thì mỗi tên một dòng. Giữ nhóm import ngoài, nội bộ và tương đối theo `CLAUDE.md`; không sao chép thứ tự import chưa chuẩn từ file mẫu.
- JSX ngắn có thể giữ một dòng. JSX nhiều props hoặc có handler phức tạp phải xuống dòng: mỗi prop một dòng, nội dung con thụt vào một cấp, thẻ đóng nằm riêng. JSX return nhiều dòng bọc trong `(...)`.
- Callback, event handler và nhánh điều kiện có nhiều statement dùng block nhiều dòng, mỗi statement một dòng. Object, array và lời gọi hàm dài xuống dòng theo cấu trúc; không nối nhiều thao tác bằng dấu chấm phẩy trên cùng một dòng.
- Tách các nhóm import, type, khai báo và khối logic bằng dòng trống khi giúp dễ đọc; không chèn nhiều dòng trống liên tiếp. Không đổi logic hoặc refactor ngoài phạm vi chỉ để format.

## Sau khi viết hoặc sửa code

- Format các file vừa thay đổi trước khi bàn giao. Nếu dự án có formatter, dùng cấu hình và lệnh formatter đã khai báo trong dự án; formatter là nguồn quyết định việc ngắt dòng, không chỉnh tay ngược lại kết quả của nó.
- Nếu chưa có formatter, áp dụng các quy ước trên và báo đúng phần đã kiểm tra. Rule này là hướng dẫn, không tự cài đặt formatter hay đăng ký hook thực thi.
- Kiểm tra diff để tránh thay đổi ngoài phạm vi. Không chạy format toàn repository cho một yêu cầu sửa nhỏ. Format không thay thế TypeScript, lint hoặc các kiểm tra hành vi phù hợp với thay đổi.

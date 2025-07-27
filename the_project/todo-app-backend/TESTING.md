# Testing Guide untuk Todo App Backend

## Overview

File ini berisi test untuk `todosService.js` yang memastikan fungsi-fungsi tetap berjalan dengan benar ketika ada perubahan kode.

## Setup Testing

### Install Dependencies

```bash
npm install
```

### Menjalankan Test

#### Run semua test

```bash
npm test
```

#### Run test dengan watch mode (otomatis re-run ketika ada perubahan)

```bash
npm run test:watch
```

#### Run test dengan coverage report

```bash
npm run test:coverage
```

## Test Coverage

Test ini mencakup:

### `getTodos()` function:

- ✅ Mengembalikan todos yang diurutkan berdasarkan `created_at DESC`
- ✅ Mengembalikan array kosong ketika tidak ada todos
- ✅ Handle database errors dengan benar

### `createTodo(todoText)` function:

- ✅ Membuat todo baru dan mengembalikan data yang dibuat
- ✅ Handle empty string sebagai todo text
- ✅ Handle special characters dalam todo text
- ✅ Handle null/undefined todo text
- ✅ Handle database errors saat pembuatan

### Integration scenarios:

- ✅ Konsistensi data antara `getTodos` dan `createTodo`

## Mocking Strategy

Test menggunakan Jest mocks untuk:

- Database module (`./db`) - untuk mensimulasikan query database tanpa koneksi database nyata
- Query responses - untuk mengontrol data yang dikembalikan dari database

## File Structure

```
services/
├── todosService.js      # Source code
├── todosService.test.js # Test file
└── db.js               # Database module (dimock)
```

## Best Practices

1. **Isolation**: Setiap test berjalan independen dengan `jest.clearAllMocks()`
2. **Edge Cases**: Test mencakup skenario edge cases seperti empty data, special characters, dll
3. **Error Handling**: Test memastikan error handling berjalan dengan benar
4. **Assertions**: Setiap test memiliki assertions yang jelas untuk memverifikasi behavior

## Continuous Integration

Test ini dapat diintegrasikan ke CI/CD pipeline untuk memastikan:

- Kode baru tidak merusak fungsi yang sudah ada
- Coverage tetap maintained
- Error handling tetap robust

## Tips untuk Development

1. Jalankan `npm run test:watch` saat development untuk feedback real-time
2. Cek coverage report untuk memastikan semua kode tercover
3. Tambah test baru ketika menambah fungsi baru
4. Update test ketika mengubah behavior yang sudah ada

## Troubleshooting

### Jest tidak terinstall

```bash
npm install --save-dev jest
```

### Mock tidak bekerja

Pastikan path module di `jest.mock()` benar dan sesuai dengan struktur file.

### Test timeout

Tambah timeout di test yang membutuhkan waktu lama:

```javascript
it("should handle long operation", async () => {
  // test code
}, 10000); // 10 second timeout
```

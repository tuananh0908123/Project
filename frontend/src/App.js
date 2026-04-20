import React, { useState, useEffect } from 'react';

function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API sang Spring Boot. 
    // Trong thực tế khi lên K8s, anh sẽ cấu hình URL này qua biến môi trường hoặc Ingress
    fetch('http://localhost:8080/api/menu')
      .then(response => response.json())
      .then(data => {
        setMenuItems(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Lỗi kết nối API:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Hệ thống Quản lý Quán Cà Phê</h1>
      <h2>Danh sách đồ uống:</h2>
      
      {loading ? (
        <p>Đang tải dữ liệu từ Backend...</p>
      ) : (
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} style={{ fontSize: '18px', margin: '10px 0' }}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
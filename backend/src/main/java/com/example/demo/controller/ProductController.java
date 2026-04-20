package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
// Mở CORS cho phép React gọi sang, tương tự config trong file Go của anh
@CrossOrigin(origins = "*") 
public class ProductController {

    @GetMapping("/health")
    public String healthCheck() {
        return "Backend is running smoothly!";
    }

    @GetMapping("/menu")
    public List<String> getMenu() {
        // Trả về dữ liệu mẫu. Thực tế đoạn này anh sẽ gọi xuống Database.
        return Arrays.asList("Cà phê sữa đá", "Bạc xỉu", "Trà đào cam sả");
    }
}
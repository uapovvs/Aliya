package kz.kmg.dmaic.controller;

import jakarta.validation.Valid;
import kz.kmg.dmaic.dto.AuthResponse;
import kz.kmg.dmaic.dto.LoginRequest;
import kz.kmg.dmaic.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}

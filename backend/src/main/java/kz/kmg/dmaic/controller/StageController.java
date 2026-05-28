package kz.kmg.dmaic.controller;

import jakarta.validation.Valid;
import kz.kmg.dmaic.dto.StageContentRequest;
import kz.kmg.dmaic.dto.StageResponse;
import kz.kmg.dmaic.entity.Stage;
import kz.kmg.dmaic.service.StageService;
import kz.kmg.dmaic.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stages")
@RequiredArgsConstructor
public class StageController {

    private final StageService stageService;
    private final UserService userService;

    @GetMapping("/my")
    public ResponseEntity<List<StageResponse>> getMyStages(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(stageService.getMyStages(resolveUserId(ud)));
    }

    @PutMapping("/{stage}")
    public ResponseEntity<StageResponse> saveContent(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Stage stage,
            @RequestBody StageContentRequest request) {
        return ResponseEntity.ok(stageService.saveContent(resolveUserId(ud), stage, request));
    }

    @PostMapping("/{stage}/submit")
    public ResponseEntity<StageResponse> submit(
            @AuthenticationPrincipal UserDetails ud,
            @PathVariable Stage stage) {
        return ResponseEntity.ok(stageService.submitForReview(resolveUserId(ud), stage));
    }

    private Long resolveUserId(UserDetails ud) {
        return userService.findIdByUsername(ud.getUsername());
    }
}

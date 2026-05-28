package kz.kmg.dmaic.service;

import kz.kmg.dmaic.dto.StageContentRequest;
import kz.kmg.dmaic.dto.StageResponse;
import kz.kmg.dmaic.dto.StageReviewRequest;
import kz.kmg.dmaic.entity.*;
import kz.kmg.dmaic.repository.DmaicStageRepository;
import kz.kmg.dmaic.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StageService {

    private final DmaicStageRepository stageRepository;
    private final ProjectRepository projectRepository;
    private final BarrelService barrelService;

    public List<StageResponse> getMyStages(Long userId) {
        Project project = getOrCreateProject(userId);
        return stageRepository.findByProjectId(project.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public StageResponse saveContent(Long userId, Stage stage, StageContentRequest request) {
        Project project = getOrCreateProject(userId);
        DmaicStage dmaicStage = stageRepository
                .findByProjectIdAndStage(project.getId(), stage)
                .orElseGet(() -> DmaicStage.builder()
                        .project(project)
                        .stage(stage)
                        .status(StageStatus.DRAFT)
                        .build());

        if (dmaicStage.getStatus() == StageStatus.APPROVED) {
            throw new IllegalStateException("Cannot edit an approved stage");
        }
        dmaicStage.setContent(request.content());
        dmaicStage.setStatus(StageStatus.DRAFT);
        return toResponse(stageRepository.save(dmaicStage));
    }

    @Transactional
    public StageResponse submitForReview(Long userId, Stage stage) {
        Project project = getOrCreateProject(userId);
        DmaicStage dmaicStage = stageRepository
                .findByProjectIdAndStage(project.getId(), stage)
                .orElseThrow(() -> new IllegalArgumentException("Stage not found"));

        dmaicStage.setStatus(StageStatus.SUBMITTED);
        dmaicStage.setSubmittedAt(LocalDateTime.now());
        return toResponse(stageRepository.save(dmaicStage));
    }

    @Transactional
    public StageResponse reviewStage(Long stageId, StageReviewRequest request) {
        DmaicStage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new IllegalArgumentException("Stage not found: " + stageId));

        stage.setAdminScore(request.score());
        stage.setAdminComment(request.comment());
        stage.setStatus(StageStatus.APPROVED);
        stage.setReviewedAt(LocalDateTime.now());
        return toResponse(stageRepository.save(stage));
    }

    public List<StageResponse> getSubmittedStages() {
        return stageRepository.findByStatus(StageStatus.SUBMITTED).stream()
                .map(this::toResponse)
                .toList();
    }

    private Project getOrCreateProject(Long userId) {
        return projectRepository.findByUserId(userId)
                .orElseGet(() -> projectRepository.save(
                        Project.builder()
                                .user(new kz.kmg.dmaic.entity.User())
                                .title("Мой проект")
                                .build()));
    }

    private StageResponse toResponse(DmaicStage s) {
        return new StageResponse(
                s.getId(),
                s.getStage().name(),
                s.getContent(),
                s.getStatus().name(),
                s.getAdminScore(),
                s.getAdminComment(),
                s.getDeadline(),
                s.getSubmittedAt(),
                s.getReviewedAt(),
                barrelService.calculateBarrels(s.getAdminScore()));
    }
}

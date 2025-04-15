package com.ssafy.pwandora.pwa.repository.screenshot;

import com.ssafy.pwandora.pwa.entity.screenshot.Screenshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScreenshotRepository extends JpaRepository<Screenshot, Integer> {
    List<Screenshot> findByPwaIdOrderByScreenshotOrder(Integer pwaId);
}

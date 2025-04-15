package com.ssafy.pwandora.pwa.repository.display;

import com.ssafy.pwandora.pwa.entity.display.Display;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisplayRepository extends JpaRepository<Display, Integer> {
    Optional<Display> findByPwaId(Integer pwaId);
}

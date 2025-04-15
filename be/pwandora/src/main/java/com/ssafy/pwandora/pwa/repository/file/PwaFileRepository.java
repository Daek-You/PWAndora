package com.ssafy.pwandora.pwa.repository.file;
import com.ssafy.pwandora.pwa.entity.file.PwaFile;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface PwaFileRepository extends JpaRepository<PwaFile, Integer> {
    @Query(value = "WITH ranked_files AS (" +
            "  SELECT *, ROW_NUMBER() OVER (" +
            "    PARTITION BY file_type " +
            "    ORDER BY COALESCE(updated_at, created_at) DESC" +
            "  ) as rn " +
            "  FROM pwa_file " +
            "  WHERE pwa_id = :pwaId AND file_type IN ('WGT', 'APK')" +
            ") " +
            "SELECT * FROM ranked_files WHERE rn = 1",
            nativeQuery = true)
    List<PwaFile> findLatestFilesByPwaIdForEachType(@Param("pwaId") Integer pwaId);
}

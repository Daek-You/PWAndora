package com.ssafy.pwandora.log.repository;

import com.ssafy.pwandora.log.entity.Log;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LogRepository extends ElasticsearchRepository<Log, String>, CustomLogRepository {
}

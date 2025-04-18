package com.ssafy.pwandora.event.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ssafy.pwandora.event.entity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

	List<Event> findTop5ByOrderByCreatedAtDesc();
}

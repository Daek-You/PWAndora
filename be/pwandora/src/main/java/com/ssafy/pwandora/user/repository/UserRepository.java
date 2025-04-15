package com.ssafy.pwandora.user.repository;

import com.ssafy.pwandora.pwa.entity.Pwa;
import com.ssafy.pwandora.pwa.entity.category.PwaCategory;
import com.ssafy.pwandora.user.entity.User;
import com.ssafy.pwandora.user.entity.UserPwa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByLoginId(String loginId);        // 아이디 중복 검사용 메서드
    Optional<User> findByLoginId(String loginId);   // 로그인 시, 사용자 찾기용 메서드
    // 특정 유저의 설치한 앱 목록 가져오기
    @Query("SELECT up FROM UserPwa up JOIN FETCH up.user JOIN FETCH up.pwa WHERE up.user.id = :userId")
    List<UserPwa> findMyPagePwasByUserId(@Param("userId") Integer userId);
}

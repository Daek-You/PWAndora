package com.ssafy.pwandora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class PwandoraApplication {

	public static void main(String[] args) {
		SpringApplication.run(PwandoraApplication.class, args);
	}

}

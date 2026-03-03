package bank.bankStatement.CreditScore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class CreditScoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(CreditScoreApplication.class, args);
	}

	// Register RestTemplate as a Spring-managed bean
	// Injected into MlApiService to make HTTP calls to the FastAPI ML engine
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}

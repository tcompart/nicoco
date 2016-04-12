package de.nicoco;

import de.nicoco.usermanagement.User;
import de.nicoco.usermanagement.UserRepository;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.UUID;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.junit.Assert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(Application.class)
@ActiveProfiles("test")
public class ApplicationIT {

  private final UUID id = UUID.randomUUID();
  private final User me = User.builder().id(id).email("me@email.com").username("me").build();
  @Autowired
  private UserRepository userRepository;

  @After
  public void clearRepository() {
    userRepository.deleteAll();
  }

  @Test
  public void uuidGivenIsOverwritten() {
    userRepository.save(me);
    final User user = userRepository.findByEmail("me@email.com");
    assertThat(user, notNullValue());
    assertThat(user.getId(), not(id));
    assertThat(user.getEmail(), is("me@email.com"));
  }

  @Test
  public void startingApplicationWithAddingAndAccessingUserByEmail() {
    userRepository.save(me);
    final User user = userRepository.findByEmail("me@email.com");
    assertThat(user, notNullValue());
    assertThat(user.getId(), notNullValue());
    assertThat(user.getUsername(), is("me"));
  }

  @Test
  public void startingApplicationWithAddingAndAccessingUserByUsername() {
    userRepository.save(me);
    final User user = userRepository.findByUsername("me");
    assertThat(user, notNullValue());
    assertThat(user.getId(), notNullValue());
    assertThat(user.getEmail(), is("me@email.com"));
  }
}

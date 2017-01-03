package de.nicoco.usermanagement;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.Setter;
import lombok.experimental.Tolerate;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
@Entity
@Table(name = "user")
public class User {

  @Id
  @Setter(value = AccessLevel.PROTECTED)
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  @Column(length = 36, unique = true)
  private UUID id;
  private String email;
  private String username;
  private Date created;
  private Date logedin;
  private String passwordHash;
  @Tolerate
  public User() {
  }

}

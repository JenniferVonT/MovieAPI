-- -----------------------------------------------------
-- Table `movie_db`.`Actor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Actor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `gender` INT NULL DEFAULT NULL,
  `profile_path` VARCHAR(150) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ID_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `movie_db`.`Genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Genre` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(500) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ID_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `movie_db`.`movie`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Movie` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(250) NOT NULL,
  `release_year` YEAR NULL DEFAULT NULL,
  `description` VARCHAR(2000) NULL DEFAULT NULL,
  `poster_path` VARCHAR(150) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ID_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `movie_db`.`movie_has_genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Movie_has_Genre` (
  `genre_id` INT NOT NULL,
  `movie_id` INT NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`genre_id`, `movie_id`, `id`),
  UNIQUE INDEX `ID_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Genre_has_Movie_Movie1_idx` (`movie_id` ASC) VISIBLE,
  INDEX `fk_Genre_has_Movie_Genre1_idx` (`genre_id` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 455494
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `movie_db`.`rating`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Rating` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `rating` DECIMAL(2,1) NULL DEFAULT NULL,
  `movie_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ID_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Rating_Movie1_idx` (`movie_id` ASC) VISIBLE,
  CONSTRAINT `fk_Rating_Movie1`
    FOREIGN KEY (`movie_id`)
    REFERENCES `Movie` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 145241
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `movie_db`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `character_name` VARCHAR(500) NULL DEFAULT NULL,
  `actor_id` INT NOT NULL,
  `movie_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ID_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Role_Actor_idx` (`actor_id` ASC) VISIBLE,
  INDEX `fk_Role_Movie1_idx` (`movie_id` ASC) VISIBLE,
  CONSTRAINT `fk_Role_Actor`
    FOREIGN KEY (`actor_id`)
    REFERENCES `Actor` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_Role_Movie1`
    FOREIGN KEY (`movie_id`)
    REFERENCES `Movie` (`id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `movie_db`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `User` (
  `id` CHAR(36) NOT NULL DEFAULT (UUID()),
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `unique_username` (`username` ASC) VISIBLE
) ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Fix the foreign keys.
-- -----------------------------------------------------
ALTER TABLE `Movie_has_Genre`
  ADD CONSTRAINT `fk_Genre_has_Movie_Genre1`
  FOREIGN KEY (`genre_id`)
  REFERENCES `Genre` (`id`)
  ON DELETE CASCADE,
  ADD CONSTRAINT `fk_Genre_has_Movie_Movie1`
  FOREIGN KEY (`movie_id`)
  REFERENCES `Movie` (`id`)
  ON DELETE CASCADE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

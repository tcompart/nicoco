<?php

class User {
	private $isLoggedIn;
	private $username;
	private $isAdmin;

	public function __construct($isLoggedIn, $username, $isAdmin) {
		$this->isLoggedIn = $isLoggedIn;
		$this->username = $username;
		$this->isAdmin = $isAdmin;
	}

	public function isLoggedIn() {
		return $this->isLoggedIn;
	}

	public function getName() {
		return $this->username;
	}

	public function isAdmin() {
		return $this->isAdmin;
	}
}

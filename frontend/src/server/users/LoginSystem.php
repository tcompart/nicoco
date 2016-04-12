<?php

class LoginSystem {
	public function __construct() {
		$this->$cache = phpFastCache("memcached");
	}
	
	public function login($name, $password) {
	}
	
	public function sendToken($name) {
		ob_end_clean(); # try to purge content sent so far
		$hash = substr(str_shuffle(MD5(microtime())), 0, 10);
		$cache->set($name+"_token", $results, 5);
		$data = [ 'token' => $hash ];
		$view = new JsonView();
		$view->render( $data );
		return true;
	}
	
	public function token($name) {
		return $cache->get($name + "_token");
	}
}

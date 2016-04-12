<?php

class Response {
	private $status;
	private $body;
	private $headers = [];
	public function __construct($status, array $headers, $body) {
		$this->status = (int) $status;
		$this->headers = $headers;
		$this->body = $body;
	}
	public function getStatus() {
		return $this->status;
	}
	public function getBody() {
		return $this->body;
	}
	public function getHeaders() {
		return $this->headers;
	}
}
